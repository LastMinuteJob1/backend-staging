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
exports.UserController = void 0;
const UserService_1 = require("./UserService");
const methods_1 = require("../../helper/methods");
class UserController {
    constructor() {
        this.userService = new UserService_1.UserService();
        this.signup = (request, response) => __awaiter(this, void 0, void 0, function* () {
            let data = yield this.userService.signup(request, response);
            if (data != null)
                response.send((0, methods_1.sendResponse)(data));
        });
        this.check_otp_validity = (request, response) => __awaiter(this, void 0, void 0, function* () {
            let data = yield this.userService.check_otp_validity(request, response);
            if (data != null)
                response.send((0, methods_1.sendResponse)(data));
        });
        this.verify_email = (request, response) => __awaiter(this, void 0, void 0, function* () {
            let data = yield this.userService.verify_email(request, response);
            if (data != null)
                response.send((0, methods_1.sendResponse)(data));
        });
        this.request_verification_code = (request, response) => __awaiter(this, void 0, void 0, function* () {
            let data = yield this.userService.request_verification_code(request, response);
            if (data != null)
                response.send((0, methods_1.sendResponse)(data));
        });
        this.login = (request, response) => __awaiter(this, void 0, void 0, function* () {
            let data = yield this.userService.login(request, response);
            if (data != null)
                response.send((0, methods_1.sendResponse)(data));
        });
        this.password_recovery = (request, response) => __awaiter(this, void 0, void 0, function* () {
            let data = yield this.userService.password_recovery(request, response);
            if (data != null)
                response.send((0, methods_1.sendResponse)(data));
        });
        this.verify_google_oauth_token_id = (request, response) => __awaiter(this, void 0, void 0, function* () {
            let data = yield this.userService.verify_google_oauth_token_id(request, response);
            if (data != null)
                response.send((0, methods_1.sendResponse)(data));
        });
    }
}
exports.UserController = UserController;
