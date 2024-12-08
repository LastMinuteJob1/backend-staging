"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AdminDashboardController_1 = require("./AdminDashboardController");
const adminDashboardRoute = (0, express_1.Router)(), adminDashboardController = new AdminDashboardController_1.AdminDashboardController();
adminDashboardRoute.get("/faq", adminDashboardController.load_faq);
exports.default = adminDashboardRoute;
