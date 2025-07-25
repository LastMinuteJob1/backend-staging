import { Router } from "express";
import { authorization } from "../../helper/middlewares";
import { JobRequestController } from "./JobRequestController";

const jobRequestRoute = Router(),
      jobRequestController = new JobRequestController()

jobRequestRoute.use(authorization)

jobRequestRoute.post("/:slug", jobRequestController.create_request)
jobRequestRoute.get("/:slug", jobRequestController.open_request)
jobRequestRoute.get("/my-requests/:email", jobRequestController.list_my_job_request)
jobRequestRoute.get("/my-job-proposals/:email", jobRequestController.list_my_request_proposals)
jobRequestRoute.put("/toggle-job-proposal/:slug", jobRequestController.toggle_request_proposals)
jobRequestRoute.put("/submit-job/:slug", jobRequestController.submit_accepted_job_request_for_review)
jobRequestRoute.put("/toggle-submitted-job/:slug", jobRequestController.toggle_accepted_job_request_for_review)

export default jobRequestRoute