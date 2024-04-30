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
            return await this.stripe.issuing.transactions.retrieve(
                ref
            );
        } catch (error) {
            // log(error)
            return {
                err: "Invalid transaction reference"
            }
        }
    }

}