import { Request, Response } from "express";
import { sendError } from "../../../helper/error";
import Admin from "./admin-model";
import { comparePassword, generateToken, generateUUID, getAdmin, hashPassword } from "../../../helper/methods";
import { log } from "console";
import { generate2FASecret, verify2FAToken } from "../../../helper/2FA";
import { Op } from "sequelize";
import AdminLink from "./admin-link-model";

export class AdminService {
    // super admin only
    public addAdmin = async (req: Request, res: Response) => {
        try {

            let { email } = req.body;

            let exisiting_admin = await Admin.findOne({ where: { email } })

            let admin = !exisiting_admin ? await Admin.create({ email, roles: ["subadmin"] }) : exisiting_admin;

            let slug = generateUUID();

            let all_Active_links = await AdminLink.findAll({
                where: { active: true },
                include: [
                    {
                        model: Admin, where: { id: admin.id }
                    }
                ]
            });

            all_Active_links.map((link: AdminLink) => {
                link.update({ active: false })
            })

            let link = await AdminLink.create({ token: slug });

            (await <any>link).setAdmin(admin)

            log({ admin, link })

            setTimeout(async () => await link.update({ active: false }), (1000 * 60 * 60 * 24));

            return {
                message: `A link has been sent to ${email}, valid within 24 hours`,
                status: "Sccuessful"
            }

        } catch (error: any) {
            res.status(500).send(sendError(error));
            return null
        }
    }
    public removeAdmin = async (req: Request, res: Response) => {
        try {

            let { username } = req.params;

            await Admin.destroy({
                where: {
                    [Op.or]: {
                        username, email: username
                    }
                }
            });

            return {
                message: `${username} has been removed successfully`,
                status: "successful"
            }

        } catch (error: any) {
            res.status(500).send(sendError(error));
            return null
        }
    }
    public deactivateAdmin = async (req: Request, res: Response) => {
        try {

            let { username } = req.params;
            let { status } = req.body;

            await Admin.update({
                active: status == 'true'
            }, {
                where: {
                    [Op.or]: {
                        username, email: username
                    }
                }
            });

            return {
                message: `${username} has been ${ status == 'true' ? "activated" : "deactivated" } successfully`,
                status: "successful"
            }

        } catch (error: any) {
            res.status(500).send(sendError(error));
            return null
        }
    }
    public listAdmin = async (req: Request, res: Response) => {
        try {
            let _admin = await getAdmin(req);
            return await Admin.findAll({
                where: {
                    [Op.not]: {
                        email: _admin.email
                    }
                }
            })
        } catch (error: any) {
            res.status(500).send(sendError(error));
            return null
        }
    }
    // all admin
    public loginAdmin = async (req: Request, res: Response) => {
        try {

            let { username, password } = req.body;

            let admin = await Admin.findOne({
                where: {
                    [Op.or]: {
                        username, email: username
                    }
                }
            });

            log({admin})

            if (!admin) {
                res.status(404).send(sendError("Unable to find username or email"));
                return null
            }

            let token = await generateToken({
                email: admin.email, name: admin.username
            });

            if (!admin.password) {

                await admin.update({ token });

                return {
                    "message": "Please set up your password",
                    "email": admin.email, token
                }
            }

            if (!await comparePassword(password, admin.password)) {
                res.status(401).send(sendError("Incorrect password"));
                return null
            }

            if (!admin.active) {
                res.status(401).send(sendError("Your access has been restricted"));
                return null
            }

            if (!admin.is2FA_active) {

                await admin.update({ token });

                let { secret, url } = await generate2FASecret(admin);
                return {
                    message: "Please add 2FA Authentication",
                    secret, url, token
                }
            }

            await admin.update({ token });

            return await Admin.findOne({
                where: { [Op.or]: {username, email:username} }, attributes: {
                    exclude: [
                        "verification_code", "password",
                        "two_factor_temp_secret",
                        "two_factor_temp_secret_ascii"
                    ]
                }
            });

        } catch (error: any) {
            log(error)
            res.status(500).send(sendError(error));
            return null
        }
    }
    public setPasswordAdmin = async (req: Request, res: Response) => {
        try {

            let _admin = await getAdmin(req);

            let { password } = req.body;

            password = await hashPassword(password);

            log({ password })

            await Admin.update({ password }, { where: { id: _admin.id } });

            if (!_admin.is2FA_active) {
                let admin = await Admin.findOne({ where: { id: _admin.id } });
                if (!admin) {
                    res.status(404).send(sendError("Account not found!"));
                    return null
                }
                let { secret, url } = await generate2FASecret(admin);
                return {
                    message: "Password successfully changed, please add 2FA Authentication",
                    secret, url, token: _admin.token
                }
            }

            return {
                update: true
            }

        } catch (error: any) {
            res.status(500).send(sendError(error));
            return null
        }
    }
    public add2FAuthAdmin = async (req: Request, res: Response) => {
        try {

            let _admin = await getAdmin(req)

            let { otp } = req.body;

            let verified = await verify2FAToken(otp, _admin);

            if (!verified) {
                res.status(401).send(sendError("Invalid Google Auth token"));
                return null
            }

            await Admin.update({ is2FA_active: verified }, { where: { id: _admin.id } });

            return { verified };

        } catch (error: any) {
            res.status(500).send(sendError(error));
            return null
        }
    }
}