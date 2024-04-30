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
exports.JobController = void 0;
const JobService_1 = require("./JobService");
const methods_1 = require("../../helper/methods");
class JobController {
    constructor() {
        this.jobService = new JobService_1.JobService();
        this.create_job = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let data = yield this.jobService.create_job(req, res);
            if (data != null)
                res.send((0, methods_1.sendResponse)(data));
        });
        this.view_job = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let data = yield this.jobService.view_job(req, res);
            if (data != null)
                res.send((0, methods_1.sendResponse)(data));
        });
        this.update_job = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let data = yield this.jobService.update_job(req, res);
            if (data != null)
                res.send((0, methods_1.sendResponse)(data));
        });
        this.delete_job = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let data = yield this.jobService.delete_job(req, res);
            if (data != null)
                res.send((0, methods_1.sendResponse)(data));
        });
        this.list_my_jobs = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let data = yield this.jobService.list_my_jobs(req, res);
            if (data != null)
                res.send((0, methods_1.sendResponse)(data));
        });
        this.list_all_jobs = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let data = yield this.jobService.list_all_jobs(req, res);
            if (data != null)
                res.send((0, methods_1.sendResponse)(data));
        });
        this.upload_pics = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let data = yield this.jobService.upload_pics(req, res);
            if (data != null)
                res.send((0, methods_1.sendResponse)(data));
        });
        this.delete_job_pics = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let data = yield this.jobService.delete_job_pics(req, res);
            if (data != null)
                res.send((0, methods_1.sendResponse)(data));
        });
        this.publish = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let data = yield this.jobService.publish(req, res);
            if (data != null)
                res.send((0, methods_1.sendResponse)(data));
        });
        this.submit_job = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let data = yield this.jobService.submit_job(req, res);
            if (data != null)
                res.send((0, methods_1.sendResponse)(data));
        });
        this.ongoing_job = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let data = yield this.jobService.ongoing_job(req, res);
            if (data != null)
                res.send((0, methods_1.sendResponse)(data));
        });
        this.verify_transaction = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let data = yield this.jobService.verify_transaction(req, res);
            if (data != null)
                res.send((0, methods_1.sendResponse)(data));
        });
    }
}
exports.JobController = JobController;
