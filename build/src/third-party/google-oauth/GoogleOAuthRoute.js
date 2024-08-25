"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const GoogleOAuthController_1 = require("./GoogleOAuthController");
const googleAuthRoute = (0, express_1.Router)(), googleAuthController = new GoogleOAuthController_1.GoogleOAuthController();
googleAuthRoute.post("/verify-id-token", googleAuthController.firebase_verification);
exports.default = googleAuthRoute;
