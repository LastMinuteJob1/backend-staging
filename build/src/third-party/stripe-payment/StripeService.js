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
exports.StripeService = void 0;
const env_1 = require("../../config/env");
class StripeService {
    constructor() {
        // private BASE_URL:string = "https://api.stripe.com";
        this.stripe = require("stripe")(env_1.STRIPE_SECRET_KEY);
        this.disburse_payment = (options) => {
            return options;
        };
        this.verify_payment = (ref) => __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.stripe.issuing.transactions.retrieve(ref);
            }
            catch (error) {
                // log(error)
                return {
                    err: "Invalid transaction reference"
                };
            }
        });
    }
}
exports.StripeService = StripeService;
