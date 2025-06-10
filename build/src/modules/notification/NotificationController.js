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
exports.NotificationController = void 0;
const NotificationService_1 = require("./NotificationService");
const methods_1 = require("../../helper/methods");
class NotificationController {
    constructor() {
        this.notificationService = new NotificationService_1.NotificationService();
        this.open_notification = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let data = yield this.notificationService.open_notification(req, res);
            if (data != null)
                res.send((0, methods_1.sendResponse)(data));
        });
        this.send_dummy_notification = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let data = yield this.notificationService.send_dummy_notification(req, res);
            if (data != null)
                res.send((0, methods_1.sendResponse)(data));
        });
        this.add_notification = (data) => __awaiter(this, void 0, void 0, function* () {
            return yield this.notificationService.add_notification(data);
        });
    }
}
exports.NotificationController = NotificationController;
