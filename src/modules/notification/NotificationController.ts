import { Request, Response } from "express";
import { NotificationService } from "./NotificationService";
import { sendResponse } from "../../helper/methods";
import { Notification } from "./NotificationInterface";

export class NotificationController {

    private notificationService = new NotificationService()

    public open_notification = async (req:Request, res:Response) => {
        let data = await this.notificationService.open_notification(req, res)
        if (data != null)
            res.send(sendResponse(data))
    }

    public send_dummy_notification = async (req:Request, res:Response) => {
        let data = await this.notificationService.send_dummy_notification(req, res)
        if (data != null)
            res.send(sendResponse(data))
    }

    public add_notification = async (data:Notification) => {
        return await this.notificationService.add_notification(data)
    }

}