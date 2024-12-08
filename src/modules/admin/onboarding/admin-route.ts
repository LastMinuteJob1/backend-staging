import { Router } from "express";
import { AdminController } from "./admin-controller";
import { authorization_admin, google_authorization, superadmin_authorization } from "../../../helper/middlewares";

const adminRoute = Router();

let adminController = new AdminController();

adminRoute.post("/login", adminController.loginAdmin);

adminRoute.use(authorization_admin)
adminRoute.get("/", adminController.listAdmin);
adminRoute.patch("/2Fa", adminController.add2FAuthAdmin);
adminRoute.patch("/set-password", adminController.setPasswordAdmin);

adminRoute.use(google_authorization)
adminRoute.use(superadmin_authorization)
adminRoute.post("/add", adminController.addAdmin);
adminRoute.patch("/activation-status/:username", adminController.deactivateAdmin);
adminRoute.delete("/remove/:username", adminController.removeAdmin);

export default adminRoute;