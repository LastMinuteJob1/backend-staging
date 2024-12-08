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
exports.AdminUserController = void 0;
const admin_user_service_1 = require("./admin-user-service");
const methods_1 = require("../../../helper/methods");
class AdminUserController {
    constructor() {
        this._adminUserService = new admin_user_service_1.AdminUserService();
        // view all users
        this.all_users = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let data = yield this._adminUserService.all_users(req, res);
            if (data != null)
                res.send((0, methods_1.sendResponse)(data));
        });
        // view a user
        this.view_users = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let data = yield this._adminUserService.view_users(req, res);
            if (data != null)
                res.send((0, methods_1.sendResponse)(data));
        });
        // block or unblock a user
        this.toggle_user_Account = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let data = yield this._adminUserService.toggle_user_Account(req, res);
            if (data != null)
                res.send((0, methods_1.sendResponse)(data));
        });
        // usage statistics
        this.stats = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let data = yield this._adminUserService.stats(req, res);
            if (data != null)
                res.send((0, methods_1.sendResponse)(data));
        });
    }
}
exports.AdminUserController = AdminUserController;
