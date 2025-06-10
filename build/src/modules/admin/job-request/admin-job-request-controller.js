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
exports.AdminJobRequestController = void 0;
const admin_job_request_service_1 = require("./admin-job-request-service");
const methods_1 = require("../../../helper/methods");
class AdminJobRequestController {
    constructor() {
        this.jobRequestService = new admin_job_request_service_1.AdminJobRequestService();
        this.listAllJobRequest = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let data = yield this.jobRequestService.listAllJobRequest(req, res);
            if (data != null)
                res.send((0, methods_1.sendResponse)(data));
        });
        this.viewJobRequest = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let data = yield this.jobRequestService.viewJobRequest(req, res);
            if (data != null)
                res.send((0, methods_1.sendResponse)(data));
        });
        this.deleteJobRequest = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let data = yield this.jobRequestService.deleteJobRequest(req, res);
            if (data != null)
                res.send((0, methods_1.sendResponse)(data));
        });
        this.toggle_request_proposals_admin = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let data = yield this.jobRequestService.toggle_request_proposals_admin(req, res);
            if (data != null)
                res.send((0, methods_1.sendResponse)(data));
        });
    }
}
exports.AdminJobRequestController = AdminJobRequestController;
