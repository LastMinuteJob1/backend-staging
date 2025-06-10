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
exports.verify2FAToken = exports.generate2FASecret = void 0;
const console_1 = require("console");
let speakeasy = require("speakeasy");
let qr_code = require("qrcode");
function generate2FAQRCode(otp_url) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield qr_code.toDataURL(otp_url);
    });
}
function generate2FASecret(admin) {
    return __awaiter(this, void 0, void 0, function* () {
        const secret = speakeasy.generateSecret();
        // secret.otpauth_url.label = `Skyhealth(${doc.username})`
        let url = secret.otpauth_url;
        url = url.replace("SecretKey", `LMJ Admin(${(admin.email).split("@")[0]})`);
        let qr_code_url = yield generate2FAQRCode(url);
        yield admin.update({ two_factor_temp_secret: secret.base32 });
        return {
            secret: secret.base32,
            url: qr_code_url,
        };
    });
}
exports.generate2FASecret = generate2FASecret;
function verify2FAToken(otp, admin) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Ensure secret exists before verification 
            let secret = admin.two_factor_temp_secret;
            if (!secret) {
                throw new Error('2FA secret not found for this admin');
            }
            (0, console_1.log)({ otp, secret });
            const verified = speakeasy.totp.verify({
                secret: secret,
                encoding: 'base32',
                token: otp,
                window: 1, // Number of past and future codes to check (usually 1)
            });
            (0, console_1.log)({ verified });
            return verified;
        }
        catch (error) {
            (0, console_1.log)({ error });
            return false;
        }
    });
}
exports.verify2FAToken = verify2FAToken;
