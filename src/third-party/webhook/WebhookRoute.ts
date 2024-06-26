import { Router } from "express";
import { WebhookController } from "./WebhookController";
import { stripe_authorization } from "../../helper/middlewares";

const webHookRoute = Router(), 
      webhookCOntroller = new WebhookController()

webHookRoute.post("/process-payment/stripe/SmlsbyBCaWxsaW9uYWlyZQ", stripe_authorization, webhookCOntroller.process_stripe_payment)

export default webHookRoute