import { Router } from "express";
import { JobController } from "./JobController";
import { authorization, job_creation_middleware } from "../../helper/middlewares";

const jobRoute = Router()

const jobController = new JobController()

// mounting auth middleware
jobRoute.use(authorization)

jobRoute.post("/", /*job_creation_middleware,*/ jobController.create_job)
jobRoute.get("/:slug", jobController.view_job)
jobRoute.put("/:slug", jobController.update_job)
jobRoute.put("/upload/pics/:slug", jobController.upload_pics)
jobRoute.put("/publish/:slug", jobController.publish)
jobRoute.delete("/:slug", jobController.delete_job)
jobRoute.get("/", jobController.list_all_jobs)
jobRoute.get("/user/:email", jobController.list_my_jobs)

export default jobRoute 