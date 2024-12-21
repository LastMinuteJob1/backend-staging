import { Request, Response } from "express";
import { sendError } from "../../../helper/error";
import { log } from "console";
import TermsAndConditions from "./terms-model";

export class TermsAndConditionService {

    private termsAndConditionModel = TermsAndConditions;

    public addFAQ = async (req: Request, res: Response) => {
        try {

            let { faq } = req.body;

            let terms = await this.termsAndConditionModel.findOne({where: {id: 1}});

            if (!terms) terms = await this.termsAndConditionModel.create();

            await terms.update({faq})

            return terms;

        } catch (error: any) {
            log(error)
            res.status(500).send(sendError(error));
            return null
        }
    }

    public getFAQ = async (req: Request, res: Response) => {
        try {

            // let { faq } = req.body;

            let terms = await this.termsAndConditionModel.findOne({where: {id: 1}});

            if (!terms) terms = await this.termsAndConditionModel.create();

            // await terms.update({faq})

            return terms;

        } catch (error: any) {
            log(error)
            res.status(500).send(sendError(error));
            return null
        }
    }

}