import { Response, Request } from "express";
import { sendError } from "../../../helper/error";
import { JobRequestService } from "../../job_request/JobRequestService";
import JobRequest from "../../job_request/JobRequestModel";

export class AdminJobRequestService {

    private jobRequestService = new JobRequestService();

    listAllJobRequest = async (req: Request, res: Response) => {
        try {
            return await this.jobRequestService.list_all_request_proposals(req, res);
        } catch (error: any) {
            res.status(500).send(sendError(error));
            return null;
        }
    }

    viewJobRequest = async (req: Request, res: Response) => {
        try {
            return await this.jobRequestService.open_request(req, res);
        } catch (error: any) {
            res.status(500).send(sendError(error));
            return null;
        }
    }

    deleteJobRequest = async (req: Request, res: Response) => {
        try {
            let { slug } = req.params
            await JobRequest.destroy({where: {slug}});
            return {
                message: "Job request deleted successfully"
            }
        } catch (error: any) {
            res.status(500).send(sendError(error));
            return null;
        }
    }

    toggle_request_proposals_admin = async (req:Request, res:Response) => {
        try {
            return await this.jobRequestService.toggle_request_proposals_admin(req, res);
        } catch (error: any) {
            res.status(500).send(sendError(error));
            return null;
        }
    }

}