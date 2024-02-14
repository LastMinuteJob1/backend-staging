"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const middlewares_1 = require("../../helper/middlewares");
const NotificationController_1 = require("./NotificationController");
const notificationRoute = (0, express_1.Router)();
const notificationController = new NotificationController_1.NotificationController();
notificationRoute.use(middlewares_1.authorization);
// view user notifications
notificationRoute.get("/", notificationController.open_notification);
exports.default = notificationRoute;
