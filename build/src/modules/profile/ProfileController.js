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
exports.ProfileController = void 0;
const methods_1 = require("../../helper/methods");
const ProfileService_1 = require("./ProfileService");
class ProfileController {
    constructor() {
        this.profileService = new ProfileService_1.ProfileService();
        this.viewProfile = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let data = yield this.profileService.viewProfile(req, res);
            if (data != null)
                res.send((0, methods_1.sendResponse)(data));
        });
        this.addProfile = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let data = yield this.profileService.addProfile(req, res);
            if (data != null)
                res.send((0, methods_1.sendResponse)(data));
        });
        this.upload = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let data = yield this.profileService.upload(req, res);
            if (data != null)
                res.send((0, methods_1.sendResponse)(data));
        });
        this.update_username_and_password = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let data = yield this.profileService.update_username_and_password(req, res);
            if (data != null)
                res.send((0, methods_1.sendResponse)(data));
        });
        this.deactivate_or_delete_account = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let data = yield this.profileService.deactivate_or_delete_account(req, res);
            if (data != null)
                res.send((0, methods_1.sendResponse)(data));
        });
    }
}
exports.ProfileController = ProfileController;
