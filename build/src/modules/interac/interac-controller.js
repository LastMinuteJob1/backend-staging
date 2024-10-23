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
exports.InteracController = void 0;
const interac_service_1 = require("./interac-service");
const methods_1 = require("../../helper/methods");
class InteracController {
    constructor() {
        this._interacService = new interac_service_1.InteracSercvice();
        this.addAccount = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let data = yield this._interacService.addAccount(req, res);
            if (data != null)
                res.send((0, methods_1.sendResponse)(data));
        });
        this.verifyAddAccountToken = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let data = yield this._interacService.verifyAddAccountToken(req, res);
            if (data != null)
                res.send((0, methods_1.sendResponse)(data));
        });
        this.removeAccount = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let data = yield this._interacService.removeAccount(req, res);
            if (data != null)
                res.send((0, methods_1.sendResponse)(data));
        });
        this.listAccount = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let data = yield this._interacService.listAccount(req, res);
            if (data != null)
                res.send((0, methods_1.sendResponse)(data));
        });
        this.resolvePayment = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let data = yield this._interacService.resolvePayment(req, res);
            if (data != null)
                res.send((0, methods_1.sendResponse)(data));
        });
        this.myInteracPayments = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let data = yield this._interacService.myInteracPayments(req, res);
            if (data != null)
                res.send((0, methods_1.sendResponse)(data));
        });
    }
}
exports.InteracController = InteracController;
