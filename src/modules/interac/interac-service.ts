import { sendError } from "../../helper/error"
import { Request, Response } from "express";
import { generateOTP, generateRandomNumber, generateToken, getUser, sendResponse } from "../../helper/methods";
import Interac from "./interac-model";
import { log } from "console";
import { MailController } from "../mailer/MailController";
import { EMAIL_USERNAME } from "../../config/env";
import User from "../user/UserModel";
import { Op } from "sequelize";
import InteracPayment from "./interac-payment-model";

export class InteracSercvice {

    private mailController = new MailController()

    public addAccount = async (req: Request, res: Response) => {
        try {

            let user = await getUser(req);

            if (!user) {
                res.status(400).send(sendError("Something went wrong, please login"))
                return null
            }

            let { email } = req.body;

            let existing_interac_Account = await Interac.findOne({ where: { email } })

            if (existing_interac_Account)
                if (existing_interac_Account.is_verified) {
                    log("+++++++++++Existing Account+++++++++++++")
                    res.status(409).send(sendError("This email is associated with an interac account already"))
                    return null
                }

            let token = generateOTP(6);
            let interac_account = existing_interac_Account ? existing_interac_Account : await Interac.create({ email, verification_code: token });

            log("+++++++++++++++updating user details++++++++++++++")
            await interac_account.update({ verification_code: token })
            let _user = await User.findOne({ where: { id: user.id } })
            await (<any>interac_account).setUser(_user);

            log("++++++++++++++sending email++++++++++++++")
            log({ email, token })
            this.mailController.send({
                from: EMAIL_USERNAME, to: email,
                text: `Verify your interac email with ${token}. This will expire in 5 minutes time. 
                      <br><br>Do not disclose this pin if you didn't initiate this action`,
                subject: "Interac Email Verification"
            });

            setTimeout(async () => {
                log("+++++++++++updating interac code+++++++++++")
                await interac_account.update({
                    verification_code: token
                })
            }, 60 * 1000 * 5)

            return await Interac.findOne({
                where: { id: interac_account.id },
                attributes: {
                    exclude: ["verification_code"]
                }
            })

        } catch (error: any) {
            log({ error })
            res.status(500).send(sendError(error))
        }
    }

    public verifyAddAccountToken = async (req: Request, res: Response) => {
        try {

            let { token } = req.body;

            let user = await getUser(req);

            if (!user) {
                res.status(400).send(sendError("Something went wrong, please login"))
                return null
            }

            let interac_account = await Interac.findOne({
                where: { verification_code: token },
                include: [
                    {
                        model: User,
                        attributes: {
                            include: ["id", "email"]
                        },
                        where: {
                            id: user.id
                        }
                    }
                ]
            });

            if (!interac_account) {
                res.status(404).json(sendError("Could not find an Interac account with verification code " + token))
                return null
            }

            await interac_account.update({ is_verified: true });

            return await Interac.findOne({
                where: { id: interac_account.id },
                attributes: {
                    exclude: ["verification_code"]
                }
            })

        } catch (error: any) {
            res.status(500).send(sendError(error))
        }
    }

    public removeAccount = async (req: Request, res: Response) => {
        try {

            let { email } = req.body;

            let user = await getUser(req);

            if (!user) {
                res.status(400).send(sendError("Something went wrong, please login"))
                return null
            }

            let interac_account = await Interac.findOne({
                where: { email },
                include: [
                    {
                        model: User,
                        where: { id: user.id }
                    }
                ]
            })

            if (!interac_account) {
                res.status(400).send(sendError("Could not find interac account"))
                return null;
            }

            return await interac_account.destroy();

        } catch (error: any) {
            res.status(500).send(sendError(error))
        }
    }

    public listAccount = async (req: Request, res: Response) => {
        try {

            let { page, limit, desc, q } = req.query;

            let page_ = page ? parseInt(page as string) : 1;
            let limit_ = limit ? parseInt(limit as string) : 10;
            let desc_ = desc ? parseInt(desc as string) : 1;
            let q_ = q ? q : "";

            let user = await getUser(req);

            if (!user) {
                res.status(400).send(sendError("Something went wrong, please login"))
                return null
            }

            return await (<any>Interac).paginate({
                page: page_, paginate: limit_,
                order: [['id', desc_ == 1 ? "DESC" : "ASC"]],
                where: {
                    email: {
                        [Op.like]: `%${q_}%`
                    }
                },
                include: [
                    {
                        model: User,
                        attributes: {
                            exclude: ["token", "firebase_token", "password", "verification_code"]
                        },
                        where: { id: user.id }
                    }
                ]
            });

        } catch (error: any) {
            log({ error })
            res.status(500).send(sendError(error))
        }
    }

    public resolvePayment = async (req: Request, res: Response) => {
        try {

            let { ref, interac_email } = req.body;

            let user = await getUser(req);

            if (!user) {
                res.status(400).send(sendError("Something went wrong, please login"))
                return null
            }

            let interac_account = await Interac.findOne({
                where: {
                    email: interac_email
                },
                include: [
                    {
                        model: User,
                        where: { id: user.id }
                    }
                ]
            });

            if (!interac_account) {
                res.status(404).json(sendError("Unable to find Interac account associated with " + interac_email))
                return null;
            }

            let interac_payment = await InteracPayment.findOne({ where: { ref } });

            if (interac_payment)
                if (interac_payment.deposited) {
                    res.status(409).json(sendError("This payment has already been processed. If it hasn't reflected yet, kindly contact support"))
                    return null;
                } else {
                    res.json(sendResponse(interac_payment, "Kindly exercise patience, we are working on this payment already"));
                    return null;
                }

            interac_payment = await InteracPayment.create({ ref });
            await (<any>interac_payment).setInterac(interac_account);

            // forward email
            this.mailController.send({
                from: EMAIL_USERNAME, to: "support@lastminutejob.xyz",
                text: `Hello Admin<br><br>
                      There's a new deposite on Interac, these are the details. Kindly review: <br>
                      Reference: ${ref} <br>
                      Interac Email: ${interac_email} <br>
                      User: ${user.fullname} <br>
                      User Email: ${user.email} <br>`,
                subject: "Interac Payment Resolution"
            });

            return await InteracPayment.findOne({
                where: { ref }, include: [
                    {
                        model: Interac
                    }
                ]
            })

        } catch (error: any) {
            res.status(500).send(sendError(error))
        }
    }

    public myInteracPayments = async (req: Request, res: Response) => {
        try {

            let { page, limit, desc, q, status } = req.query;

            let page_ = page ? parseInt(page as string) : 1;
            let limit_ = limit ? parseInt(limit as string) : 10;
            let desc_ = desc ? parseInt(desc as string) : 1;
            let status_ = status ? parseInt(status as string) : 1;
            let q_ = q ? q : "";

            let user = await getUser(req);

            if (!user) {
                res.status(400).send(sendError("Something went wrong, please login"))
                return null
            }

            return await (<any>InteracPayment).paginate({
                page: page_, paginate: limit_,
                order: [['id', desc_ == 1 ? "DESC" : "ASC"]],
                where: {
                    ref: {
                        [Op.like]: `%${q_}%`
                    },
                    deposited: status_ == 1
                },
                include: [
                    {
                        model: Interac,
                        include: [
                            {
                                model: User,
                                attributes: {
                                    exclude: ["token", "firebase_token", "password", "verification_code"]
                                },
                                where: { id: user.id }
                            }
                        ]
                    }
                ]
            });

        } catch (error: any) {
            res.status(500).send(sendError(error))
        }
    }

}