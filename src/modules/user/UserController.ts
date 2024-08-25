import { Request, Response } from "express";
import { UserService } from "./UserService";
import { sendResponse } from "../../helper/methods";

export class UserController {

    userService = new UserService()

    public signup = async (request:Request, response:Response) => {
        let data = await this.userService.signup(request, response)
        if (data != null)
            response.send(sendResponse(data))
    }

    public partial_signup = async (request:Request, response:Response) => {
        let data = await this.userService.partial_signup(request, response)
        if (data != null)
            response.send(sendResponse(data))
    }

    public check_otp_validity = async (request:Request, response:Response) => {
        let data = await this.userService.check_otp_validity(request, response)
        if (data != null)
            response.send(sendResponse(data))
    }

    public verify_email = async (request:Request, response:Response) => {
        let data = await this.userService.verify_email(request, response)
        if (data != null)
            response.send(sendResponse(data))
    }

    public request_verification_code = async (request:Request, response:Response) => {
        let data = await this.userService.request_verification_code(request, response)
        if (data != null)
            response.send(sendResponse(data))
    }

    public login = async (request:Request, response:Response) => {
        let data = await this.userService.login(request, response)
        if (data != null)
            response.send(sendResponse(data))
    }

    public password_recovery = async (request:Request, response:Response) => {
        let data = await this.userService.password_recovery(request, response)
        if (data != null)
            response.send(sendResponse(data))
    }

    public verify_google_oauth_token_id = async (request:Request, response:Response) => {
        let data = await this.userService.verify_google_oauth_token_id(request, response)
        if (data != null)
            response.send(sendResponse(data))
    }

     public add_stripe_customer = async (request:Request, response:Response) => {
        let data = await this.userService.add_stripe_customer(request, response)
        if (data != null)
            response.send(sendResponse(data))
     }

}