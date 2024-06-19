import { log } from "console";
import { STRIPE_SECRET_KEY } from "../../config/env";
import { IPayment } from "./StripeInterface";

export class StripeService {

    // private BASE_URL:string = "https://api.stripe.com";
    private stripe = require("stripe")(STRIPE_SECRET_KEY);

    public disburse_payment = (options:IPayment) => {
        return options
    }
    
    public verify_payment = async (ref:string) => {
        try {

            let data = await this.stripe.paymentIntents.retrieve(
                ref
            );

            let {status, message} = await this.check_transaction_status(ref)

            log({"Transaction-Status": status})

            if (!status) {
                return {
                    err: "Transaction failed !", message
                }
            }

            return data

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

}