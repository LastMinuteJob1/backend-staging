"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const middlewares_1 = require("../../../helper/middlewares");
const admin_user_controller_1 = require("./admin-user-controller");
const adminUserRoute = (0, express_1.Router)();
let adminUserController = new admin_user_controller_1.AdminUserController();
adminUserRoute.use(middlewares_1.authorization_admin);
adminUserRoute.get("/", adminUserController.all_users);
adminUserRoute.get("/view/:email", adminUserController.view_users);
adminUserRoute.get("/stat", adminUserController.stats);
adminUserRoute.use(middlewares_1.google_authorization);
// adminUserRoute.use(superadmin_authorization)
adminUserRoute.patch("/:email", adminUserController.toggle_user_Account);
exports.default = adminUserRoute;
