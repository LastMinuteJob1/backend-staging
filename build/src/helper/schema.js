"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jobSchema = exports.userSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.userSchema = joi_1.default.object({
    fullname: joi_1.default.string().min(5).required(),
    email: joi_1.default.string().email().required(),
    phone_number: joi_1.default.string().min(8).required(),
    password: joi_1.default.string().min(8).required(),
    address: joi_1.default.string().min(10).required(),
    pronoun: joi_1.default.string().min(2).required(),
    city: joi_1.default.string().min(2).required(),
    postal_code: joi_1.default.string().required(),
    isGmail: joi_1.default.bool().required()
});
exports.jobSchema = joi_1.default.object({
    title: joi_1.default.string().required(),
    description: joi_1.default.string().required(),
    price: joi_1.default.number().required(),
    location: joi_1.default.string().required(),
    priority: joi_1.default.number().required()
});
