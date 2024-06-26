"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const WebhookController_1 = require("./WebhookController");
const middlewares_1 = require("../../helper/middlewares");
const webHookRoute = (0, express_1.Router)(), webhookCOntroller = new WebhookController_1.WebhookController();
webHookRoute.post("/process-payment/stripe/SmlsbyBCaWxsaW9uYWlyZQ", middlewares_1.stripe_authorization, webhookCOntroller.process_stripe_payment);
exports.default = webHookRoute;
