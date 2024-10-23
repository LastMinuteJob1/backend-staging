import { Request, Response } from "express";
import { InteracSercvice } from "./interac-service";
import { sendResponse } from "../../helper/methods";

export class InteracController {

    private _interacService = new InteracSercvice()
    
    public addAccount = async (req: Request, res: Response) => {
        let data = await this._interacService.addAccount(req, res)
        if (data != null)
            res.send(sendResponse(data))
    }

    public verifyAddAccountToken = async (req: Request, res: Response) => {
        let data = await this._interacService.verifyAddAccountToken(req, res)
        if (data != null)
            res.send(sendResponse(data))
    }

    public removeAccount = async (req: Request, res: Response) => {
        let data = await this._interacService.removeAccount(req, res)
        if (data != null)
            res.send(sendResponse(data))
    }

    public listAccount = async (req: Request, res: Response) => {
        let data = await this._interacService.listAccount(req, res)
        if (data != null)
            res.send(sendResponse(data))
    }

    public resolvePayment = async (req: Request, res: Response) => {
        let data = await this._interacService.resolvePayment(req, res)
        if (data != null)
            res.send(sendResponse(data))
    }

    public myInteracPayments = async (req: Request, res: Response) => {
        let data = await this._interacService.myInteracPayments(req, res)
        if (data != null)
            res.send(sendResponse(data))
    }

}