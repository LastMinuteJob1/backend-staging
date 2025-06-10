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
exports.AdminDashboardController = void 0;
const methods_1 = require("../../helper/methods");
const AdminDashboardService_1 = require("./AdminDashboardService");
class AdminDashboardController {
    constructor() {
        this.adminDashboardService = new AdminDashboardService_1.AdminDashboardService();
        this.load_faq = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let data = yield this.adminDashboardService.load_faq(req, res);
            if (data != null)
                res.send((0, methods_1.sendResponse)(data));
        });
    }
}
exports.AdminDashboardController = AdminDashboardController;
