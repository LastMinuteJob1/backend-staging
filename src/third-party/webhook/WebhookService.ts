import { log } from "console";
import { sendError } from "../../helper/error";
import { Request, Response } from "express";
import StripeWebhookPayment from "../stripe-payment/StripeWebhookPaymentsModel";

export class WebhookService {

    // private 

    public process_stripe_payment = async (req:Request, res:Response) => {
        try {

            const event = req.body;

            // Handle the event
            switch (event.type) {

                case 'payment_intent.succeeded':
                      const paymentIntent = event.data.object;
                    
                      log("++++++++++++++++++++++++++++++++++++++++++++++++++++")
                      log("RECEIVED STRIP PAYMENT VIA WEBHOOK")
                      log(paymentIntent)
                      log("++++++++++++++++++++++++++++++++++++++++++++++++++++")

                      let {id} = paymentIntent

                      let existing_record = await StripeWebhookPayment.findOne({where:{ref:id}})

                      if (existing_record) {
                        res.status(409).send(sendError("Duplicate entry"));
                        return null
                      }

                      const data = await StripeWebhookPayment.create({ref:id, data:paymentIntent})

                      return { status: true, data }

                break;

                case 'payment_method.attached':
                      const paymentMethod = event.data.object;
                      res.status(402).send(sendError("This event type is not supported yet on our platform"));
                      return null
                
                break;

                default: res.status(402).send(sendError("Invalid payment event type"));
                         return null

            }
            
        } catch (error:any) {
            res.status(500).send(sendError(error));
            log({error})
            return null
        }
    }

}