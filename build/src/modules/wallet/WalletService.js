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
exports.WalletService = void 0;
const error_1 = require("../../helper/error");
const console_1 = require("console");
const StripeService_1 = require("../../third-party/stripe-payment/StripeService");
const UserModel_1 = __importDefault(require("../user/UserModel"));
const methods_1 = require("../../helper/methods");
const WalletModel_1 = __importDefault(require("./WalletModel"));
const TransactionHistoryModel_1 = __importDefault(require("./TransactionHistoryModel"));
const StripeModel_1 = __importDefault(require("../../third-party/stripe-payment/StripeModel"));
const NotificationController_1 = require("../notification/NotificationController");
const NotificationInterface_1 = require("../notification/NotificationInterface");
class WalletService {
    constructor() {
        this._stripeService = new StripeService_1.StripeService();
        this.verify_stripe_payment = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let { ref } = req.params;
                let data = yield this._stripeService.verify_payment(ref);
                // let {client_secret} = data
                // if (! await this._stripeService.check_transaction_status(client_secret)) {
                //     res.status(402).send(sendError("This transaction was not successfull", 402))
                //     return null;
                // }
                (0, console_1.log)(data);
                if ((data.hasOwnProperty("err"))) {
                    res.status(400).send((0, error_1.sendError)("Invalid transaction reference", 400));
                    return null;
                }
                return data;
            }
            catch (error) {
                res.status(500).send((0, error_1.sendError)(error));
                (0, console_1.log)({ error });
                return null;
            }
        });
        this.fund_wallet = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let { ref } = req.body;
                let payment_details = yield this._stripeService.verify_payment(ref);
                if ((payment_details.hasOwnProperty("err"))) {
                    res.status(400).send((0, error_1.sendError)("Invalid transaction reference", 400));
                    return null;
                }
                if (yield StripeModel_1.default.findOne({ where: { ref } })) {
                    res.status(401).send((0, error_1.sendError)(`Duplicate transaction detected`));
                    return null;
                }
                let { amount, currency } = payment_details;
                let stripe = yield StripeModel_1.default.create({
                    ref, data: payment_details
                });
                let user = yield (0, methods_1.getUser)(req);
                if (!user) {
                    res.status(400).send((0, error_1.sendError)("Something went wrong, please login"));
                    return null;
                }
                let { id } = user;
                let wallet = yield WalletModel_1.default.findOne({
                    include: [
                        { model: UserModel_1.default, where: { id }, attributes: ["id"] }
                    ]
                });
                if (!wallet)
                    wallet = yield WalletModel_1.default.create({ balance: amount });
                else
                    yield wallet.update({ balance: (amount + wallet.balance) });
                yield wallet.setUser(user.id);
                let history = yield TransactionHistoryModel_1.default.create({
                    amount, data: payment_details
                });
                yield history.setWallet(wallet);
                new NotificationController_1.NotificationController().add_notification({
                    from: "Last Minute Job", // sender
                    title: "Inward Payment",
                    type: NotificationInterface_1.NOTIFICATION_TYPE.PAYMENT_IN,
                    content: `You have successfully fund your account with C$${amount}`,
                    user: user // receipant
                });
                return { wallet };
            }
            catch (error) {
                res.status(500).send((0, error_1.sendError)(error));
                (0, console_1.log)({ error });
                return null;
            }
        });
        this.query_wallet = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let user = yield (0, methods_1.getUser)(req);
                if (!user) {
                    res.status(400).send((0, error_1.sendError)("Something went wrong, please login"));
                    return null;
                }
                let { id } = user;
                let wallet = yield WalletModel_1.default.findOne({
                    include: [
                        { model: UserModel_1.default, where: { id }, attributes: ["id"] }
                    ]
                });
                if (!wallet) {
                    wallet = yield WalletModel_1.default.create({ balance: 0.0 });
                }
                yield wallet.setUser(user.id);
                return yield WalletModel_1.default.findOne({
                    include: [
                        { model: UserModel_1.default, where: { id }, attributes: ["id"] },
                        {
                            model: TransactionHistoryModel_1.default, order: [["id", "DESC"]], limit: 10
                        }
                    ]
                });
                ;
            }
            catch (error) {
                res.status(500).send((0, error_1.sendError)(error));
                (0, console_1.log)({ error });
                return null;
            }
        });
        this.wallet_history = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let { page, limit, desc } = req.query;
                let page_ = page ? parseInt(page) : 1;
                let limit_ = limit ? parseInt(limit) : 10;
                let desc_ = desc ? parseInt(desc) : 1;
                let user = yield (0, methods_1.getUser)(req);
                if (!user) {
                    res.status(400).send((0, error_1.sendError)("Something went wrong, please login"));
                    return null;
                }
                let { id } = user;
                (0, console_1.log)(user);
                return yield TransactionHistoryModel_1.default.paginate({
                    page: page_, paginate: limit_,
                    order: [['id', desc_ == 1 ? "DESC" : "ASC"]],
                    attributes: {
                        exclude: ["data"]
                    },
                    include: [
                        {
                            required: true,
                            model: WalletModel_1.default, include: [
                                { model: UserModel_1.default, attributes: ["id"], where: { id } }
                            ]
                        }
                    ]
                });
            }
            catch (error) {
                res.status(500).send((0, error_1.sendError)(error));
                (0, console_1.log)({ error });
                return null;
            }
        });
    }
}
exports.WalletService = WalletService;
