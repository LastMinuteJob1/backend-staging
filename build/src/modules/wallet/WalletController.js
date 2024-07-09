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
exports.WalletController = void 0;
const WalletService_1 = require("./WalletService");
const methods_1 = require("../../helper/methods");
class WalletController {
    constructor() {
        this._walletService = new WalletService_1.WalletService();
        this.verify_stripe_payment = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let data = yield this._walletService.verify_stripe_payment(req, res);
            if (data != null)
                res.send((0, methods_1.sendResponse)(data));
        });
        this.fund_wallet = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let data = yield this._walletService.fund_wallet(req, res);
            if (data != null)
                res.send((0, methods_1.sendResponse)(data));
        });
        this.query_wallet = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let data = yield this._walletService.query_wallet(req, res);
            if (data != null)
                res.send((0, methods_1.sendResponse)(data));
        });
        this.wallet_history = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let data = yield this._walletService.wallet_history(req, res);
            if (data != null)
                res.send((0, methods_1.sendResponse)(data));
        });
        this.initiate_withdrawal = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let data = yield this._walletService.initiate_withdrawal(req, res);
            if (data != null)
                res.send((0, methods_1.sendResponse)(data));
        });
    }
}
exports.WalletController = WalletController;
