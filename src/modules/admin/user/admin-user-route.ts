import { Router } from "express";
import { authorization_admin, google_authorization, superadmin_authorization } from "../../../helper/middlewares";
import { AdminUserController } from "./admin-user-controller";

const adminUserRoute = Router();

let adminUserController = new AdminUserController();

adminUserRoute.use(authorization_admin)
adminUserRoute.get("/", adminUserController.all_users);
adminUserRoute.get("/view/:email", adminUserController.view_users);
adminUserRoute.get("/stat", adminUserController.stats);

adminUserRoute.use(google_authorization)
// adminUserRoute.use(superadmin_authorization)
adminUserRoute.patch("/:email", adminUserController.toggle_user_Account);

export default adminUserRoute; 