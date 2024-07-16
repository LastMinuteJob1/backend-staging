import { log } from "console";
import { SERVER_BASE_URL, STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET } from "../../config/env";
import { IPayment } from "./StripeInterface";
import StripeWebhookPayment from "./StripeWebhookPaymentsModel";
import User from "../../modules/user/UserModel";
import Wallet from "../../modules/wallet/WalletModel";
import TransactionHistory from "../../modules/wallet/TransactionHistoryModel";
import { NotificationController } from "../../modules/notification/NotificationController";
import { NOTIFICATION_TYPE } from "../../modules/notification/NotificationInterface";

export class StripeService {

    // private BASE_URL:string = "https://api.stripe.com";
    private stripe = require("stripe")(STRIPE_SECRET_KEY);

    public disburse_payment = async (options:IPayment) => {

        let receiver:User = options["to"], 
            sender:User = options["from"], 
            amount:number = options["amount"],
            charges:number = options["charges"],
            narration:string = options["narration"];
        
        let wallet = await Wallet.findOne({
            include: [
                {model:User, where:{id: receiver.id}, attributes: ["id"]}
            ]
        })

        amount -= charges

        // drop fund
        if (!wallet) { 
            wallet = await Wallet.create({balance:amount});
            await (<any>wallet).setUser(receiver.id);
        }  else await wallet.update({balance:(amount + wallet.balance)})

        // add to transaction
        let history = await TransactionHistory.create({
            amount, data:{
                narration,
                from: sender
            }
        });

        await (<any>history).setWallet(wallet)
        new NotificationController().add_notification({
            from: "Last Minute Job", // sender
            title: "Inward Payment",
            type: NOTIFICATION_TYPE.PAYMENT_IN,
            content: `You have been credit with C$${amount}from ${sender.fullname}`,
            user: receiver // receipant
        })

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

            // const __data = {"amount": 1000, "currency": "CAD"}

            // return __data

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
            log(error)
            return {
                err: "Invalid transaction reference",
                message: error.raw.message, 
                amount: 0, "currency": "CAD"
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
            let {data} = body
            log(body, "||||||||||||||||||||||||||||||||||||||||||||||||||||", data)
            return await this.stripe.webhooks.constructEvent(body.toString(), signature, STRIPE_WEBHOOK_SECRET);
        } catch (error) {
            log({error})
            return null
        }
    }

    public add_customers = async (username:string, email:string) => {
        try {

            return await this.stripe.customers.create({
                name: username,
                email: email,
            });
            
        } catch (error) {
            return error
        }
    }

}