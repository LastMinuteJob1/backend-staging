import { Router } from "express";
import { JobController } from "./JobController";
import { authorization, job_creation_middleware } from "../../helper/middlewares";
import { storage_path } from "../../../app";
import slugify from "slugify";
import { generateRandomNumber } from "../../helper/methods";
import { log } from "console";

const jobRoute = Router()

const jobController = new JobController()

// mounting auth middleware
jobRoute.use(authorization)

jobRoute.post("/", /*job_creation_middleware,*/ jobController.create_job)
jobRoute.get("/:slug", jobController.view_job)
jobRoute.put("/:slug", jobController.update_job);

let multer = require('multer');

const storage = multer.diskStorage({ 
    destination: (req:any, file:any, cb:any) => {
      cb(null, storage_path); // Specify the upload directory
    },
    filename: (req:any, file:any, cb:any) => {
      log({file});
      if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
        // Allow only jpg, jpeg and png files
        return cb(new Error('Please upload an image (jpg, jpeg or png).'));
      }
      cb(null, slugify("job-pics " + generateRandomNumber() + " " + file.originalname)); // Customize filename if needed
    }
});
   
const upload = multer({ storage });

jobRoute.put("/upload/pics/:slug", upload.array("file"), jobController.upload_pics)
jobRoute.delete("/delete-uploaded/pics", jobController.delete_job_pics)

jobRoute.put("/publish/:slug", jobController.publish)
jobRoute.delete("/:slug", jobController.delete_job)
jobRoute.get("/", jobController.list_all_jobs)
jobRoute.get("/user/:email", jobController.list_my_jobs)

export default jobRoute 