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
exports.UserService = void 0;
const UserModel_1 = __importDefault(require("./UserModel"));
const error_1 = require("../../helper/error");
const methods_1 = require("../../helper/methods");
const app_1 = require("../../../app");
const env_1 = require("../../config/env");
const console_1 = require("console");
const ProfileModel_1 = __importDefault(require("../profile/ProfileModel"));
const GoogleOauthService_1 = require("../../third-party/google-oauth/GoogleOauthService");
const StripeService_1 = require("../../third-party/stripe-payment/StripeService");
const StripeCustomerModel_1 = __importDefault(require("../../third-party/stripe-payment/StripeCustomerModel"));
const WalletModel_1 = __importDefault(require("../wallet/WalletModel"));
class UserService {
    constructor() {
        this._googleOAuthService = new GoogleOauthService_1.GoogleOAuthService();
        this._stripeService = new StripeService_1.StripeService();
        this.signup = (request, response) => __awaiter(this, void 0, void 0, function* () {
            try {
                let payload = request.body;
                let { fullname, email, phone_number, pronoun, city, postal_code, address, password, isGmail, token_id, dob, province } = payload;
                let token = yield (0, methods_1.generateToken)(payload);
                let verification_code = (0, methods_1.generateRandomNumber)();
                console.log({ verification_code });
                // password = isGmail ? (generateRandomNumber() + generateRandomNumber()) : password
                if (address) {
                    if (address.length < 10) {
                        response.status(409).send((0, error_1.sendError)("Invalid address supplied"));
                        return null;
                    }
                }
                let data = {
                    fullname, email, phone_number, address, verification_code,
                    password: (0, methods_1.hashPassword)(password), pronoun, city, postal_code,
                    dob, province,
                    is_verified: false, token: isGmail ? token : null
                };
                let is_email_verified = false;
                (0, console_1.log)(payload);
                if (isGmail)
                    if (isGmail.toString() == 'true') {
                        (0, console_1.log)("****************Checking Google OAuth***************");
                        if (!token_id) {
                            response.status(409).send((0, error_1.sendError)("To signup with Google, please supply the token_id"));
                            return null;
                        }
                        else {
                            // verify token ID
                            let { email, name } = yield this._googleOAuthService.verifyGoogleIdToken(token_id);
                            if (email == null) {
                                response.status(409).send((0, error_1.sendError)("Unfortunately we couldn't pick your 'email' up, please try again later"));
                                return null;
                            }
                            if (name == null) {
                                response.status(409).send((0, error_1.sendError)("Unfortunately we couldn't pick your 'name' up, please try again later"));
                                return null;
                            }
                            (0, console_1.log)("*****************Google OAuth Successful********************");
                            data["fullname"] = name;
                            data["email"] = email;
                            is_email_verified = true;
                        }
                    }
                data["is_verified"] = is_email_verified;
                // check if phone number is unique
                let user_by_tel = yield UserModel_1.default.findOne({ where: { phone_number } });
                if (user_by_tel) {
                    if (user_by_tel.email != email) {
                        (0, console_1.log)(user_by_tel);
                        response.status(409).send((0, error_1.sendError)("Phone number already exists"));
                        return null;
                    }
                    else {
                        if (user_by_tel.is_verified) {
                            (0, console_1.log)("verified");
                            response.status(409).send((0, error_1.sendError)("User already exists with phone number " + phone_number));
                            return null;
                        }
                    }
                    (0, console_1.log)("Can proceed process");
                }
                let user = yield UserModel_1.default.findOne({ where: { email } });
                if (user) {
                    (0, console_1.log)("found", { user });
                    if (user.is_verified) {
                        (0, console_1.log)("verified");
                        response.status(409).send((0, error_1.sendError)("User already exists with email " + email));
                        return null;
                    }
                }
                else
                    user = yield UserModel_1.default.create(data);
                if (!user) {
                    response.status(500).send((0, error_1.sendError)("Something went wrong " + email));
                    return null;
                }
                if (!is_email_verified)
                    yield app_1.mailController.send({
                        from: env_1.EMAIL_USERNAME, to: email,
                        text: "Your email verification token is: " + verification_code + " valid within 5 minutes",
                        subject: "Email Verification"
                    });
                setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                    yield user.update({
                        verification_code: (0, methods_1.generateRandomNumber)(),
                        where: { email }
                    });
                    console.log("code updated");
                }), 1000 * 60 * 5);
                let reg_user = yield UserModel_1.default.findOne({
                    where: { email },
                    include: [
                        { model: ProfileModel_1.default }
                    ],
                    attributes: {
                        exclude: ["password", "verification_code"]
                    }
                });
                if (reg_user) {
                    // generate a wallet for the user
                    let wallet = yield WalletModel_1.default.findOne({
                        include: [
                            { model: UserModel_1.default, where: { id: reg_user.id }, attributes: ["id"] }
                        ]
                    });
                    if (!wallet) {
                        wallet = yield WalletModel_1.default.create({ balance: 0 });
                        yield wallet.setUser(user.id);
                    }
                }
                yield UserModel_1.default.update({ verification_code }, { where: { email } });
                return reg_user;
            }
            catch (error) {
                response.status(500).send((0, error_1.sendError)(error));
                return null;
            }
        });
        this.check_otp_validity = (request, response) => __awaiter(this, void 0, void 0, function* () {
            try {
                let { email, verification_code } = request.body;
                let user = yield UserModel_1.default.findOne({
                    where: { email, verification_code }, attributes: {
                        exclude: ["password", "verification_code"]
                    }
                });
                if (user == null) {
                    response.status(404).send((0, error_1.sendError)("Invalid verification code"));
                    return null;
                }
                return user;
            }
            catch (error) {
                response.status(500).send((0, error_1.sendError)(error));
                return null;
            }
        });
        this.verify_email = (request, response) => __awaiter(this, void 0, void 0, function* () {
            try {
                let { email, verification_code } = request.body;
                let user = yield UserModel_1.default.findOne({
                    where: { email, verification_code }
                });
                if (user == null) {
                    response.status(404).send((0, error_1.sendError)("Invalid verification code"));
                    return null;
                }
                let token = yield (0, methods_1.generateToken)({
                    email: user.email, name: user.fullname
                });
                yield user.update({
                    is_verified: true,
                    token,
                    verification_code: (0, methods_1.generateRandomNumber)(),
                    where: { email }
                });
                return yield UserModel_1.default.findOne({
                    where: { email },
                    attributes: {
                        exclude: ["password", "verification_code"]
                    }
                });
            }
            catch (error) {
                response.status(500).send((0, error_1.sendError)(error));
                return null;
            }
        });
        this.request_verification_code = (request, response) => __awaiter(this, void 0, void 0, function* () {
            try {
                let { email } = request.body;
                let user = yield UserModel_1.default.findOne({
                    where: { email }
                });
                if (user == null) {
                    response.status(404).send((0, error_1.sendError)("Invalid email address"));
                    return null;
                }
                let code = (0, methods_1.generateRandomNumber)();
                yield user.update({
                    verification_code: code,
                    where: { email }
                });
                yield app_1.mailController.send({
                    from: env_1.EMAIL_USERNAME, to: email,
                    text: "Your email verification token is: " + code + " valid within 5 minutes",
                    subject: "Email Verification"
                });
                setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                    if (user != null)
                        yield user.update({
                            verification_code: (0, methods_1.generateRandomNumber)(),
                            where: { email }
                        });
                    console.log("code updated");
                }), 1000 * 60 * 5);
                return yield UserModel_1.default.findOne({
                    where: { email },
                    attributes: {
                        exclude: ["verification_code", "password"]
                    }
                });
            }
            catch (error) {
                response.status(500).send((0, error_1.sendError)(error));
                return null;
            }
        });
        this.login = (request, response) => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(">>>>>>>>>>>>>>>>>>>>LOGIN>>>>>>>>>>>>>>>>>>>>");
                let { email, password, firebase_token, isGmail, token_id } = request.body;
                (0, console_1.log)(request.body);
                if (isGmail)
                    if (isGmail == 'true') {
                        (0, console_1.log)(">>>>>>>>>>>>>>>>>>>>>>>[Gmail Signin]>>>>>>>>>>>>>>>>>>>");
                        if (!token_id) {
                            response.status(409).send((0, error_1.sendError)("To signin with Gmail you have to provide 'token_id'"));
                            return null;
                        }
                        else {
                            // verify token ID
                            let { email, name } = yield this._googleOAuthService.verifyGoogleIdToken(token_id);
                            if (email == null) {
                                response.status(409).send((0, error_1.sendError)("Unfortunately we couldn't pick your 'email' up, please try again later"));
                                return null;
                            }
                            if (name == null) {
                                response.status(409).send((0, error_1.sendError)("Unfortunately we couldn't pick your 'name' up, please try again later"));
                                return null;
                            }
                            (0, console_1.log)("*****************Checking System For Credentials*****************");
                            let user = yield UserModel_1.default.findOne({ where: { email } });
                            if (!user) {
                                response.status(404).send((0, error_1.sendError)(`We couldn't fetch your record as ${email}, please sign-in`));
                                return null;
                            }
                            (0, console_1.log)("*****************Google OAuth Successful********************");
                            let token = yield (0, methods_1.generateToken)({
                                email: user.email, name: user.fullname
                            });
                            yield user.update({ token, firebase_token, where: { email } });
                            return yield UserModel_1.default.findOne({ where: { email },
                                include: [
                                    { model: ProfileModel_1.default }
                                ], attributes: { exclude: ["verification_code", "password"] } });
                        }
                    }
                password = (0, methods_1.hashPassword)(password);
                let user = yield UserModel_1.default.findOne({
                    where: { email, password }
                });
                if (user == null) {
                    response.status(404).send((0, error_1.sendError)("Invalid email address or password"));
                    return null;
                }
                if (!user.is_verified) {
                    response.status(400).send((0, error_1.sendError)("Please verify your email"));
                    return null;
                }
                if (!user.active) {
                    response.status(400).send((0, error_1.sendError)("Your account is no longer active"));
                    return null;
                }
                let token = yield (0, methods_1.generateToken)({
                    email: user.email, name: user.fullname
                });
                yield user.update({ token, firebase_token, where: { email } });
                return yield UserModel_1.default.findOne({ where: { email },
                    include: [
                        { model: ProfileModel_1.default }
                    ], attributes: { exclude: ["verification_code", "password"] } });
            }
            catch (error) {
                response.status(500).send((0, error_1.sendError)(error));
                return null;
            }
        });
        this.password_recovery = (request, response) => __awaiter(this, void 0, void 0, function* () {
            try {
                let { email, password, verification_code } = request.body;
                password = (0, methods_1.hashPassword)(password);
                let user = yield UserModel_1.default.findOne({
                    where: { email, verification_code }
                });
                if (user == null) {
                    response.status(404).send((0, error_1.sendError)("Invalid verification code"));
                    return null;
                }
                yield user.update({
                    password, verification_code: (0, methods_1.generateRandomNumber)(), where: { email }
                });
                // run on another thread
                app_1.mailController.send({
                    from: env_1.EMAIL_USERNAME, to: email,
                    text: "Your password reset was successful, kindly notify us if you never initated this process",
                    subject: "Password Recovery"
                });
                return yield UserModel_1.default.findOne({ where: { email }, attributes: { exclude: ["verification_code", "password", "token"] } });
            }
            catch (error) {
                response.status(500).send((0, error_1.sendError)(error));
                return null;
            }
        });
        this.verify_google_oauth_token_id = (request, response) => __awaiter(this, void 0, void 0, function* () {
            try {
                let { token_id } = request.query;
                if (!token_id) {
                    response.status(409).send((0, error_1.sendError)("Please supply your token ID"));
                    return null;
                }
                let { email, name } = yield this._googleOAuthService.verifyGoogleIdToken(token_id);
                if (email == null) {
                    response.status(400).send((0, error_1.sendError)("Unfortunately we couldn't pick your 'email' up, please try again later"));
                    return null;
                }
                if (name == null) {
                    response.status(400).send((0, error_1.sendError)("Unfortunately we couldn't pick your 'name' up, please try again later"));
                    return null;
                }
                return { email, name };
            }
            catch (error) {
                response.status(500).send((0, error_1.sendError)(error));
                return null;
            }
        });
        this.add_stripe_customer = (request, response) => __awaiter(this, void 0, void 0, function* () {
            try {
                let { username, email } = request.body;
                let user = yield (0, methods_1.getUser)(request);
                if (!user) {
                    response.status(400).send((0, error_1.sendError)("Something went wrong, please login"));
                    return null;
                }
                if (!email) {
                    (0, console_1.log)(">>>>>>>>>>>>>>>>>>>Getting user default email>>>>>>>>>>>>>>>>>>");
                    email = user.email;
                }
                let raw_user = yield UserModel_1.default.findOne({ where: { email }, include: [
                        { model: StripeCustomerModel_1.default }
                    ] });
                let data = yield this._stripeService.add_customers(username, email);
                let customer = yield StripeCustomerModel_1.default.create({ data });
                let prev_data = raw_user["StripeCustomer"];
                (0, console_1.log)({ prev_data });
                if (prev_data) {
                    (0, console_1.log)("<<<<<<<<<<<<<<<<<<<Updating Data>>>>>>>>>>>>>>>>>>>>>>");
                    yield prev_data.update({
                        data
                    });
                    (0, console_1.log)(prev_data);
                }
                else
                    yield customer.setUser(raw_user);
                return data;
            }
            catch (error) {
                (0, console_1.log)(error);
                response.status(500).send((0, error_1.sendError)(error));
                return null;
            }
        });
    }
}
exports.UserService = UserService;
