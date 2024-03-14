import { JobService } from "./JobService";
import { sendResponse } from "../../helper/methods";
import { Request, Response } from "express";

export class JobController {

    private jobService = new JobService()

    public create_job = async (req:Request, res:Response) => {
        let data = await this.jobService.create_job(req, res)
        if (data != null)
            res.send(sendResponse(data))
    }

    public view_job = async (req:Request, res:Response) => {
        let data = await this.jobService.view_job(req, res)
        if (data != null)
            res.send(sendResponse(data))
    }

    public update_job = async (req:Request, res:Response) => {
        let data = await this.jobService.update_job(req, res)
        if (data != null)
            res.send(sendResponse(data))
    }

    public delete_job = async (req:Request, res:Response) => {
        let data = await this.jobService.delete_job(req, res)
        if (data != null)
            res.send(sendResponse(data))
    }

    public list_my_jobs = async (req:Request, res:Response) => {
        let data = await this.jobService.list_my_jobs(req, res)
        if (data != null)
            res.send(sendResponse(data))
    }

    public list_all_jobs = async (req:Request, res:Response) => {
        let data = await this.jobService.list_all_jobs(req, res)
        if (data != null)
            res.send(sendResponse(data))
    }

    public upload_pics = async (req:Request, res:Response) => {
        let data = await this.jobService.upload_pics(req, res)
        if (data != null)
            res.send(sendResponse(data))
    }

    public delete_job_pics = async (req:Request, res:Response) => {
        let data = await this.jobService.delete_job_pics(req, res)
        if (data != null)
            res.send(sendResponse(data))
    }

    public publish = async (req:Request, res:Response) => {
        let data = await this.jobService.publish(req, res)
        if (data != null)
            res.send(sendResponse(data))
    }

    public submit_job = async (req:Request, res:Response) => {
        let data = await this.jobService.submit_job(req, res)
        if (data != null)
            res.send(sendResponse(data))
    }

    public ongoing_job = async (req:Request, res:Response) => {
        let data = await this.jobService.ongoing_job(req, res)
        if (data != null)
            res.send(sendResponse(data))
    }

}