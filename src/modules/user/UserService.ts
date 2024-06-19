import { Request, Response } from "express";
import { IUserAccountStatus, SignupRequest } from "./UserInterface";
import User from "./UserModel";
import { /*AppError,*/ sendError } from "../../helper/error";
import { generateRandomNumber, generateToken, hashPassword, sendResponse } from "../../helper/methods";
import { mailController } from "../../../app";
import { EMAIL_USERNAME } from "../../config/env";
import { log } from "console";
import Profile from "../profile/ProfileModel";
import { GoogleOAuthService } from "../../third-party/google-oauth/GoogleOauthService";

export class UserService {

    private _googleOAuthService = new GoogleOAuthService()

    public signup = async (request:Request, response:Response) => {
        try {
            let payload:SignupRequest = request.body;
            let {
                fullname, email, phone_number, pronoun, city, postal_code,
                address, password, isGmail, token_id
            } = payload
            let token = await generateToken(payload)
            let verification_code = generateRandomNumber()
            // console.log({verification_code});
            // password = isGmail ? (generateRandomNumber() + generateRandomNumber()) : password
            if (address) {
                if (address.length < 10) {
                    response.status(400).send(sendError("Invalid address supplied"))
                    return null;
                }
            }
            let data = {
                fullname, email, phone_number, address, verification_code,
                password: hashPassword(password), pronoun, city, postal_code,
                is_verified: false, token: isGmail ? token : null
            };

            let is_email_verified = false
            log(payload)
            if (isGmail)
                if (isGmail.toString() == 'true') {
                    log("****************Checking Google OAuth***************")
                    if (!token_id) {
                        response.status(400).send(sendError("To signup with Google, please supply the token_id"));
                        return null;
                    } else {
                        // verify token ID
                        let {email, name} = await this._googleOAuthService.verifyGoogleIdToken(token_id);
                        if (email == null) {
                            response.status(400).send(sendError("Unfortunately we couldn't pick your 'email' up, please try again later"));
                            return null;
                        }
                        if (name == null) { 
                            response.status(400).send(sendError("Unfortunately we couldn't pick your 'name' up, please try again later"));
                            return null;
                        } 
                        log("*****************Google OAuth Successful********************")
                        data["fullname"] = name;
                        data["email"] = email;
                        is_email_verified = true
                    }
                }

            data["is_verified"] = is_email_verified

            // check if phone number is unique
            let user_by_tel = await User.findOne({where:{phone_number}});

            if (user_by_tel) {
                if (user_by_tel.email != email) {
                    log(user_by_tel)
                    response.status(401).send(sendError("Phone number already exists"))
                    return null;
                } else {
                    if (user_by_tel.is_verified) { 
                        log("verified")
                        response.status(400).send(sendError("User already exists with phone number " + phone_number));
                        return null;
                    }
                } 
                log("Can proceed process")
            }

            let user = await User.findOne({where:{email}})
            
            if (user) {

                log("found", {user})
                if (user.is_verified) { 
                    log("verified")
                    response.status(400).send(sendError("User already exists with email " + email));
                    return null;
                }

            } else user = await User.create(data) 

            if (!user) {
                response.status(500).send(sendError("Something went wrong " + email));
                return null;
            }

            if (!is_email_verified)
                await mailController.send({
                    from: EMAIL_USERNAME, to: email,
                    text: "Your email verification token is: " + verification_code + " valid within 5 minutes",
                    subject: "Email Verification"
                })

            setTimeout(async () => {
                await user.update({
                    verification_code: generateRandomNumber(),
                    where: {email}
                })
                console.log("code updated")
            }, 1000 * 60 * 5)

            return await User.findOne({
                where: {email},
                include: [
                    {model: Profile}
                ],
                attributes: {
                    exclude: ["password", "verification_code"]
                }
            })
        } catch (error:any) {
            response.status(500).send(sendError(error));
            return null
        }
    }

    public check_otp_validity = async (request:Request, response:Response) => {
        try {

            let { email, verification_code } = request.body

            let user = await User.findOne({
                where: {email, verification_code}, attributes: {
                    exclude: ["password", "verification_code"]
                }
            })

            if (user == null) {
                response.status(404).send(sendError("Invalid verification code"));
                return null
            }

            return user;
            
        } catch (error:any) {
            response.status(500).send(sendError(error));
            return null
        }
    }

