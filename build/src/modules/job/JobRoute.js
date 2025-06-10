"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const JobController_1 = require("./JobController");
const middlewares_1 = require("../../helper/middlewares");
const app_1 = require("../../../app");
const slugify_1 = __importDefault(require("slugify"));
const methods_1 = require("../../helper/methods");
const console_1 = require("console");
const jobRoute = (0, express_1.Router)();
const jobController = new JobController_1.JobController();
// mounting auth middleware
jobRoute.use(middlewares_1.authorization);
jobRoute.post("/", /*job_creation_middleware,*/ jobController.create_job);
jobRoute.get("/:slug", jobController.view_job);
jobRoute.put("/:slug", jobController.update_job);
let multer = require('multer');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, app_1.storage_path); // Specify the upload directory
    },
    filename: (req, file, cb) => {
        (0, console_1.log)({ file });
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            // Allow only jpg, jpeg and png files
            return cb(new Error('Please upload an image (jpg, jpeg or png).'));
        }
        cb(null, (0, slugify_1.default)("job-pics " + (0, methods_1.generateRandomNumber)() + " " + file.originalname)); // Customize filename if needed
    }
});
const upload = multer({ storage });
jobRoute.put("/upload/pics/:slug", upload.array("file"), jobController.upload_pics);
jobRoute.delete("/delete-uploaded/pics", jobController.delete_job_pics);
jobRoute.put("/publish/:slug", jobController.publish);
jobRoute.delete("/:slug", jobController.delete_job);
jobRoute.get("/", jobController.list_all_jobs);
jobRoute.get("/user/:email", jobController.list_my_jobs);
jobRoute.get("/ongoing/task", jobController.ongoing_job);
jobRoute.put("/submit/task/:slug", jobController.submit_job);
jobRoute.post("/verify/payment/:slug", jobController.verify_transaction);
exports.default = jobRoute;
