import { Request, Response } from "express";
import { sendError } from "../../helper/error";
import { log } from "console";
import { StripeService } from "../../third-party/stripe-payment/StripeService";
import User from "../user/UserModel";
import { getUser } from "../../helper/methods";
import Wallet from "./WalletModel";
import TransactionHistory from "./TransactionHistoryModel";
import StripePayment from "../../third-party/stripe-payment/StripeModel";

export class WalletService {

    private _stripeService = new StripeService();

    public verify_stripe_payment = async (req:Request, res:Response) => {
        try {

            let {ref} = req.params;

            let data = await this._stripeService.verify_payment(ref);

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
                res.status(400).send(sendError("Invalid transaction reference", 400))
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
                res.status(400).send(sendError("Something went wrong, please login"));
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

            if (!wallet) wallet = await Wallet.create({balance:0.0});

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

            return await (<any> TransactionHistory).paginate({
                page:page_, paginate:limit_,
                order:[['id', desc_ == 1 ? "DESC" : "ASC"]],
                include: [
                    {
                        model: Wallet, include: [{model: User, attributes:["id"], where: {id}}]
                    }
                ]
            })

        } catch (error:any) {
            res.status(500).send(sendError(error));
            log({error})
            return null
        }
    }
}