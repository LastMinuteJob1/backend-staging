"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const JobController_1 = require("./JobController");
const middlewares_1 = require("../../helper/middlewares");
const jobRoute = (0, express_1.Router)();
const jobController = new JobController_1.JobController();
// mounting auth middleware
jobRoute.use(middlewares_1.authorization);
jobRoute.post("/", middlewares_1.job_creation_middleware, jobController.create_job);
jobRoute.get("/:slug", jobController.view_job);
jobRoute.put("/:slug", jobController.update_job);
jobRoute.delete("/:slug", jobController.delete_job);
jobRoute.get("/", jobController.list_all_jobs);
jobRoute.get("/user/:email", jobController.list_my_jobs);
exports.default = jobRoute;
