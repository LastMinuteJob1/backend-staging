import { sendResponse } from "../../helper/methods";
import { AdminDashboardService } from "./AdminDashboardService"
import { Request, Response } from "express";

export class AdminDashboardController {

    private adminDashboardService = new AdminDashboardService()

    public load_faq = async (req: Request, res: Response) => {
        let data = await this.adminDashboardService.load_faq(req, res)
        if (data != null)
            res.send(sendResponse(data))
    }

}