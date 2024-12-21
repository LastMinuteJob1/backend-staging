import { Request, Response } from "express"
import { sendError } from "../../../helper/error";
import { log } from "console";
import { InteracSercvice } from "../../interac/interac-service";

export class AdminInteracService {

    private interacService = new InteracSercvice();
    
    public listAllInteracAccounts = async (req: Request, res: Response) => {
        try {
            return await this.interacService.listAllAccount(req, res)
        } catch (error: any) {
            res.status(500).send(sendError(error));
            log({error});
            return null;
        }
    }

    public listAllInteracPayments = async (req: Request, res: Response) => {
        try {
            return await this.interacService.allInteracPayments(req, res)
        } catch (error: any) {
            res.status(500).send(sendError(error));
            log({error});
            return null;
        }
    }

    public toggleInteracPayment = async (req: Request, res: Response) => {
        try {

            return await this.interacService.togglePayment(req, res);
            
        } catch (error: any) {
            res.status(500).send(sendError(error));
            log({error});
            return null;
        }
    }

}