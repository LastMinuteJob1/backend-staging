import { Request, Response } from "express";
import { sendError } from "../../helper/error";
import { log } from "console";
export class AdminDashboardService {

    public load_faq = async (req:Request, res:Response) => {
        try {

            let {q} = req.query

            return [
                {
                    "title": "Dummy title",
                    "text": "Dummy text"
                },
                {
                    "title": "Dummy title",
                    "text": "Dummy text"
                },
                {
                    "title": "Dummy title",
                    "text": "Dummy text"
                },
                {
                    "title": "Dummy title",
                    "text": "Dummy text"
                },
            ]
            
        } catch (error:any) {
            res.status(500).send(sendError(error));
            log({error})
            return null
        }
    }

}