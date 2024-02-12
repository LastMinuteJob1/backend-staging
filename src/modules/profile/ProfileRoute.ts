import { Router } from "express";
import { ProfileController } from "./ProfileController";
import { authorization } from "../../helper/middlewares";

const profileRoute = Router(),
      profileCotroller = new ProfileController()

profileRoute.use(authorization)

profileRoute.get("/", profileCotroller.viewProfile)
profileRoute.post("/", profileCotroller.addProfile)

export default profileRoute;