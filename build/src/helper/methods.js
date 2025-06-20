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
exports.generateOTP = exports.generateReferralCode = exports.getCharges = exports.generateUUID = exports.getAdmin = exports.getUser = exports.generateRandomNumber = exports.comparePassword = exports.hashPassword = exports.validateToken = exports.generateToken = exports.sendResponse = void 0;
const env_1 = require("../config/env");
const admin_model_1 = __importDefault(require("../modules/admin/onboarding/admin-model"));
const UserModel_1 = __importDefault(require("../modules/user/UserModel"));
const authorization_1 = require("./authorization");
const crypto = require('crypto');
const bcrypt = require('bcrypt');
function sendResponse(data, message = "OK", status = 200) {
    return {
        message, result: data, status
    };
}
exports.sendResponse = sendResponse;
const jwt = new authorization_1.JWTToken('HS256', env_1.JWT_SECRET_KEY, '24h');
function generateToken(user) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield jwt.generateToken({ email: user.email, name: user.fullname });
    });
}
exports.generateToken = generateToken;
function validateToken(token) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const decoded = yield jwt.validateToken(token);
            return decoded;
        }
        catch (error) {
            return null;
        }
    });
}
exports.validateToken = validateToken;
function hashPassword(password) {
    return __awaiter(this, void 0, void 0, function* () {
        const saltOrRounds = 10;
        const hash = yield bcrypt.hash(password, saltOrRounds);
        return hash.toString();
    });
}
exports.hashPassword = hashPassword;
function comparePassword(password, hash) {
    return __awaiter(this, void 0, void 0, function* () {
        const status = yield bcrypt.compare(password, hash);
        return status;
    });
}
exports.comparePassword = comparePassword;
// export async function disableToken(token:string) {
//     if (validateToken(token)) {
//         jwt.disableToken(token)
//     }
// }
function generateRandomNumber() {
    const min = 1000;
    const max = 9999;
    let value = Math.floor(Math.random() * (max - min + 1) + min);
    return value.toString();
}
exports.generateRandomNumber = generateRandomNumber;
function getUser(req) {
    return __awaiter(this, void 0, void 0, function* () {
        const headers = req["headers"];
        let user_req = headers["user"];
        if (user_req == null)
            return new UserModel_1.default();
        else
            return JSON.parse(user_req);
    });
}
exports.getUser = getUser;
function getAdmin(req) {
    return __awaiter(this, void 0, void 0, function* () {
        const headers = req["headers"];
        let user_req = headers["admin"];
        if (user_req == null)
            return new admin_model_1.default();
        else
            return JSON.parse(user_req);
    });
}
exports.getAdmin = getAdmin;
function generateUUID() {
    return crypto.randomUUID();
}
exports.generateUUID = generateUUID;
function getCharges(price) {
    return (7.5 * price) / 100;
}
exports.getCharges = getCharges;
function generateReferralCode(options) {
    // Define default options
    const defaultOptions = {
        prefixLength: 6, // Adjust as desired
        separator: "-",
        codeLength: 5,
    };
    // Merge provided options with defaults
    const settings = Object.assign({}, defaultOptions, options);
    // Generate random prefix
    let prefix = "";
    for (let i = 0; i < settings.prefixLength; i++) {
        const randomChar = String.fromCharCode(Math.floor(Math.random() * 26) + 65); // Generate A-Z characters
        prefix += randomChar;
    }
    // Generate random numbers for the code part
    const code = Math.floor(Math.random() * Math.pow(10, settings.codeLength)).toString().padStart(settings.codeLength, "0");
    // Combine the components
    return prefix + settings.separator + code;
}
exports.generateReferralCode = generateReferralCode;
function generateOTP(length = 4) {
    const digits = '0123456789';
    let otp = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * digits.length);
        const randomDigit = digits[randomIndex];
        otp += randomDigit;
    }
    return otp;
}
exports.generateOTP = generateOTP;
