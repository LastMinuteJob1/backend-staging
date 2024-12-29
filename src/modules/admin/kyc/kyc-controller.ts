import { Request, Response } from "express"
import { KYCService } from "./kyc-service"
import { sendResponse } from "../../../helper/methods";
export class KYCController {
    private _kycService = new KYCService();
    public allKycs = async (req: Request, res: Response) => {
        let data = await this._kycService.allKycs(req, res)
        if (data != null)
            res.send(sendResponse(data))
    }
    public toggleKycs = async (req: Request, res: Response) => {
        let data = await this._kycService.toogleKyc(req, res)
        if (data != null)
            res.send(sendResponse(data))
    }
    public verifyKYC = async (req: Request, res: Response) => {
        let data = await this._kycService.verifyKYC(req, res)
        if (data != null)
            res.send(sendResponse(data))
    }
}