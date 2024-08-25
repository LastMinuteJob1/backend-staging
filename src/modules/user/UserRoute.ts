import { Router } from "express";
import { UserController } from "./UserController";
import { authorization, ErrorWatcher, signup_middleware } from "../../helper/middlewares";

let userController = new UserController()

const userRouter = Router()

// error watcher middleware
userRouter.use(ErrorWatcher)

userRouter.post("/sign-up", signup_middleware, userController.signup)
userRouter.post("/verify-email", userController.verify_email)
userRouter.post("/request-verify-code", userController.request_verification_code)
userRouter.post("/validate-otp", userController.check_otp_validity);
userRouter.post("/sign-in", userController.login)
userRouter.post("/recover-password", userController.password_recovery)
userRouter.post("/verify-google-oauth-token-id", userController.verify_google_oauth_token_id)
 
userRouter.use(authorization)
userRouter.post("/add-stripe-account", userController.add_stripe_customer)
userRouter.post("/partial-sign-up", userController.partial_signup)

export default userRouter