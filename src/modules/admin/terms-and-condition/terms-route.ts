import { Router } from "express";
import { authorization_admin } from "../../../helper/middlewares";
import { TermsAndConditionController } from "./terms-controller";

const adminTermsAndConditionRoute = Router(), adminTermsAndConditionController = new TermsAndConditionController();

adminTermsAndConditionRoute.use(authorization_admin);

adminTermsAndConditionRoute.get("/", adminTermsAndConditionController.getFAQ)
adminTermsAndConditionRoute.patch("/", adminTermsAndConditionController.addFAQ)

export default adminTermsAndConditionRoute;