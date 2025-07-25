import { Router } from "express";
import { authorization } from "../../helper/middlewares";
import { NotificationController } from "./NotificationController";

const notificationRoute = Router()
const notificationController = new NotificationController()

notificationRoute.use(authorization)

// view user notifications
notificationRoute.get("/", notificationController.open_notification)
notificationRoute.post("/test", notificationController.send_dummy_notification)

export default notificationRoute