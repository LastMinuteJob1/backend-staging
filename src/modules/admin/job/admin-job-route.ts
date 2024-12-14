import { Router } from "express";
import { authorization_admin, google_authorization } from "../../../helper/middlewares";
import { AdminJobController } from "./admin-job-controller";

const adminJobRoute = Router(), adminJobController = new AdminJobController();

adminJobRoute.use(authorization_admin);

adminJobRoute.get("/", adminJobController.allJobs);
adminJobRoute.get("/:slug", adminJobController.viewJob);

adminJobRoute.use(google_authorization)
adminJobRoute.delete("/:slug", adminJobController.deleteJob);

export default adminJobRoute;