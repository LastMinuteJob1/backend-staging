import { Request, Response } from "express";
import { sendError } from "../../../helper/error";
import { log } from "console";
import TermsAndConditions from "./terms-model";
import Faq from "./faq-model";
import { title } from "process";

export class TermsAndConditionService {

    private termsAndConditionModel = TermsAndConditions;

    public addFAQ = async (req: Request, res: Response) => {
        try {

            let { faq } = req.body;

            // let terms = await this.termsAndConditionModel.findOne({ where: { id: 1 } });

            // if (!terms) { terms = await this.termsAndConditionModel.create({ faq }); }

            // else {

            //     let existing_faqs = terms.faq;

            //     for (const _faq of faq)
            //         existing_faqs.push(_faq);

            //     log({ existing_faqs })

            //     if (!await terms.update({ faq: existing_faqs })) {
            //         res.status(409).send(sendError("Error updating FAQs"));
            //         return null
            //     }

            // }

            for (const obj of faq)
                await Faq.create({title: obj.title, content: obj.content})

            return { message: "FAQ update successfully", faqs: await Faq.findAll() };

        } catch (error: any) {
            log(error)
            res.status(500).send(sendError(error));
            return null
        }
    }

    public getFAQ = async (req: Request, res: Response) => {
        try {

            // // let { faq } = req.body;

            // let terms = await this.termsAndConditionModel.findOne({ where: { id: 1 } });

            // if (!terms) terms = await this.termsAndConditionModel.create();

            // // await terms.update({faq})

            // return terms;

            return await Faq.findAll();

        } catch (error: any) {
            log(error)
            res.status(500).send(sendError(error));
            return null
        }
    }

}