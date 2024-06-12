import { Request, Response } from "express";
import { Notification } from "./NotificationInterface";
import slugify from "slugify";
import { generateRandomNumber, getUser } from "../../helper/methods";
import NotificationModel from "./NotificationModel";
import { sendError } from "../../helper/error";
import { Op } from "sequelize";
import User from "../user/UserModel";
import { log } from "console";
import { FCM_Manager } from "../../third-party/fcm/fcm-manager";

export class NotificationService {

    public open_notification = async (req:Request, res:Response) => {
        try {

            const user = await getUser(req)

            if (user == null) {
                res.status(400).send(sendError("Authentication failed, please login again"));
                return null
            }

            let {
                page, limit, desc, q
            } = req.query

            let page_ = page ? parseInt(page as string) : 1;
            let limit_ = limit ? parseInt(limit as string) : 10
            let desc_ = desc ? parseInt(desc as string) : 1
            let q_ = q || ""

            let where = q_ == "" ? {} : {
                where:{
                    [Op.or]: [
                        { title: { [Op.like]: `%${q}%` } },
                        { content: { [Op.like]: `%${q}%` } },
                      ]
                }
            };

             //  pagination
             const {docs, pages, total} = await (<any> NotificationModel).paginate({
                page:page_, paginate:limit_,
                order:[['id', desc_ == 1 ? "DESC" : "ASC"]],
                ...where,
                include: [{
                    where: {email:user.email},
                    model: User, attributes:["id", "email"]
                }]
            })

            // updating each notification as seen
            setTimeout(() => {
                docs.forEach((doc:NotificationModel) => {
                    doc.update({seen: true})
                });
            }, 5000)
            
            return {docs, pages, total}
            
        } catch (error:any) {
            res.status(500).send(sendError(error));
            return null
        }
    }

    public send_dummy_notification = async (req:Request, res:Response) => {
        try {
            
            const user = await getUser(req)

            if (user == null) {
                res.status(400).send(sendError("Authentication failed, please login again"));
                return null
            }

            let {title, content} = req.body

            const push_notification_res = await FCM_Manager.sendPushNotification({ user: user, title: title, content: content });

            if (push_notification_res) {

                return push_notification_res

            } else {
                res.status(400).send(sendError("Please check your FCM registration token"));
                return null
            }

        } catch (error:any) {
            res.status(500).send(sendError(error));
            return null
        }
    }
    
    public add_notification = async (data:Notification, send_push:boolean = true) => {
        let {title, type, content, from, user} = data
        let slug = slugify(title + " " + generateRandomNumber(), {lower:true})
        let notification:any = await NotificationModel.create({
            title, type, content, from, slug
        })
        await notification.setUser(user.id)
        if (send_push) await FCM_Manager.sendPushNotification({
            user: user,
            title: title,
            content: content
        })
        return await NotificationModel.findOne({where:{slug}})
    }

}