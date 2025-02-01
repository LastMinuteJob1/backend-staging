import { Request, Response } from "express";
import { sendError } from "../../../helper/error";
import User from "../../user/UserModel";
import Profile from "../../profile/ProfileModel";
import { Op } from "sequelize";
import { log } from "console";

export class AdminUserService {
    // view all users
    public all_users = async (req: Request, res: Response) => {
        try {

            let { page, limit, desc, q, status } = req.query;

            let page_ = page ? parseInt(page as string) : 1;
            let limit_ = limit ? parseInt(limit as string) : 10;
            let desc_ = desc ? parseInt(desc as string) : 1;
            let q_ = q ? q : "";
            let status_ = status ? status == "true" : true;

            let data = await (<any>User).paginate({
                page: page_, paginate: limit_,
                order: [['id', desc_ == 1 ? "DESC" : "ASC"]],
                where: {
                    active: status_,
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

            return data;

        } catch (error: any) {
            log(error)
            res.status(500).send(sendError(error));
            return null
        }
    }
    // view a user
    public view_users = async (req: Request, res: Response) => {
        try {

            let { email } = req.params;

            return await User.findOne({
                where: { email },
                include: [{
                    model: Profile,
                }],
                attributes: { exclude: ["password", "verification_code", "token"] }
            })

        } catch (error: any) {
            res.status(500).send(sendError(error));
            return null
        }
    }
    // block or unblock a user
    public toggle_user_Account = async (req: Request, res: Response) => {
        try {

            let { status } = req.body;
            let { email } = req.params;

            let user = await User.findOne({ where: { email } });

            if (!user) {
                res.status(404).send(sendError("User not found !"));
                return null
            }

            await User.update({ active: user.active ? false : true }, { where: { email } });

            let updated_user = await User.findOne({ where: { email } });

            return {
                message: `User account successfully ${ updated_user?.active ? "activated" : "deactivated"}`,
                status: "Successful"
            }

        } catch (error: any) {
            res.status(500).send(sendError(error));
            return null
        }
    }
    // usage statistics
    public stats = async (req: Request, res: Response) => {
        try {

            return {
                users: "1k", jobs: "500k", payments: "$2.5M"
            }

        } catch (error: any) {
            res.status(500).send(sendError(error));
            return null
        }
    }
}
