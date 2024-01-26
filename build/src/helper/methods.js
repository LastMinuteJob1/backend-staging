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
exports.getUser = exports.generateRandomNumber = exports.hashPassword = exports.validateToken = exports.generateToken = exports.sendResponse = void 0;
const env_1 = require("../config/env");
const UserModel_1 = __importDefault(require("../modules/user/UserModel"));
const authorization_1 = require("./authorization");
const crypto = require('crypto');
function sendResponse(data, message = "OK", status = 200) {
    return {
        message, result: data, status
    };
}
exports.sendResponse = sendResponse;
const jwt = new authorization_1.JWTToken('HS256', env_1.JWT_SECRET_KEY, '1h');
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
    const hash = crypto.createHash('sha256');
    hash.update(password);
    const value = hash.digest('hex');
    return value;
}
exports.hashPassword = hashPassword;
// export async function disableToken(token:string) {
//     if (validateToken(token)) {
//         jwt.disableToken(token)
//     }
// }
function generateRandomNumber() {
    const min = 100000;
    const max = 999999;
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
