import { Request, Response } from "express"
import { getUser, sendResponse } from "../../helper/methods"
import User from "../user/UserModel"
import { ProfileService } from "./ProfileService"

export class ProfileController {
    private profileService = new ProfileService()
    public viewProfile = async(req:Request, res:Response) => {
        let data = await this.profileService.openProfile(req, res)
        if (data != null)
            res.send(sendResponse(data))
    }
    public addProfile = async(req: Request, res: Response) => {
       let data = await this.profileService.addProfile(req, res)
        if (data != null)
            res.send(sendResponse(data))
    }
    public upload = async(req: Request, res: Response) => {
       let data = await this.profileService.upload(req, res)
        if (data != null)
            res.send(sendResponse(data))
    }
    public update_username_and_password = async(req: Request, res: Response) => {
        let data = await this.profileService.update_username_and_password(req, res)
         if (data != null)
             res.send(sendResponse(data))
    }
    public deactivate_or_delete_account = async(req: Request, res: Response) => {
        let data = await this.profileService.deactivate_or_delete_account(req, res)
         if (data != null)
             res.send(sendResponse(data))
    }
}