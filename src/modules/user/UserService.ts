import { Request, Response } from "express";
import { SignupRequest } from "./UserInterface";
import User from "./UserModel";
import { /*AppError,*/ sendError } from "../../helper/error";
import { generateRandomNumber, generateToken, hashPassword } from "../../helper/methods";
import { mailController } from "../../../app";
import { EMAIL_USERNAME } from "../../config/env";
// import { where } from "sequelize";
export class UserService {

    public signup = async (request:Request, response:Response) => {
        try {
            let payload:SignupRequest = request.body;
            let {
                fullname, email, phone_number, pronoun, city, postal_code,
                address, password, isGmail, 
            } = payload
            let token = await generateToken(payload)
            let verification_code = generateRandomNumber()
            // console.log({verification_code});
            // password = isGmail ? (generateRandomNumber() + generateRandomNumber()) : password
            let data = {
                fullname, email, phone_number, address, verification_code,
                password: hashPassword(password), pronoun, city, postal_code,
                is_verified: isGmail, token: isGmail ? token : null
            };
            let user = await User.create(data) 
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
                attributes: {
                    exclude: ["password", "verification_code"]
                }
            })
        } catch (error:any) {
            response.send(sendError(error))
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
                response.send(sendError("Invalid verification code"))
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
            response.send(sendError(error))
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
                response.send(sendError("Invalid email address"))
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
            response.send(sendError(error))
            return null
        }
    }

    public login = async (request:Request, response:Response) => {
        try {
         
            let {email, password} = request.body

            password = hashPassword(password)

            let user = await User.findOne({
                where: {email, password}
            })

            if (user == null) {
                response.send(sendError("Invalid email address or password"))
                return null
            }

            if (!user.is_verified) {
                response.send(sendError("Please verify your email"))
                return null
            }

            let token = await generateToken({
                email: user.email, name: user.fullname
            });

            await user.update({token, where:{email}})

            return await User.findOne({where:{email}, attributes:{exclude:["verification_code", "password"]}})

        } catch (error:any) {
            response.send(sendError(error))
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
                response.send(sendError("Invalid verification code"))
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
            response.send(sendError(error))
            return null
        }
    }
}