import { Request, Response } from "express"
import { AdminInteracService } from "./admin-interac-service";
import { sendResponse } from "../../../helper/methods";

export class AdminInteracController {
    private adminInteracService = new AdminInteracService();
    public listAllInteracAccounts = async (req: Request, res: Response) => {
        let data = await this.adminInteracService.listAllInteracAccounts(req, res)
        if (data != null)
            res.send(sendResponse(data))
    }
    public listAllInteracPayments = async (req: Request, res: Response) => {
        let data = await this.adminInteracService.listAllInteracPayments(req, res)
        if (data != null)
            res.send(sendResponse(data))
    }
    public toggleInteracPayment = async (req: Request, res: Response) => {
        let data = await this.adminInteracService.toggleInteracPayment(req, res)
        if (data != null)
            res.send(sendResponse(data))
    }
}