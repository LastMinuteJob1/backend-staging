"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ProfileController_1 = require("./ProfileController");
const middlewares_1 = require("../../helper/middlewares");
const methods_1 = require("../../helper/methods");
const slugify_1 = __importDefault(require("slugify"));
const app_1 = require("../../../app");
const profileRoute = (0, express_1.Router)(), profileCotroller = new ProfileController_1.ProfileController();
let multer = require('multer');
profileRoute.use(middlewares_1.authorization);
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, app_1.storage_path); // Specify the upload directory
    },
    filename: (req, file, cb) => {
        cb(null, (0, slugify_1.default)("user-profile " + (0, methods_1.generateRandomNumber)() + " " + file.originalname)); // Customize filename if needed
    }
});
const upload = multer({ storage });
profileRoute.get("/", profileCotroller.viewProfile);
profileRoute.post("/", profileCotroller.addProfile);
profileRoute.put("/", upload.single("file"), profileCotroller.upload);
profileRoute.put("/update/fullname-and-password", profileCotroller.update_username_and_password);
profileRoute.put("/account/toggle", profileCotroller.deactivate_or_delete_account);
exports.default = profileRoute;
