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
exports.WebhookController = void 0;
const WebhookService_1 = require("./WebhookService");
const methods_1 = require("../../helper/methods");
class WebhookController {
    constructor() {
        this._webhookService = new WebhookService_1.WebhookService();
        this.process_stripe_payment = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let data = yield this._webhookService.process_stripe_payment(req, res);
            if (data != null)
                res.send((0, methods_1.sendResponse)(data));
        });
    }
}
exports.WebhookController = WebhookController;
