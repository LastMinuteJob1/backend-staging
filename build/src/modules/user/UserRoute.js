"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UserController_1 = require("./UserController");
const middlewares_1 = require("../../helper/middlewares");
let userController = new UserController_1.UserController();
const userRouter = (0, express_1.Router)();
// error watcher middleware
userRouter.use(middlewares_1.ErrorWatcher);
userRouter.post("/sign-up", middlewares_1.signup_middleware, userController.signup);
userRouter.post("/verify-email", userController.verify_email);
userRouter.post("/request-verify-code", userController.request_verification_code);
userRouter.post("/validate-otp", userController.check_otp_validity);
userRouter.post("/sign-in", userController.login);
userRouter.post("/recover-password", userController.password_recovery);
userRouter.post("/verify-google-oauth-token-id", userController.verify_google_oauth_token_id);
userRouter.use(middlewares_1.authorization);
userRouter.post("/add-stripe-account", userController.add_stripe_customer);
exports.default = userRouter;
