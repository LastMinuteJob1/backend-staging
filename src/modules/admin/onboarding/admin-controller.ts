import { Request, Response } from "express";
import { sendError } from "../../../helper/error";
import { AdminService } from "./admin-service";
import { sendResponse } from "../../../helper/methods";

export class AdminController {
    private _adminService = new AdminService();
    // super admin only
    public addAdmin = async (req: Request, res: Response) => {
        let data = await this._adminService.addAdmin(req, res)
        if (data != null)
            res.send(sendResponse(data))
    }
    public removeAdmin = async (req: Request, res: Response) => {
        let data = await this._adminService.removeAdmin(req, res)
        if (data != null)
            res.send(sendResponse(data))
    }
    public deactivateAdmin = async (req: Request, res: Response) => {
        let data = await this._adminService.deactivateAdmin(req, res)
        if (data != null)
            res.send(sendResponse(data))
    }
    public listAdmin = async (req: Request, res: Response) => {
        let data = await this._adminService.listAdmin(req, res)
        if (data != null)
            res.send(sendResponse(data))
    }
    // all admin
    public loginAdmin = async (req: Request, res: Response) => {
        let data = await this._adminService.loginAdmin(req, res)
        if (data != null)
            res.send(sendResponse(data))
    }
    public setPasswordAdmin = async (req: Request, res: Response) => {
        let data = await this._adminService.setPasswordAdmin(req, res)
        if (data != null)
            res.send(sendResponse(data))
    }
    public add2FAuthAdmin = async (req: Request, res: Response) => {
        let data = await this._adminService.add2FAuthAdmin(req, res)
        if (data != null)
            res.send(sendResponse(data))
    }
}