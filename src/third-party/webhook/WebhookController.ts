import { Request, Response } from "express";
import { WebhookService } from "./WebhookService";
import { sendResponse } from "../../helper/methods";

export class WebhookController {

    private _webhookService = new WebhookService()

    public process_stripe_payment = async (req:Request, res:Response) => {
        let data = await this._webhookService.process_stripe_payment(req, res)
        if (data != null)
            res.send(sendResponse(data))
    }

}