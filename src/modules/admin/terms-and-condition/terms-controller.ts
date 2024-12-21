import { sendResponse } from "../../../helper/methods";
import { TermsAndConditionService } from "./terms-service"
import { Request, Response } from "express";

export class TermsAndConditionController {

    private termsAndConditionService = new TermsAndConditionService();

    public addFAQ = async (req: Request, res: Response) => {
        let data = await this.termsAndConditionService.addFAQ(req, res)
        if (data != null)
            res.send(sendResponse(data))
    }

    public getFAQ = async (req: Request, res: Response) => {
        let data = await this.termsAndConditionService.getFAQ(req, res)
        if (data != null)
            res.send(sendResponse(data))
    }

}