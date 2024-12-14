import { Router } from "express";
import { authorization_admin, google_authorization } from "../../../helper/middlewares";
import { AdminJobRequestController } from "./admin-job-request-controller";

const adminJobRequestRoute = Router(), adminJobController = new AdminJobRequestController();

adminJobRequestRoute.use(authorization_admin);

adminJobRequestRoute.get("/", adminJobController.listAllJobRequest);
adminJobRequestRoute.get("/:slug", adminJobController.viewJobRequest);

adminJobRequestRoute.use(google_authorization)
adminJobRequestRoute.patch("/:slug", adminJobController.toggle_request_proposals_admin);
adminJobRequestRoute.delete("/:slug", adminJobController.deleteJobRequest);

export default adminJobRequestRoute;