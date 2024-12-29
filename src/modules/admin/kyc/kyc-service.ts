import { Request, Response } from "express"
import { sendError } from "../../../helper/error";
import { Op } from "sequelize";
import Profile from "../../profile/ProfileModel";
import User from "../../user/UserModel";
// import { required } from "joi";
export class KYCService {

    public allKycs = async (req: Request, res: Response) => {
        try {


            let { page, limit, desc, q, status } = req.query;

            let page_ = page ? parseInt(page as string) : 1;
            let limit_ = limit ? parseInt(limit as string) : 10;
            let desc_ = desc ? parseInt(desc as string) : 1;
            let q_ = q ? q : "";
            let status_ = status ? status : "no-profile"; // no-profile , unverified-kyc, verified-kyc

            let data = []

            switch (status_) {
                case "no-profile":
                    data = await (<any>User).paginate({
                        page: page_, paginate: limit_,
                        order: [['id', desc_ == 1 ? "DESC" : "ASC"]],
                        where: {
                            // profile: null,
                            [Op.or]: {
                                email: { [Op.like]: `%${q_}%` },
                                phone_number: { [Op.like]: `%${q_}%` },
                                address: { [Op.like]: `%${q_}%` },
                                city: { [Op.like]: `%${q_}%` },
                                postal_code: { [Op.like]: `%${q_}%` },
                                fullname: { [Op.like]: `%${q_}%` },
                                pronoun: { [Op.like]: `%${q_}%` },
                                province: { [Op.like]: `%${q_}%` },
                                // dob: { [Op.like] : `%${q_}%`  },
                            }
                        },
                        include: [{
                            model: Profile,
                            required: false
                        }],
                        attributes: { exclude: ["password", "verification_code", "token"] }
                    });
                    break;
                case "unverified-kyc":
                    data = await (<any>User).paginate({
                        page: page_, paginate: limit_,
                        order: [['id', desc_ == 1 ? "DESC" : "ASC"]],
                        where: {
                            [Op.or]: {
                                email: { [Op.like]: `%${q_}%` },
                                phone_number: { [Op.like]: `%${q_}%` },
                                address: { [Op.like]: `%${q_}%` },
                                city: { [Op.like]: `%${q_}%` },
                                postal_code: { [Op.like]: `%${q_}%` },
                                fullname: { [Op.like]: `%${q_}%` },
                                pronoun: { [Op.like]: `%${q_}%` },
                                province: { [Op.like]: `%${q_}%` },
                                // dob: { [Op.like] : `%${q_}%`  },
                            }
                        },
                        include: [{
                            required: true,
                            model: Profile,
                            where: {
                                is_kyc_verified: false
                            }
                        }],
                        attributes: { exclude: ["password", "verification_code", "token"] }
                    });
                    break;
                case "verified-kyc":
                    data = await (<any>User).paginate({
                        page: page_, paginate: limit_,
                        order: [['id', desc_ == 1 ? "DESC" : "ASC"]],
                        where: {
                            [Op.or]: {
                                email: { [Op.like]: `%${q_}%` },
                                phone_number: { [Op.like]: `%${q_}%` },
                                address: { [Op.like]: `%${q_}%` },
                                city: { [Op.like]: `%${q_}%` },
                                postal_code: { [Op.like]: `%${q_}%` },
                                fullname: { [Op.like]: `%${q_}%` },
                                pronoun: { [Op.like]: `%${q_}%` },
                                province: { [Op.like]: `%${q_}%` },
                                // dob: { [Op.like] : `%${q_}%`  },
                            }
                        },
                        include: [{
                            required: true,
                            model: Profile,
                            where: {
                                is_kyc_verified: true
                            }
                        }],
                        attributes: { exclude: ["password", "verification_code", "token"] }
                    });
                    break;
                default:
                    data = await (<any>User).paginate({
                        page: page_, paginate: limit_,
                        order: [['id', desc_ == 1 ? "DESC" : "ASC"]],
                        where: {
                            [Op.or]: {
                                email: { [Op.like]: `%${q_}%` },
                                phone_number: { [Op.like]: `%${q_}%` },
                                address: { [Op.like]: `%${q_}%` },
                                city: { [Op.like]: `%${q_}%` },
                                postal_code: { [Op.like]: `%${q_}%` },
                                fullname: { [Op.like]: `%${q_}%` },
                                pronoun: { [Op.like]: `%${q_}%` },
                                province: { [Op.like]: `%${q_}%` },
                                // dob: { [Op.like] : `%${q_}%`  },
                            }
                        },
                        include: [{
                            model: Profile,
                        }],
                        attributes: { exclude: ["password", "verification_code", "token"] }
                    });
                    break;
            }

            return data;

        } catch (error: any) {
            res.status(500).send(sendError(error));
            return null
        }
    }

    public toogleKyc = async (req: Request, res: Response) => {
        try {
            let { email } = req.params; let { status } = req.body;
            status = status ? status == "true" ? true : false : false;
            let profile = await Profile.findOne({
                include: [
                    {
                        model: User, where: { email },
                        attributes: { exclude: ["password", "verification_code", "token"] }
                    }
                ]
            });
            if (!profile) {
                res.status(404).send(sendError("Please contact user to upload profile"));
                return null
            }
            return await profile.update({ is_kyc_verified: status })
        } catch (error: any) {
            res.status(500).send(sendError(error));
            return null
        }
    }

    public verifyKYC = async (req: Request, res: Response) => {
        try {

            let { urls } = req.body;

            return {urls}

        } catch (error: any) {
            res.status(500).send(sendError(error));
            return null
        }
    }
    
}