    public verify_email = async (request:Request, response:Response) => {
        try {
            
            let { email, verification_code } = request.body

            let user = await User.findOne({
                where: {email, verification_code}
            })

            if (user == null) {
                response.status(404).send(sendError("Invalid verification code"))
                return null
            }

            let token = await generateToken({
                email: user.email, name: user.fullname
            });

            await user.update({
                is_verified: true,
                token,
                verification_code: generateRandomNumber(),
                where: {email}
            })

            return await User.findOne({
                where: {email},
                attributes: {
                    exclude: ["password", "verification_code"]
                }
            })

        } catch (error:any) {
            response.status(500).send(sendError(error))
            return null
        }
    }

    public request_verification_code = async (request:Request, response:Response) => {
        try {

            let {email} = request.body

            let user = await User.findOne({
                where: {email}
            })

            if (user == null) {
                response.status(404).send(sendError("Invalid email address"))
                return null
            }

            let code = generateRandomNumber()
            
            await user.update({
                verification_code: code,
                where: {email}
            })

            await mailController.send({
                from: EMAIL_USERNAME, to: email,
                text: "Your email verification token is: " + code + " valid within 5 minutes",
                subject: "Email Verification"
            })

            setTimeout(async () => { 
                if (user != null)
                await user.update({
                    verification_code: generateRandomNumber(),
                    where: {email}
                })
                console.log("code updated")
            }, 1000 * 60 * 5)

            return await User.findOne({
                where: {email},
                attributes: {
                    exclude: ["verification_code", "password"]
                }
            })
           
        } catch (error:any) {
            response.status(500).send(sendError(error))
            return null
        }
    }

    public login = async (request:Request, response:Response) => {
        try {

            console.log(">>>>>>>>>>>>>>>>>>>>LOGIN>>>>>>>>>>>>>>>>>>>>");
            
            let {email, password, firebase_token, isGmail, token_id} = request.body

            log(request.body)

            if(isGmail)
                if (isGmail == 'true') {

                    log(">>>>>>>>>>>>>>>>>>>>>>>[Gmail Signin]>>>>>>>>>>>>>>>>>>>")
                    if (!token_id) {
                        response.status(400).send(sendError("To signin with Gmail you have to provide 'token_id'"))
                        return null
                    } else {

                        // verify token ID
                        let {email, name} = await this._googleOAuthService.verifyGoogleIdToken(token_id);
                        if (email == null) {
                            response.status(400).send(sendError("Unfortunately we couldn't pick your 'email' up, please try again later"));
                            return null;
                        }
                        if (name == null) {
                            response.status(400).send(sendError("Unfortunately we couldn't pick your 'name' up, please try again later"));
                            return null;
                        }
                        log("*****************Checking System For Credentials*****************")
                        let user = await User.findOne({where: {email}})
                        if (!user) {
                            response.status(404).send(sendError(`We couldn't fetch your record as ${email}, please sign-in`))
                            return null
                        }
                        log("*****************Google OAuth Successful********************")

                        let token = await generateToken({
                            email: user.email, name: user.fullname
                        });

                        await user.update({token, firebase_token, where:{email}})

                        return await User.findOne({where:{email}, 
                            include: [
                                {model: Profile}
                            ], attributes:{exclude:["verification_code", "password"]}})
                    }

                }

            password = hashPassword(password)

            let user = await User.findOne({
                where: {email, password}
            })

            if (user == null) {
                response.status(404).send(sendError("Invalid email address or password"))
                return null
            }

            if (!user.is_verified) {
                response.status(400).send(sendError("Please verify your email"))
                return null
            }

            if (!user.active) {
                response.status(400).send(sendError("Your account is no longer active"))
                return null
            }

            let token = await generateToken({
                email: user.email, name: user.fullname
            });

            await user.update({token, firebase_token, where:{email}})

            return await User.findOne({where:{email}, 
                include: [
                    {model: Profile}
                ], attributes:{exclude:["verification_code", "password"]}})

        } catch (error:any) {
            response.status(500).send(sendError(error))
            return null
        }
    }

    public password_recovery = async (request:Request, response:Response) => {
        try {

            let {email, password, verification_code} = request.body

            password = hashPassword(password)

            let user = await User.findOne({
                where: {email, verification_code}
            }) 

            if (user == null) {
                response.status(404).send(sendError("Invalid verification code"))
                return null
            }

            await user.update({
                password, verification_code: generateRandomNumber(), where:{email}
            })

            // run on another thread
            mailController.send({
                from: EMAIL_USERNAME, to: email,
                text: "Your password reset was successful, kindly notify us if you never initated this process",
                subject: "Password Recovery"
            })

            return await User.findOne({where:{email}, attributes:{exclude:["verification_code", "password", "token"]}})

        } catch (error:any) {
            response.status(500).send(sendError(error))
            return null
        }
    }
}