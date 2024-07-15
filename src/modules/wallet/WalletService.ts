import { Request, Response } from "express";
import { sendError } from "../../helper/error";
import { log } from "console";
import { StripeService } from "../../third-party/stripe-payment/StripeService";
import User from "../user/UserModel";
import { getUser } from "../../helper/methods";
import Wallet from "./WalletModel";
import TransactionHistory from "./TransactionHistoryModel";
import StripePayment from "../../third-party/stripe-payment/StripeModel";
import { NotificationController } from "../notification/NotificationController";
import { NOTIFICATION_TYPE } from "../notification/NotificationInterface";
import StripeCustomer from "../../third-party/stripe-payment/StripeCustomerModel";
import Withdrawal from "./Withdrawal";

export class WalletService {

    private _stripeService = new StripeService();

    public verify_stripe_payment = async (req:Request, res:Response) => {
        try {

            let {ref} = req.params;

            let data = await this._stripeService.verify_payment(ref);

            // let {client_secret} = data

            // if (! await this._stripeService.check_transaction_status(client_secret)) {
            //     res.status(402).send(sendError("This transaction was not successfull", 402))
            //     return null;
            // }

            log(data)

            if ((data.hasOwnProperty("err"))) {
                res.status(400).send(sendError("Invalid transaction reference", 400))
                return null;
            }

            return data;

        } catch (error:any) {
            res.status(500).send(sendError(error));
            log({error})
            return null
        }
    }
    public fund_wallet = async (req:Request, res:Response) => {
        try {

            let {ref} = req.body;

            let payment_details = await this._stripeService.verify_payment(ref);

            if ((payment_details.hasOwnProperty("err"))) {
                res.status(402).send(sendError("Invalid transaction reference", 400))
                return null;
            }

            if (await StripePayment.findOne({where:{ref}})) {
                res.status(401).send(sendError(`Duplicate transaction detected`));
                return null;
            }

            let {amount, currency} = payment_details;

            let stripe = await StripePayment.create({
                ref, data:payment_details
            });

            let user:User = await getUser(req)

            if (!user) {
                res.status(409).send(sendError("Something went wrong, please login"));
                return null
            }

            let {id} = user;

            let wallet = await Wallet.findOne({
                include: [
                    {model:User, where:{id}, attributes: ["id"]}
                ]
            })

            if (!wallet) wallet = await Wallet.create({balance:amount})
            else await wallet.update({balance:(amount + wallet.balance)})

            await (<any>wallet).setUser(user.id);

            let history = await TransactionHistory.create({
                amount, data:payment_details
            });

            await (<any>history).setWallet(wallet)

            new NotificationController().add_notification({
                from: "Last Minute Job", // sender
                title: "Inward Payment",
                type: NOTIFICATION_TYPE.PAYMENT_IN,
                content: `You have successfully fund your account with C$${amount}`,
                user: user // receipant
            })

            return {wallet};


        } catch (error:any) {
            res.status(500).send(sendError(error));
            log({error})
            return null
        }
    }
    public query_wallet = async (req:Request, res:Response) => {
        try {

            let user:User = await getUser(req)

            if (!user) {
                res.status(400).send(sendError("Something went wrong, please login"));
                return null
            }

            let {id} = user;

            let wallet = await Wallet.findOne({
                include: [
                    {model:User, where:{id}, attributes: ["id"]}
                ]
            });

            if (!wallet) {
                wallet = await Wallet.create({balance:0.0});
            }

            await (<any>wallet).setUser(user.id);

            return await Wallet.findOne({
                include: [
                    {model:User, where:{id}, attributes: ["id"]},
                    {
                        model: TransactionHistory, order: [["id", "DESC"]], limit: 10
                    }
                ]
            });;

        } catch (error:any) {
            res.status(500).send(sendError(error));
            log({error})
            return null
        }
    }
    public wallet_history = async (req:Request, res:Response) => {
        try {

            let { page, limit, desc } = req.query 

            let page_ = page ? parseInt(page as string) : 1;
            let limit_ = limit ? parseInt(limit as string) : 10
            let desc_ = desc ? parseInt(desc as string) : 1

            let user:User = await getUser(req)

            if (!user) {
                res.status(400).send(sendError("Something went wrong, please login"));
                return null
            }

            let {id} = user;

            log(user)

            return await (<any> TransactionHistory).paginate({
                page:page_, paginate:limit_, 
                order:[['id', desc_ == 1 ? "DESC" : "ASC"]],
                attributes: {
                    exclude: ["data"]
                },
                include: [
                    {
                        required: true,
                        model: Wallet, include: [
                            {model: User, attributes:["id"], where: {id}}
                        ]
                    }
                ]
            })

        } catch (error:any) {
            res.status(500).send(sendError(error));
            log({error})
            return null
        }
    }

    public initiate_withdrawal = async (req:Request, res:Response) => {
        try {

            let user:User = await getUser(req)

            if (!user) {
                res.status(400).send(sendError("Something went wrong, please login"));
                return null
            }

            let {amount, account} = req.body;

            account = !account ? "stripe" : account

            if (account == "paypal") {
                res.status(500).send(sendError("Paypal withdrawal is not yet implemented"));
                return null
            }

            let raw_user:any = await User.findOne({where: {
                id: user.id
            }, include:[
                {model:Wallet}, {model:StripeCustomer}
            ]})

            let wallet:any = await this.query_wallet(req, res)

            if (!wallet) {
                res.status(409).send(sendError("Error connecting to wallet, please try again"));
                return null
            }

            amount = parseFloat(amount)
            let balance = parseFloat(wallet["balance"]);

            log(balance)

            if (balance < amount) {
                res.status(402).send(sendError("Insufficient fund"));
                return null
            }

            let customer = raw_user ? raw_user["StripeCustomer"] : null

            if (!customer) {
                res.status(400).send(sendError("Please link your stripe account"));
                return null
            }

            let raw_wallet = await Wallet.findOne({where:{id: wallet.id}})

            if (!raw_wallet) {
                res.status(409).send(sendError("Error fetching wallet"));
                return null;
            }

            await raw_wallet.update({balance: (balance - amount)})

            // stripe payment to customer
            let withdrawal = await Withdrawal.create({amount})

            if (!withdrawal) {
                await raw_wallet.update({balance: (balance + amount)})
                res.status(409).send(sendError("Error initiating withdrawal request"));
                return null;
            }

            if (!await (<any> withdrawal).setStripeCustomer(customer)) {
                await raw_wallet.update({balance: (balance + amount)})
                res.status(409).send(sendError("Error assigning withdrawal request"));
                withdrawal.destroy()
                return null;
            }

            let history = await TransactionHistory.create({
                amount: (amount * (-1)), data: withdrawal, 
            })

            await (<any> history).setWallet(raw_wallet)

            return withdrawal
            
        } catch (error:any) {
            res.status(500).send(sendError(error));
            log({error})
            return null
        }
    }

}