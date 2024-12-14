import { Response, Request } from "express";
import { AdminJobRequestService } from "./admin-job-request-service"
import { sendResponse } from "../../../helper/methods";

export class AdminJobRequestController {

    private jobRequestService = new AdminJobRequestService();

    listAllJobRequest = async (req: Request, res: Response) => {
        let data = await this.jobRequestService.listAllJobRequest(req, res)
        if (data != null)
            res.send(sendResponse(data))
    }

    viewJobRequest = async (req: Request, res: Response) => {
        let data = await this.jobRequestService.viewJobRequest(req, res)
        if (data != null)
            res.send(sendResponse(data))
    }

    deleteJobRequest = async (req: Request, res: Response) => {
        let data = await this.jobRequestService.deleteJobRequest(req, res)
        if (data != null)
            res.send(sendResponse(data))
    }

    toggle_request_proposals_admin = async (req: Request, res: Response) => {
        let data = await this.jobRequestService.toggle_request_proposals_admin(req, res)
        if (data != null)
            res.send(sendResponse(data))
    }

}