import { Router } from "express";
import { authorization_admin, google_authorization } from "../../../helper/middlewares";
import { AdminInteracController } from "./admin-interac-controller";

const adminInteracRoute = Router(), adminInteracController = new AdminInteracController();

adminInteracRoute.use(authorization_admin);

adminInteracRoute.get("/all-accounts", adminInteracController.listAllInteracAccounts);
adminInteracRoute.get("/all-payments", adminInteracController.listAllInteracPayments);

// adminInteracRoute.use(google_authorization);
adminInteracRoute.post("/toggle-payment/:ref", adminInteracController.toggleInteracPayment);

export default adminInteracRoute;