import { Router } from "express";
import { authorization_admin, google_authorization } from "../../../helper/middlewares";
import { KYCController } from "./kyc-controller";

const adminKycRoute = Router();

adminKycRoute.use(authorization_admin);

let kycController = new KYCController();

adminKycRoute.get("/", kycController.allKycs)

adminKycRoute.use(google_authorization)
adminKycRoute.post("/", kycController.verifyKYC)
adminKycRoute.patch("/:email", kycController.toggleKycs)

export default adminKycRoute;