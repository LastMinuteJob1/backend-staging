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
exports.MailService = void 0;
const env_1 = require("../../config/env");
const nodemailer_1 = __importDefault(require("nodemailer"));
class MailService {
    constructor() {
        this.transporter = nodemailer_1.default.createTransport({
            host: env_1.SMTP_HOST,
            port: 465,
            secure: true,
            auth: {
                user: env_1.EMAIL_USERNAME,
                pass: env_1.EMAIL_PASSWORD
            }
        });
        // this.transporter = nodemailer.createTransport({
        //     host: SMTP_HOST,
        //     port: 465,
        //     secure: true, 
        //     tls: {
        //      rejectUnauthorized: false, 
        //      ciphers: 'HIGH:!SSLv2:!aNULL:!eNULL:!IDEA:!LOW:!MD5:!PSK:!RC4:!SEED:!3DES:!SRP:!EXP:!FALLBACK_SCSV' // Supported ciphers
        //     },
        //     auth: {
        //      user: EMAIL_USERNAME,
        //      pass: EMAIL_PASSWORD 
        //     }
        //  }); 
        // this.transporter = nodemailer.createTransport(
        // {
        //     service: "Gmail",
        //     host: "smtp.gmail.com",
        //     port: 465,
        //     secure: true,
        //     auth: {
        //         user: EMAIL_USERNAME,
        //         pass: EMAIL_PASSWORD
        //     }
        // }
        // );
    }
    send(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.transporter.sendMail(options);
        });
    }
}
exports.MailService = MailService;
