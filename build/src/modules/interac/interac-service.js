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
exports.InteracSercvice = void 0;
const error_1 = require("../../helper/error");
const methods_1 = require("../../helper/methods");
const interac_model_1 = __importDefault(require("./interac-model"));
const console_1 = require("console");
const MailController_1 = require("../mailer/MailController");
const env_1 = require("../../config/env");
const UserModel_1 = __importDefault(require("../user/UserModel"));
const sequelize_1 = require("sequelize");
const interac_payment_model_1 = __importDefault(require("./interac-payment-model"));
class InteracSercvice {
    constructor() {
        this.mailController = new MailController_1.MailController();
        this.addAccount = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let user = yield (0, methods_1.getUser)(req);
                if (!user) {
                    res.status(400).send((0, error_1.sendError)("Something went wrong, please login"));
                    return null;
                }
                let { email } = req.body;
                let existing_interac_Account = yield interac_model_1.default.findOne({ where: { email } });
                if (existing_interac_Account)
                    if (existing_interac_Account.is_verified) {
                        (0, console_1.log)("+++++++++++Existing Account+++++++++++++");
                        res.status(409).send((0, error_1.sendError)("This email is associated with an interac account already"));
                        return null;
                    }
                let token = (0, methods_1.generateOTP)(6);
                let interac_account = existing_interac_Account ? existing_interac_Account : yield interac_model_1.default.create({ email, verification_code: token });
                (0, console_1.log)("+++++++++++++++updating user details++++++++++++++");
                yield interac_account.update({ verification_code: token });
                let _user = yield UserModel_1.default.findOne({ where: { id: user.id } });
                yield interac_account.setUser(_user);
                (0, console_1.log)("++++++++++++++sending email++++++++++++++");
                (0, console_1.log)({ email, token });
                this.mailController.send({
                    from: env_1.EMAIL_USERNAME, to: email,
                    text: `Verify your interac email with ${token}. This will expire in 5 minutes time. 
                      <br><br>Do not disclose this pin if you didn't initiate this action`,
                    subject: "Interac Email Verification"
                });
                setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                    (0, console_1.log)("+++++++++++updating interac code+++++++++++");
                    yield interac_account.update({
                        verification_code: token
                    });
                }), 60 * 1000 * 5);
                return yield interac_model_1.default.findOne({
                    where: { id: interac_account.id },
                    attributes: {
                        exclude: ["verification_code"]
                    }
                });
            }
            catch (error) {
                (0, console_1.log)({ error });
                res.status(500).send((0, error_1.sendError)(error));
            }
        });
        this.verifyInteracEmail = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let { email } = req.body;
                let existing_interac_Account = yield interac_model_1.default.findOne({ where: { email } });
                if (!existing_interac_Account) {
                    res.status(404).send((0, error_1.sendError)("Email not attached to an Interac account yet"));
                    return null;
                }
                if (!existing_interac_Account.is_verified) {
                    (0, console_1.log)("+++++++++++Non Existing Account+++++++++++++");
                    res.status(401).send((0, error_1.sendError)("This email is yet to be verified with an Interac account"));
                    return null;
                }
                return yield interac_model_1.default.findOne({
                    where: { id: existing_interac_Account.id },
                    attributes: {
                        exclude: ["verification_code"]
                    }
                });
            }
            catch (error) {
                (0, console_1.log)({ error });
                res.status(500).send((0, error_1.sendError)(error));
            }
        });
        this.verifyAddAccountToken = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let { token } = req.body;
                let user = yield (0, methods_1.getUser)(req);
                if (!user) {
                    res.status(400).send((0, error_1.sendError)("Something went wrong, please login"));
                    return null;
                }
                let interac_account = yield interac_model_1.default.findOne({
                    where: { verification_code: token },
                    include: [
                        {
                            model: UserModel_1.default,
                            attributes: {
                                include: ["id", "email"]
                            },
                            where: {
                                id: user.id
                            }
                        }
                    ]
                });
                if (!interac_account) {
                    res.status(404).json((0, error_1.sendError)("Could not find an Interac account with verification code " + token));
                    return null;
                }
                yield interac_account.update({ is_verified: true });
                return yield interac_model_1.default.findOne({
                    where: { id: interac_account.id },
                    attributes: {
                        exclude: ["verification_code"]
                    }
                });
            }
            catch (error) {
                res.status(500).send((0, error_1.sendError)(error));
            }
        });
        this.removeAccount = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let { email } = req.body;
                let user = yield (0, methods_1.getUser)(req);
                if (!user) {
                    res.status(400).send((0, error_1.sendError)("Something went wrong, please login"));
                    return null;
                }
                let interac_account = yield interac_model_1.default.findOne({
                    where: { email },
                    include: [
                        {
                            model: UserModel_1.default,
                            where: { id: user.id }
                        }
                    ]
                });
                if (!interac_account) {
                    res.status(400).send((0, error_1.sendError)("Could not find interac account"));
                    return null;
                }
                return yield interac_account.destroy();
            }
            catch (error) {
                res.status(500).send((0, error_1.sendError)(error));
            }
        });
        this.listAccount = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let { page, limit, desc, q } = req.query;
                let page_ = page ? parseInt(page) : 1;
                let limit_ = limit ? parseInt(limit) : 10;
                let desc_ = desc ? parseInt(desc) : 1;
                let q_ = q ? q : "";
                let user = yield (0, methods_1.getUser)(req);
                if (!user) {
                    res.status(400).send((0, error_1.sendError)("Something went wrong, please login"));
                    return null;
                }
                return yield interac_model_1.default.paginate({
                    page: page_, paginate: limit_,
                    order: [['id', desc_ == 1 ? "DESC" : "ASC"]],
                    where: {
                        email: {
                            [sequelize_1.Op.like]: `%${q_}%`
                        }
                    },
                    include: [
                        {
                            model: UserModel_1.default,
                            attributes: {
                                exclude: ["token", "firebase_token", "password", "verification_code"]
                            },
                            where: { id: user.id }
                        }
                    ]
                });
            }
            catch (error) {
                (0, console_1.log)({ error });
                res.status(500).send((0, error_1.sendError)(error));
            }
        });
        this.listAllAccount = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let { page, limit, desc, q } = req.query;
                let page_ = page ? parseInt(page) : 1;
                let limit_ = limit ? parseInt(limit) : 10;
                let desc_ = desc ? parseInt(desc) : 1;
                let q_ = q ? q : "";
                return yield interac_model_1.default.paginate({
                    page: page_, paginate: limit_,
                    order: [['id', desc_ == 1 ? "DESC" : "ASC"]],
                    where: {
                        email: {
                            [sequelize_1.Op.like]: `%${q_}%`
                        }
                    },
                    include: [
                        {
                            model: UserModel_1.default,
                            where: {
                                [sequelize_1.Op.or]: {
                                    email: {
                                        [sequelize_1.Op.like]: `%${q_}%`
                                    },
                                    fullname: {
                                        [sequelize_1.Op.like]: `%${q_}%`
                                    },
                                    phone_number: {
                                        [sequelize_1.Op.like]: `%${q_}%`
                                    },
                                }
                            },
                            attributes: {
                                exclude: ["token", "firebase_token", "password", "verification_code"]
                            }
                        }
                    ]
                });
            }
            catch (error) {
                (0, console_1.log)({ error });
                res.status(500).send((0, error_1.sendError)(error));
            }
        });
        this.togglePayment = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let { ref } = req.params, { status } = req.body;
                const interacPayment = yield interac_payment_model_1.default.findOne({
                    where: { ref }, include: [
                        {
                            model: interac_model_1.default,
                            include: [
                                {
                                    model: UserModel_1.default,
                                    attributes: {
                                        exclude: ["token", "firebase_token", "password", "verification_code"]
                                    },
                                }
                            ]
                        }
                    ]
                });
                if (!interacPayment) {
                    res.status(404).send((0, error_1.sendError)("Reference not found !"));
                    return null;
                }
                yield interacPayment.update({ status });
                let user = interacPayment["Interac"]["User"];
                let { email, fullname } = user;
                // update wallet
                this.mailController.send({
                    from: env_1.EMAIL_USERNAME, to: email,
                    text: status == 0 ? `Dear ${fullname.split(" ")[0]}<br>
                Your payment have been confirmed.<br>Thank you.` : `Dear ${fullname.split(" ")[0]}<br>
                Your payment have been rejected.<br>Thank you.`,
                    subject: status == 0 ? "Interac Payment Rejected" : "Interac Payment Successful"
                });
                return interacPayment;
            }
            catch (error) {
                (0, console_1.log)({ error });
                res.status(500).send((0, error_1.sendError)(error));
            }
        });
        this.resolvePayment = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let { ref, interac_email } = req.body;
                let user = yield (0, methods_1.getUser)(req);
                if (!user) {
                    res.status(400).send((0, error_1.sendError)("Something went wrong, please login"));
                    return null;
                }
                let interac_account = yield interac_model_1.default.findOne({
                    where: {
                        email: interac_email
                    },
                    include: [
                        {
                            model: UserModel_1.default,
                            where: { id: user.id }
                        }
                    ]
                });
                if (!interac_account) {
                    res.status(404).json((0, error_1.sendError)("Unable to find Interac account associated with " + interac_email));
                    return null;
                }
                let interac_payment = yield interac_payment_model_1.default.findOne({ where: { ref } });
                if (interac_payment)
                    if (interac_payment.deposited) {
                        res.status(409).json((0, error_1.sendError)("This payment has already been processed. If it hasn't reflected yet, kindly contact support"));
                        return null;
                    }
                    else {
                        res.json((0, methods_1.sendResponse)(interac_payment, "Kindly exercise patience, we are working on this payment already"));
                        return null;
                    }
                interac_payment = yield interac_payment_model_1.default.create({ ref });
                yield interac_payment.setInterac(interac_account);
                // forward email
                this.mailController.send({
                    from: env_1.EMAIL_USERNAME, to: "support@lastminutejob.ca",
                    text: `Hello Admin<br><br>
                      There's a new deposite on Interac, these are the details. Kindly review: <br>
                      Reference: ${ref} <br>
                      Interac Email: ${interac_email} <br>
                      User: ${user.fullname} <br>
                      User Email: ${user.email} <br>`,
                    subject: "Interac Payment Resolution"
                });
                return yield interac_payment_model_1.default.findOne({
                    where: { ref }, include: [
                        {
                            model: interac_model_1.default
                        }
                    ]
                });
            }
            catch (error) {
                res.status(500).send((0, error_1.sendError)(error));
            }
        });
        this.myInteracPayments = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let { page, limit, desc, q, status } = req.query;
                let page_ = page ? parseInt(page) : 1;
                let limit_ = limit ? parseInt(limit) : 10;
                let desc_ = desc ? parseInt(desc) : 1;
                let status_ = status ? parseInt(status) : 1;
                let q_ = q ? q : "";
                let user = yield (0, methods_1.getUser)(req);
                if (!user) {
                    res.status(400).send((0, error_1.sendError)("Something went wrong, please login"));
                    return null;
                }
                return yield interac_payment_model_1.default.paginate({
                    page: page_, paginate: limit_,
                    order: [['id', desc_ == 1 ? "DESC" : "ASC"]],
                    where: {
                        ref: {
                            [sequelize_1.Op.like]: `%${q_}%`
                        },
                        deposited: status_ == 1
                    },
                    include: [
                        {
                            model: interac_model_1.default,
                            include: [
                                {
                                    model: UserModel_1.default,
                                    attributes: {
                                        exclude: ["token", "firebase_token", "password", "verification_code"]
                                    },
                                    where: { id: user.id }
                                }
                            ]
                        }
                    ]
                });
            }
            catch (error) {
                res.status(500).send((0, error_1.sendError)(error));
            }
        });
        this.allInteracPayments = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let { page, limit, desc, q, status } = req.query;
                let page_ = page ? parseInt(page) : 1;
                let limit_ = limit ? parseInt(limit) : 10;
                let desc_ = desc ? parseInt(desc) : 1;
                let status_ = status ? parseInt(status) : 1;
                let q_ = q ? q : "";
                let user = yield (0, methods_1.getUser)(req);
                if (!user) {
                    res.status(400).send((0, error_1.sendError)("Something went wrong, please login"));
                    return null;
                }
                return yield interac_payment_model_1.default.paginate({
                    page: page_, paginate: limit_,
                    order: [['id', desc_ == 1 ? "DESC" : "ASC"]],
                    where: {
                        ref: {
                            [sequelize_1.Op.like]: `%${q_}%`
                        },
                        deposited: status_ == 1
                    },
                    include: [
                        {
                            model: interac_model_1.default,
                            include: [
                                {
                                    model: UserModel_1.default,
                                    attributes: {
                                        exclude: ["token", "firebase_token", "password", "verification_code"]
                                    }
                                }
                            ]
                        }
                    ]
                });
            }
            catch (error) {
                res.status(500).send((0, error_1.sendError)(error));
            }
        });
    }
}
exports.InteracSercvice = InteracSercvice;
