import { Request, Response } from "express"
import { getUser, sendResponse } from "../../helper/methods"
import User from "../user/UserModel"
import { ProfileService } from "./ProfileService"

export class ProfileController {
    private profileService = new ProfileService()
    public viewProfile = async(req:Request, res:Response) => {
        let data = await this.profileService.viewProfile(req, res)
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
}