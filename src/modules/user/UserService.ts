import { Request, Response } from "express";
import { IUserAccountStatus, SignupRequest } from "./UserInterface";
import User from "./UserModel";
import { /*AppError,*/ sendError } from "../../helper/error";
import { generateRandomNumber, generateToken, getUser, hashPassword, sendResponse } from "../../helper/methods";
import { mailController } from "../../../app";
import { EMAIL_USERNAME } from "../../config/env";
import { log } from "console";
import Profile from "../profile/ProfileModel";
import { GoogleOAuthService } from "../../third-party/google-oauth/GoogleOauthService";
import { StripeService } from "../../third-party/stripe-payment/StripeService";
import StripeCustomer from "../../third-party/stripe-payment/StripeCustomerModel";
import { LakeFormation } from "aws-sdk";
import Wallet from "../wallet/WalletModel";

export class UserService {

    private _googleOAuthService = new GoogleOAuthService();
    private _stripeService = new StripeService()

    public partial_signup = async (request:Request, response:Response) => {
        try {

            let {body} = request

            const user = await getUser(request)

            if (!user) {
                response.status(401).send(sendError("Oops something unexpected occured"));
                return null
            }

            let real_user = await User.findOne({where:{email:user.email}})

            await real_user?.update({...body})

            return await User.findOne({where:{email: user.email}, attributes: {
                exclude: ["password", "verification_code"]
            }})

        } catch (error:any) {
            response.status(500).send(sendError(error));
            return null
        }
    }

    public signup = async (request:Request, response:Response) => {
        try {
            let payload:SignupRequest = request.body;
            let {
                fullname, email, phone_number, pronoun, city, postal_code,
                address, password, isGmail, token_id, dob, province
            } = payload
            let token = await generateToken(payload)
            let verification_code = generateRandomNumber()
            console.log({verification_code});
            // password = isGmail ? (generateRandomNumber() + generateRandomNumber()) : password
            if (address) {
                if (address.length < 10) {
                    response.status(409).send(sendError("Invalid address supplied"))
                    return null;
                }
            }
            let data = {
                fullname, email, phone_number, address, verification_code,
                password: hashPassword(password), pronoun, city, postal_code,
                dob, province,
                is_verified: false, token: isGmail ? token : null
            };

            let is_email_verified = false
            log(payload)
            if (isGmail)
                if (isGmail.toString() == 'true') {
                    log("****************Checking Google OAuth***************")
                    if (!token_id) {
                        response.status(409).send(sendError("To signup with Google, please supply the token_id"));
                        return null;
                    } else {
                        // verify token ID
                        let {email, name} = await this._googleOAuthService.verifyGoogleIdToken(token_id);
                        if (email == null) {
                            response.status(409).send(sendError("Unfortunately we couldn't pick your 'email' up, please try again later"));
                            return null;
                        }
                        if (name == null) { 
                            response.status(409).send(sendError("Unfortunately we couldn't pick your 'name' up, please try again later"));
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
                    response.status(409).send(sendError("Phone number already exists"))
                    return null;
                } else {
                    if (user_by_tel.is_verified) { 
                        log("verified")
                        response.status(409).send(sendError("User already exists with phone number " + phone_number));
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
                    response.status(409).send(sendError("User already exists with email " + email));
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

            let reg_user = await User.findOne({
                where: {email},
                include: [
                    {model: Profile}
                ],
                attributes: {
                    exclude: ["password", "verification_code"]
                }
            })

            if (reg_user) {
                // generate a wallet for the user
                let wallet = await Wallet.findOne({
                    include: [
                        {model:User, where:{id: reg_user.id}, attributes: ["id"]}
                    ]
                })
                if (!wallet) {
                    wallet = await Wallet.create({balance:0})
                    await (<any>wallet).setUser(user.id);
                }
            }

            await User.update({verification_code}, {where: {email}})

            return reg_user;

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
                        response.status(409).send(sendError("To signin with Gmail you have to provide 'token_id'"))
                        return null
                    } else {

                        // verify token ID
                        let {email, name} = await this._googleOAuthService.verifyGoogleIdToken(token_id);
                        if (email == null) {
                            response.status(409).send(sendError("Unfortunately we couldn't pick your 'email' up, please try again later"));
                            return null;
                        }
                        if (name == null) {
                            response.status(409).send(sendError("Unfortunately we couldn't pick your 'name' up, please try again later"));
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

     public verify_google_oauth_token_id = async (request:Request, response:Response) => {
        try {

            let {token_id, firebase_token} = request.query;

            if (!token_id) {
                response.status(409).send(sendError("Please supply your token ID"));
                return null;
            }

            let {email, name, sub} = await this._googleOAuthService.verifyGoogleIdToken(token_id);

            if (email == null) {
                response.status(400).send(sendError("Unfortunately we couldn't pick your 'email' up, please try again later"));
                return null;
            }
                        
            if (name == null) { 
                response.status(400).send(sendError("Unfortunately we couldn't pick your 'name' up, please try again later"));
                return null;
            } 

            // create the user

            let user = await User.findOne({where:{email}})
            
            if (user) {
                log("+++++++++++++ Updating Credentials +++++++++++++++")
                if (user.phone_number) {
                    response.status(409).send(sendError("Please signup instead"))
                    return null
                }

                const token = await generateToken(user)
                await user.update({token})
                return await User.findOne({where:{email}, include: [{
                    model: Profile
                }], attributes: {
                    exclude: ["password", "verification_code"]
                }})
            }

            log(" +++++++++++++ Creating Credentials +++++++++++ ")
            let new_user = await User.create({
                email, fullname: name, is_verified: true,
                token: "", password: hashPassword(sub), 
                verification_code: generateRandomNumber(),
                firebase_token
            })

            const token = await generateToken(new_user)

            log(token)

            await new_user.update({token})

            return await User.findOne({where:{email}, include: [{
                model: Profile
            }], attributes: {
                exclude: ["password", "verification_code"],
            }})
            
        } catch (error:any) {
            response.status(500).send(sendError(error))
            return null
        }
     }

     public add_stripe_customer = async (request:Request, response:Response) => {
        try {

            let {username, email} = request.body

            let user:User = await getUser(request)

            if (!user) {
                response.status(400).send(sendError("Something went wrong, please login"));
                return null
            }

            if (!email) {
                log(">>>>>>>>>>>>>>>>>>>Getting user default email>>>>>>>>>>>>>>>>>>")
                email = user.email
            }

            let raw_user = await User.findOne({where:{email}, include: [
                {model: StripeCustomer}
            ]})

            let data = await this._stripeService.add_customers(username, email)

            let customer = await StripeCustomer.create({data}) 

            let prev_data = (<any>raw_user)["StripeCustomer"]

            log({prev_data})

            if (prev_data) { 
                log("<<<<<<<<<<<<<<<<<<<Updating Data>>>>>>>>>>>>>>>>>>>>>>")
                await prev_data.update({
                    data
                })
                log(prev_data)
            } else
                await (<any> customer).setUser(raw_user)

            return data

        } catch (error:any) {
            log(error)
            response.status(500).send(sendError(error))
            return null
        }
     }

}