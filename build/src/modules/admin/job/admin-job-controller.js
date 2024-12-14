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
exports.AdminJobController = void 0;
const admin_job_service_1 = require("./admin-job-service");
const methods_1 = require("../../../helper/methods");
class AdminJobController {
    constructor() {
        this.adminJobController = new admin_job_service_1.AdminJobService();
        this.allJobs = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let data = yield this.adminJobController.allJobs(req, res);
            if (data != null)
                res.send((0, methods_1.sendResponse)(data));
        });
        this.viewJob = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let data = yield this.adminJobController.viewJob(req, res);
            if (data != null)
                res.send((0, methods_1.sendResponse)(data));
        });
        this.deleteJob = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let data = yield this.adminJobController.deleteJob(req, res);
            if (data != null)
                res.send((0, methods_1.sendResponse)(data));
        });
    }
}
exports.AdminJobController = AdminJobController;
