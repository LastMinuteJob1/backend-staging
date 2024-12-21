import { Request, Response } from "express";
import { sendError } from "../../helper/error";
import { log } from "console";
import TermsAndConditions from "./terms-and-condition/terms-model";
export class AdminDashboardService {

    public load_faq = async (req:Request, res:Response) => {
        try {

            let {q} = req.query

            return await TermsAndConditions.findOne({where: {id: 1}});
            
        } catch (error:any) {
            res.status(500).send(sendError(error));
            log({error})
            return null
        }
    }

}