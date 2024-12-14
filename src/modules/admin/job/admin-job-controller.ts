import { Request, Response } from "express";
import { AdminJobService } from "./admin-job-service";
import { sendResponse } from "../../../helper/methods";

export class AdminJobController {

    private adminJobController = new AdminJobService();
    
    allJobs = async (req: Request, res: Response) => {
        let data = await this.adminJobController.allJobs(req, res)
        if (data != null)
            res.send(sendResponse(data))
    }

    viewJob = async (req: Request, res: Response) => {
        let data = await this.adminJobController.viewJob(req, res)
        if (data != null)
            res.send(sendResponse(data))
    }

    deleteJob = async (req: Request, res: Response) => {
        let data = await this.adminJobController.deleteJob(req, res)
        if (data != null)
            res.send(sendResponse(data))
    } 

}