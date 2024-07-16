import { log } from "console";
import { sendError } from "../../helper/error";
import { Request, Response } from "express";
import StripeWebhookPayment from "../stripe-payment/StripeWebhookPaymentsModel";
import { StripeService } from "../stripe-payment/StripeService";

export class WebhookService {

    // private 
    private stripeService = new StripeService()

    public process_stripe_payment = async (req:Request, res:Response) => {
        try {

            const body = req.body,
                  sig = req.headers['stripe-signature'],
                  event = await this.stripeService.get_payment_event(body, sig) //stripe.webhooks.constructEvent(request.body, sig, endpointSecret);

            log({event})
            if (!event) {
                res.status(400).json(sendError(`Webhook Error:`));
                log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
                return;
            }

            log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxWEBHOOKxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx")
            log({event}) 
            log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxWEBHOOKxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx")

            // Handle the event
            switch (event.type) {

                case 'payment_intent.succeeded':
                      const paymentIntent = event.data.object;
                      log({paymentIntent})
                    
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
                      log("Payment method attached")
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