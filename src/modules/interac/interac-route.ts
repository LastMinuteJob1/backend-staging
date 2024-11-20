import { Router } from "express";
import { authorization } from "../../helper/middlewares";
import { InteracController } from "./interac-controller";

const interacRoute = Router(), interac_controller = new InteracController()

interacRoute.use(authorization) 

interacRoute.post("/add-account", interac_controller.addAccount)
interacRoute.post("/verify-email", interac_controller.verifyInteracEmail)
interacRoute.post("/verify-token", interac_controller.verifyAddAccountToken)
interacRoute.get("/list-account", interac_controller.listAccount)
interacRoute.delete("/remove-account", interac_controller.removeAccount)
interacRoute.post("/resolve-payment", interac_controller.resolvePayment)
interacRoute.get("/list-interact-payment", interac_controller.myInteracPayments)

export default interacRoute; 