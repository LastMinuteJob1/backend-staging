import { Request, Response } from "express";
import { WalletService } from "./WalletService";
import { sendResponse } from "../../helper/methods";

export class WalletController {

    private _walletService = new WalletService();

    public verify_stripe_payment = async (req:Request, res:Response) => {
        let data = await this._walletService.verify_stripe_payment(req, res)
        if (data != null)
            res.send(sendResponse(data))
    }
    public fund_wallet = async (req:Request, res:Response) => {
        let data = await this._walletService.fund_wallet(req, res)
        if (data != null)
            res.send(sendResponse(data))
    }
    public query_wallet = async (req:Request, res:Response) => {
        let data = await this._walletService.query_wallet(req, res)
        if (data != null)
            res.send(sendResponse(data))
    }
    public wallet_history = async (req:Request, res:Response) => {
        let data = await this._walletService.wallet_history(req, res)
        if (data != null)
            res.send(sendResponse(data))
    }
    public initiate_withdrawal = async (req:Request, res:Response) => {
        let data = await this._walletService.initiate_withdrawal(req, res)
        if (data != null)
            res.send(sendResponse(data))
    }

} 