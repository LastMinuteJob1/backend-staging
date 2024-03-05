import { Router } from "express";
import { ProfileController } from "./ProfileController";
import { authorization } from "../../helper/middlewares";
import { generateRandomNumber } from "../../helper/methods";
import slugify from "slugify";
import { storage_path } from "../../../app";

const profileRoute = Router(),
      profileCotroller = new ProfileController()

let multer = require('multer');
      
profileRoute.use(authorization)

const storage = multer.diskStorage({ 
    destination: (req:any, file:any, cb:any) => {
      cb(null, storage_path); // Specify the upload directory
    },
    filename: (req:any, file:any, cb:any) => {
      cb(null, slugify("user-profile " + generateRandomNumber() + " " + file.originalname)); // Customize filename if needed
    }
});
   
const upload = multer({ storage });

profileRoute.get("/", profileCotroller.viewProfile)
profileRoute.post("/", profileCotroller.addProfile)
profileRoute.put("/", upload.single("file"), profileCotroller.upload)

export default profileRoute;