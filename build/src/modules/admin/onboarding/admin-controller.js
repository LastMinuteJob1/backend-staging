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
exports.AdminController = void 0;
const admin_service_1 = require("./admin-service");
const methods_1 = require("../../../helper/methods");
class AdminController {
    constructor() {
        this._adminService = new admin_service_1.AdminService();
        // super admin only
        this.addAdmin = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let data = yield this._adminService.addAdmin(req, res);
            if (data != null)
                res.send((0, methods_1.sendResponse)(data));
        });
        this.removeAdmin = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let data = yield this._adminService.removeAdmin(req, res);
            if (data != null)
                res.send((0, methods_1.sendResponse)(data));
        });
        this.deactivateAdmin = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let data = yield this._adminService.deactivateAdmin(req, res);
            if (data != null)
                res.send((0, methods_1.sendResponse)(data));
        });
        this.listAdmin = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let data = yield this._adminService.listAdmin(req, res);
            if (data != null)
                res.send((0, methods_1.sendResponse)(data));
        });
        // all admin
        this.loginAdmin = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let data = yield this._adminService.loginAdmin(req, res);
            if (data != null)
                res.send((0, methods_1.sendResponse)(data));
        });
        this.setPasswordAdmin = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let data = yield this._adminService.setPasswordAdmin(req, res);
            if (data != null)
                res.send((0, methods_1.sendResponse)(data));
        });
        this.add2FAuthAdmin = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let data = yield this._adminService.add2FAuthAdmin(req, res);
            if (data != null)
                res.send((0, methods_1.sendResponse)(data));
        });
        this.requestOTP = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let data = yield this._adminService.requestOTP(req, res);
            if (data != null)
                res.send((0, methods_1.sendResponse)(data));
        });
        this.changePassword = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let data = yield this._adminService.changePassword(req, res);
            if (data != null)
                res.send((0, methods_1.sendResponse)(data));
        });
        this.addProfile = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let data = yield this._adminService.addProfile(req, res);
            if (data != null)
                res.send((0, methods_1.sendResponse)(data));
        });
        this.upload_pics = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let data = yield this._adminService.upload_pics(req, res);
            if (data != null)
                res.send((0, methods_1.sendResponse)(data));
        });
        this.profile = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let data = yield this._adminService.profile(req, res);
            if (data != null)
                res.send((0, methods_1.sendResponse)(data));
        });
    }
}
exports.AdminController = AdminController;
