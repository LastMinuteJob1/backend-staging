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
exports.AdminInteracController = void 0;
const admin_interac_service_1 = require("./admin-interac-service");
const methods_1 = require("../../../helper/methods");
class AdminInteracController {
    constructor() {
        this.adminInteracService = new admin_interac_service_1.AdminInteracService();
        this.listAllInteracAccounts = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let data = yield this.adminInteracService.listAllInteracAccounts(req, res);
            if (data != null)
                res.send((0, methods_1.sendResponse)(data));
        });
        this.listAllInteracPayments = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let data = yield this.adminInteracService.listAllInteracPayments(req, res);
            if (data != null)
                res.send((0, methods_1.sendResponse)(data));
        });
        this.toggleInteracPayment = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let data = yield this.adminInteracService.toggleInteracPayment(req, res);
            if (data != null)
                res.send((0, methods_1.sendResponse)(data));
        });
    }
}
exports.AdminInteracController = AdminInteracController;
