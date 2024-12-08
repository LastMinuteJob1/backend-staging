import { Router } from "express";
import { AdminDashboardController } from "./AdminDashboardController";

const adminDashboardRoute = Router(),
      adminDashboardController = new AdminDashboardController();

adminDashboardRoute.get("/faq", adminDashboardController.load_faq)

export default adminDashboardRoute;