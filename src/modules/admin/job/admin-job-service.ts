import { Request, Response } from "express";
import { sendError } from "../../../helper/error";
import { JobService } from "../../job/JobService";
import { verify2FAToken } from "../../../helper/2FA";
import { getAdmin } from "../../../helper/methods";
import Job from "../../job/JobModel";

export class AdminJobService {

    private jobService = new JobService()

    allJobs = async (req: Request, res: Response) => {
        try {

            return this.jobService.list_all_jobs(req, res);
            
        } catch (error: any) {
            res.status(500).send(sendError(error));
            return null
        }
    }

    viewJob = async (req: Request, res: Response) => {
        try {

            return this.jobService.view_job(req, res);
            
        } catch (error: any) {
            res.status(500).send(sendError(error));
            return null
        }
    }

    deleteJob = async (req: Request, res: Response) => {
        try {

            let { otp } = req.body, { slug } = req.params;

            const admin = await getAdmin(req);

            if (!await verify2FAToken(otp, admin)) {
                res.status(402).send(sendError("Incorrect OTP supplied"));
                return null;
            }

            return await Job.destroy({where: {slug}});
            
        } catch (error: any) {
            res.status(500).send(sendError(error));
            return null
        }
    } 

}