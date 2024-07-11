import { Request, Response } from "express";
import { JobRequestService } from "./JobRequestService";
import { sendResponse } from "../../helper/methods";

export class JobRequestController {

    private jobRequestService = new JobRequestService()

    // applying for a job
    public create_request = async (req:Request, res:Response) => {
        let data = await this.jobRequestService.create_request(req, res)
        if (data != null)
            res.send(sendResponse(data))
    }

    // view that job applied for
    public open_request = async (req:Request, res:Response) => {
        let data = await this.jobRequestService.open_request(req, res)
        if (data != null)
            res.send(sendResponse(data))
    }

    // list all job applications for to my job post
    public list_my_request_proposals = async (req:Request, res:Response) => {
        let data = await this.jobRequestService.list_my_request_proposals(req, res)
        if (data != null)
            res.send(sendResponse(data))
    }

    // list all the job applications I have sent
    public list_my_job_request = async (req:Request, res:Response) => {
        let data = await this.jobRequestService.list_my_job_request(req, res)
        if (data != null)
            res.send(sendResponse(data))
    }

    // accept or reject job application
    public toggle_request_proposals = async (req:Request, res:Response) => {
        let data = await this.jobRequestService.toggle_request_proposals(req, res)
        if (data != null)
            res.send(sendResponse(data))
    }

    // submit accepted job application for completion
    public submit_accepted_job_request_for_review = async (req:Request, res:Response) => {
        let data = await this.jobRequestService.submit_accepted_job_request_for_review(req, res)
        if (data != null)
            res.send(sendResponse(data))
    }
    
    // accept or reject the job application completion request
    public toggle_accepted_job_request_for_review = async (req:Request, res:Response) => {
        let data = await this.jobRequestService.toggle_accepted_job_request_for_review(req, res)
        if (data != null)
            res.send(sendResponse(data))
    }

}