"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const middlewares_1 = require("../../helper/middlewares");
const interac_controller_1 = require("./interac-controller");
const interacRoute = (0, express_1.Router)(), interac_controller = new interac_controller_1.InteracController();
interacRoute.use(middlewares_1.authorization);
interacRoute.post("/add-account", interac_controller.addAccount);
interacRoute.post("/verify-email", interac_controller.verifyInteracEmail);
interacRoute.post("/verify-token", interac_controller.verifyAddAccountToken);
interacRoute.get("/list-account", interac_controller.listAccount);
interacRoute.delete("/remove-account", interac_controller.removeAccount);
interacRoute.post("/resolve-payment", interac_controller.resolvePayment);
interacRoute.get("/list-interact-payment", interac_controller.myInteracPayments);
exports.default = interacRoute;
