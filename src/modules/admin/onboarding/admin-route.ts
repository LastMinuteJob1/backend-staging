import { Router } from "express";
import { AdminController } from "./admin-controller";
import { storage_path } from "../../../../app";
import { authorization_admin, google_authorization, superadmin_authorization } from "../../../helper/middlewares";
import { log } from "console";
import { generateRandomNumber } from "../../../helper/methods";
import slugify from "slugify";

const adminRoute = Router();

let adminController = new AdminController();
let multer = require('multer');

adminRoute.post("/login", adminController.loginAdmin);
adminRoute.post("/password/reset-otp", adminController.requestOTP);
adminRoute.post("/password/change", adminController.changePassword);

adminRoute.use(authorization_admin)
adminRoute.get("/", adminController.listAdmin);
adminRoute.put("/profile", adminController.addProfile);
adminRoute.get("/profile/:email", adminController.profile);

const storage = multer.diskStorage({
    destination: (req: any, file: any, cb: any) => {
        cb(null, storage_path); // Specify the upload directory
    },
    filename: (req: any, file: any, cb: any) => {
        log({ file });
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            // Allow only jpg, jpeg and png files
            return cb(new Error('Please upload an image (jpg, jpeg or png).'));
        }
        cb(null, slugify("job-pics " + generateRandomNumber() + " " + file.originalname)); // Customize filename if needed
    }
});

const upload = multer({ storage });

adminRoute.put("/upload/profile-pics", upload.array("file"), adminController.upload_pics)
adminRoute.patch("/2Fa", adminController.add2FAuthAdmin);
adminRoute.patch("/set-password", adminController.setPasswordAdmin);

adminRoute.use(google_authorization)
adminRoute.use(superadmin_authorization)
adminRoute.post("/add", adminController.addAdmin);
adminRoute.patch("/activation-status/:username", adminController.deactivateAdmin);
adminRoute.delete("/remove/:username", adminController.removeAdmin);

export default adminRoute; 