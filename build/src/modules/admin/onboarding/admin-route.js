"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_controller_1 = require("./admin-controller");
const app_1 = require("../../../../app");
const middlewares_1 = require("../../../helper/middlewares");
const console_1 = require("console");
const methods_1 = require("../../../helper/methods");
const slugify_1 = __importDefault(require("slugify"));
const adminRoute = (0, express_1.Router)();
let adminController = new admin_controller_1.AdminController();
let multer = require('multer');
adminRoute.post("/login", adminController.loginAdmin);
adminRoute.post("/password/reset-otp", adminController.requestOTP);
adminRoute.post("/password/change", adminController.changePassword);
adminRoute.use(middlewares_1.authorization_admin);
adminRoute.get("/", adminController.listAdmin);
adminRoute.put("/profile", adminController.addProfile);
adminRoute.get("/profile/:email", adminController.profile);
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
adminRoute.put("/upload/profile-pics", upload.array("file"), adminController.upload_pics);
adminRoute.patch("/2Fa", adminController.add2FAuthAdmin);
adminRoute.patch("/set-password", adminController.setPasswordAdmin);
adminRoute.use(middlewares_1.google_authorization);
adminRoute.use(middlewares_1.superadmin_authorization);
adminRoute.post("/add", adminController.addAdmin);
adminRoute.patch("/activation-status/:username", adminController.deactivateAdmin);
adminRoute.delete("/remove/:username", adminController.removeAdmin);
exports.default = adminRoute;
