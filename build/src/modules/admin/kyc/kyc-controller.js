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
exports.KYCController = void 0;
const kyc_service_1 = require("./kyc-service");
const methods_1 = require("../../../helper/methods");
class KYCController {
    constructor() {
        this._kycService = new kyc_service_1.KYCService();
        this.allKycs = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let data = yield this._kycService.allKycs(req, res);
            if (data != null)
                res.send((0, methods_1.sendResponse)(data));
        });
        this.toggleKycs = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let data = yield this._kycService.toogleKyc(req, res);
            if (data != null)
                res.send((0, methods_1.sendResponse)(data));
        });
        this.verifyKYC = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let data = yield this._kycService.verifyKYC(req, res);
            if (data != null)
                res.send((0, methods_1.sendResponse)(data));
        });
    }
}
exports.KYCController = KYCController;
