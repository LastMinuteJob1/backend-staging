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
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWTToken = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const crypto_1 = require("crypto");
class JWTToken {
    constructor(algorithm, secret, expiresIn) {
        this.algorithm = algorithm;
        this.secret = secret;
        this.expiresIn = expiresIn;
    }
    generateToken(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                (0, jsonwebtoken_1.sign)(payload, this.secret, { expiresIn: this.expiresIn }, (err, token) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(token);
                    }
                });
            });
        });
    }
    validateToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                (0, jsonwebtoken_1.verify)(token, this.secret, (err, decoded) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(decoded);
                    }
                });
            });
        });
    }
    disableToken() {
        return __awaiter(this, void 0, void 0, function* () {
            this.secret = (0, crypto_1.randomBytes)(256).toString('hex');
        });
    }
}
exports.JWTToken = JWTToken;
