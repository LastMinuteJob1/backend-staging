"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhookService = void 0;
const console_1 = require("console");
const error_1 = require("../../helper/error");
const StripeWebhookPaymentsModel_1 = __importDefault(require("../stripe-payment/StripeWebhookPaymentsModel"));
class WebhookService {
    constructor() {
        // private 
        this.process_stripe_payment = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const event = req.body;
                // Handle the event
                switch (event.type) {
                    case 'payment_intent.succeeded':
                        const paymentIntent = event.data.object;
                        (0, console_1.log)("++++++++++++++++++++++++++++++++++++++++++++++++++++");
                        (0, console_1.log)("RECEIVED STRIP PAYMENT VIA WEBHOOK");
                        (0, console_1.log)(paymentIntent);
                        (0, console_1.log)("++++++++++++++++++++++++++++++++++++++++++++++++++++");
                        let { id } = paymentIntent;
                        let existing_record = yield StripeWebhookPaymentsModel_1.default.findOne({ where: { ref: id } });
                        if (existing_record) {
                            res.status(409).send((0, error_1.sendError)("Duplicate entry"));
                            return null;
                        }
                        const data = yield StripeWebhookPaymentsModel_1.default.create({ ref: id, data: paymentIntent });
                        return { status: true, data };
                        break;
                    case 'payment_method.attached':
                        const paymentMethod = event.data.object;
                        res.status(402).send((0, error_1.sendError)("This event type is not supported yet on our platform"));
                        return null;
                        break;
                    default:
                        res.status(402).send((0, error_1.sendError)("Invalid payment event type"));
                        return null;
                }
            }
            catch (error) {
                res.status(500).send((0, error_1.sendError)(error));
                (0, console_1.log)({ error });
                return null;
            }
        });
    }
}
exports.WebhookService = WebhookService;
