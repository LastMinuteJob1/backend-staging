import { Router } from "express";
import { WebhookController } from "./WebhookController";
import { stripe_authorization } from "../../helper/middlewares";

const webHookRoute = Router(), 
      webhookCOntroller = new WebhookController()

const express = require('express');

webHookRoute.post("/process-payment/stripe/SmlsbyBCaWxsaW9uYWlyZQ", /*stripe_authorization*/
                  express.raw({type: 'application/json'}), webhookCOntroller.process_stripe_payment)

export default webHookRoute   