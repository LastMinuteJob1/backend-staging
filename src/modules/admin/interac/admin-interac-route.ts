import { Router } from "express";
import { authorization_admin } from "../../../helper/middlewares";
import { AdminInteracController } from "./admin-interac-controller";

const adminInteracRoute = Router(), adminInteracController = new AdminInteracController();

adminInteracRoute.use(authorization_admin);

adminInteracRoute.get("/all-accounts", adminInteracController.listAllInteracAccounts);
adminInteracRoute.get("/all-payments", adminInteracController.listAllInteracPayments);

export default adminInteracRoute;