import { Router } from "express";
import { UserController } from "./UserController";
import { ErrorWatcher, signup_middleware } from "../../helper/middlewares";

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

export default userRouter