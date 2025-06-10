"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const WebhookController_1 = require("./WebhookController");
const webHookRoute = (0, express_1.Router)(), webhookCOntroller = new WebhookController_1.WebhookController();
const express = require('express');
webHookRoute.post("/process-payment/stripe/SmlsbyBCaWxsaW9uYWlyZQ", /*stripe_authorization*/ express.json({ type: '*/*' }), webhookCOntroller.process_stripe_payment);
exports.default = webHookRoute;
