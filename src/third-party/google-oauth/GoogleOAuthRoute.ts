import { Router } from "express";
import { GoogleOAuthController } from "./GoogleOAuthController";

const googleAuthRoute = Router(),
      googleAuthController = new GoogleOAuthController()

googleAuthRoute.post("/verify-id-token", googleAuthController.firebase_verification)


export default googleAuthRoute