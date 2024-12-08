import { Request, Response } from "express";
import { sendError } from "../../../helper/error";
import { AdminUserService } from "./admin-user-service";
import { sendResponse } from "../../../helper/methods";

export class AdminUserController {
    private _adminUserService = new AdminUserService()
    // view all users
    public all_users = async (req: Request, res: Response) => {
        let data = await this._adminUserService.all_users(req, res)
        if (data != null)
            res.send(sendResponse(data))
    }
    // view a user
     public view_users = async (req: Request, res: Response) => {
        let data = await this._adminUserService.view_users(req, res)
        if (data != null)
            res.send(sendResponse(data))
    }
    // block or unblock a user
     public toggle_user_Account = async (req: Request, res: Response) => {
        let data = await this._adminUserService.toggle_user_Account(req, res)
        if (data != null)
            res.send(sendResponse(data))
    }
    // usage statistics
     public stats = async (req: Request, res: Response) => {
        let data = await this._adminUserService.stats(req, res)
        if (data != null)
            res.send(sendResponse(data))
    }
}
