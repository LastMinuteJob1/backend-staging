import { log } from "console";
import { SERVER_BASE_URL, STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET } from "../../config/env";
import { IPayment } from "./StripeInterface";
import StripeWebhookPayment from "./StripeWebhookPaymentsModel";

export class StripeService {

    // private BASE_URL:string = "https://api.stripe.com";
    private stripe = require("stripe")(STRIPE_SECRET_KEY);

    public disburse_payment = (options:IPayment) => {
        return options
    }
    
    public verify_payment = async (ref:string) => {
        try {

            let payment = await StripeWebhookPayment.findOne({where:{ref}})

            if (!payment) {
                return {
                    err: "Transaction failed !", message: "Transaction not found"
                }
            }

            let {data} = payment

            return data

            // let data = await this.stripe.paymentIntents.retrieve(
            //     ref
            // );

            // let {status, message} = await this.check_transaction_status(ref)

            // log({"Transaction-Status": status})

            // if (!status) {
            //     return {
            //         err: "Transaction failed !", message
            //     }
            // }

            // return data

        } catch (error:any) {
            // log(error)
            return {
                err: "Invalid transaction reference",
                message: error.raw.message
            }
        }
    }

    private check_transaction_status = async (ref:string) => {
        try {
            const {paymentIntent, error} = await this.stripe.paymentIntents.confirm(ref, {
                return_url: 'https://www.lastminutejob.xyz',
                payment_method: 'pm_card_visa'
            });
            if (error) {
                // Handle error here
                log({error})
                log("<=======================[ERROR]===========================>")
                return null;
            } else if (paymentIntent && paymentIntent.status === 'succeeded') {
                // Handle successful payment here
                log({paymentIntent})
                log("<=======================[SUCCESS]===========================>")
                return paymentIntent;
            }
        } catch (error) {
            log("***********************[EXCEPTION]************************")
            return {
                status: null, message:error
            }
        }
    }

    public register_webhook = async () => {

        const url = `${SERVER_BASE_URL}/webhook/process-payment/stripe/SmlsbyBCaWxsaW9uYWlyZQ`

        const endpoint = await this.stripe.webhookEndpoints.create({
            url,
            enabled_events: [
                'payment_intent.payment_failed',
                'payment_intent.succeeded',
            ],
        });

        return endpoint
    }

    public get_payment_event = async (body:any, signature:any) => {
        try {
            return await this.stripe.webhooks.constructEvent(body, signature, STRIPE_WEBHOOK_SECRET);
        } catch (error) {
            return null
        }
    }

}