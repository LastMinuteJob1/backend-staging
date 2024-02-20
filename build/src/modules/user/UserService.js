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
class UserService {
    constructor() {
        this.signup = (request, response) => __awaiter(this, void 0, void 0, function* () {
            try {
                let payload = request.body;
                let { fullname, email, phone_number, pronoun, city, postal_code, address, password, isGmail, } = payload;
                let token = yield (0, methods_1.generateToken)(payload);
                let verification_code = (0, methods_1.generateRandomNumber)();
                // console.log({verification_code});
                // password = isGmail ? (generateRandomNumber() + generateRandomNumber()) : password
                let data = {
                    fullname, email, phone_number, address, verification_code,
                    password: (0, methods_1.hashPassword)(password), pronoun, city, postal_code,
                    is_verified: isGmail, token: isGmail ? token : null
                };
                let user = yield UserModel_1.default.findOne({ where: { email } });
                if (user) {
                    (0, console_1.log)("found", { user });
                    if (user.is_verified) {
                        (0, console_1.log)("verified");
                        response.send((0, error_1.sendError)("User already exists with email " + email));
                        return null;
                    }
                }
                else
                    user = yield UserModel_1.default.create(data);
                if (!user) {
                    response.send((0, error_1.sendError)("Something went wrong " + email));
                    return null;
                }
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
                return yield UserModel_1.default.findOne({
                    where: { email },
                    attributes: {
                        exclude: ["password", "verification_code"]
                    }
                });
            }
            catch (error) {
                response.send((0, error_1.sendError)(error));
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
                    response.send((0, error_1.sendError)("Invalid verification code"));
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
                response.send((0, error_1.sendError)(error));
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
                    response.send((0, error_1.sendError)("Invalid email address"));
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
                response.send((0, error_1.sendError)(error));
                return null;
            }
        });
        this.login = (request, response) => __awaiter(this, void 0, void 0, function* () {
            try {
                let { email, password } = request.body;
                password = (0, methods_1.hashPassword)(password);
                let user = yield UserModel_1.default.findOne({
                    where: { email, password }
                });
                if (user == null) {
                    response.send((0, error_1.sendError)("Invalid email address or password"));
                    return null;
                }
                if (!user.is_verified) {
                    response.send((0, error_1.sendError)("Please verify your email"));
                    return null;
                }
                let token = yield (0, methods_1.generateToken)({
                    email: user.email, name: user.fullname
                });
                yield user.update({ token, where: { email } });
                return yield UserModel_1.default.findOne({ where: { email }, attributes: { exclude: ["verification_code", "password"] } });
            }
            catch (error) {
                response.send((0, error_1.sendError)(error));
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
                    response.send((0, error_1.sendError)("Invalid verification code"));
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
                response.send((0, error_1.sendError)(error));
                return null;
            }
        });
    }
}
exports.UserService = UserService;
