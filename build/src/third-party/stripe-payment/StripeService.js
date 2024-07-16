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
exports.StripeService = void 0;
const console_1 = require("console");
const env_1 = require("../../config/env");
const StripeWebhookPaymentsModel_1 = __importDefault(require("./StripeWebhookPaymentsModel"));
const UserModel_1 = __importDefault(require("../../modules/user/UserModel"));
const WalletModel_1 = __importDefault(require("../../modules/wallet/WalletModel"));
const TransactionHistoryModel_1 = __importDefault(require("../../modules/wallet/TransactionHistoryModel"));
const NotificationController_1 = require("../../modules/notification/NotificationController");
const NotificationInterface_1 = require("../../modules/notification/NotificationInterface");
class StripeService {
    constructor() {
        // private BASE_URL:string = "https://api.stripe.com";
        this.stripe = require("stripe")(env_1.STRIPE_SECRET_KEY);
        this.disburse_payment = (options) => __awaiter(this, void 0, void 0, function* () {
            let receiver = options["to"], sender = options["from"], amount = options["amount"], charges = options["charges"], narration = options["narration"];
            let wallet = yield WalletModel_1.default.findOne({
                include: [
                    { model: UserModel_1.default, where: { id: receiver.id }, attributes: ["id"] }
                ]
            });
            amount -= charges;
            // drop fund
            if (!wallet) {
                wallet = yield WalletModel_1.default.create({ balance: amount });
                yield wallet.setUser(receiver.id);
            }
            else
                yield wallet.update({ balance: (amount + wallet.balance) });
            // add to transaction
            let history = yield TransactionHistoryModel_1.default.create({
                amount, data: {
                    narration,
                    from: sender
                }
            });
            yield history.setWallet(wallet);
            new NotificationController_1.NotificationController().add_notification({
                from: "Last Minute Job", // sender
                title: "Inward Payment",
                type: NotificationInterface_1.NOTIFICATION_TYPE.PAYMENT_IN,
                content: `You have been credit with C$${amount}from ${sender.fullname}`,
                user: receiver // receipant
            });
            return options;
        });
        this.verify_payment = (ref) => __awaiter(this, void 0, void 0, function* () {
            try {
                let payment = yield StripeWebhookPaymentsModel_1.default.findOne({ where: { ref } });
                if (!payment) {
                    return {
                        err: "Transaction failed !", message: "Transaction not found"
                    };
                }
                let { data } = payment;
                return data;
                // const __data = {"amount": 1000, "currency": "CAD"}
                // return __data
                // let data = await this.stripe.paymentIntents.retrieve(
                //     ref
                // );
                // let {status, message} = await this.check_transaction_status(ref)
                // log({"Transaction-Status": status})
                // if (!status) {
                //     return {
                //         err: "Transaction failed !", message
                //     }
                // }
                // return data
            }
            catch (error) {
                (0, console_1.log)(error);
                return {
                    err: "Invalid transaction reference",
                    message: error.raw.message,
                    amount: 0, "currency": "CAD"
                };
            }
        });
        this.check_transaction_status = (ref) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { paymentIntent, error } = yield this.stripe.paymentIntents.confirm(ref, {
                    return_url: 'https://www.lastminutejob.xyz',
                    payment_method: 'pm_card_visa'
                });
                if (error) {
                    // Handle error here
                    (0, console_1.log)({ error });
                    (0, console_1.log)("<=======================[ERROR]===========================>");
                    return null;
                }
                else if (paymentIntent && paymentIntent.status === 'succeeded') {
                    // Handle successful payment here
                    (0, console_1.log)({ paymentIntent });
                    (0, console_1.log)("<=======================[SUCCESS]===========================>");
                    return paymentIntent;
                }
            }
            catch (error) {
                (0, console_1.log)("***********************[EXCEPTION]************************");
                return {
                    status: null, message: error
                };
            }
        });
        this.register_webhook = () => __awaiter(this, void 0, void 0, function* () {
            const url = `${env_1.SERVER_BASE_URL}/webhook/process-payment/stripe/SmlsbyBCaWxsaW9uYWlyZQ`;
            const endpoint = yield this.stripe.webhookEndpoints.create({
                url,
                enabled_events: [
                    'payment_intent.payment_failed',
                    'payment_intent.succeeded',
                ],
            });
            return endpoint;
        });
        this.get_payment_event = (body, signature) => __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.stripe.webhooks.constructEvent(body, signature, env_1.STRIPE_WEBHOOK_SECRET);
            }
            catch (error) {
                return null;
            }
        });
        this.add_customers = (username, email) => __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.stripe.customers.create({
                    name: username,
                    email: email,
                });
            }
            catch (error) {
                return error;
            }
        });
    }
}
exports.StripeService = StripeService;
