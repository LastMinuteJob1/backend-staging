import { Request, Response } from "express";
import { JobRequestService } from "./JobRequestService";
import { sendResponse } from "../../helper/methods";

export class JobRequestController {

    private jobRequestService = new JobRequestService()

    public create_request = async (req:Request, res:Response) => {
        let data = await this.jobRequestService.create_request(req, res)
        if (data != null)
            res.send(sendResponse(data))
    }

    public open_request = async (req:Request, res:Response) => {
        let data = await this.jobRequestService.open_request(req, res)
        if (data != null)
            res.send(sendResponse(data))
    }

    public list_my_request_proposals = async (req:Request, res:Response) => {
        let data = await this.jobRequestService.list_my_request_proposals(req, res)
        if (data != null)
            res.send(sendResponse(data))
    }

    public list_my_job_request = async (req:Request, res:Response) => {
        let data = await this.jobRequestService.list_my_job_request(req, res)
        if (data != null)
            res.send(sendResponse(data))
    }

    public toggle_request_proposals = async (req:Request, res:Response) => {
        let data = await this.jobRequestService.toggle_request_proposals(req, res)
        if (data != null)
            res.send(sendResponse(data))
    }

}