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
exports.JobRequestController = void 0;
const JobRequestService_1 = require("./JobRequestService");
const methods_1 = require("../../helper/methods");
class JobRequestController {
    constructor() {
        this.jobRequestService = new JobRequestService_1.JobRequestService();
        // applying for a job
        this.create_request = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let data = yield this.jobRequestService.create_request(req, res);
            if (data != null)
                res.send((0, methods_1.sendResponse)(data));
        });
        // view that job applied for
        this.open_request = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let data = yield this.jobRequestService.open_request(req, res);
            if (data != null)
                res.send((0, methods_1.sendResponse)(data));
        });
        // list all job applications for to my job post
        this.list_my_request_proposals = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let data = yield this.jobRequestService.list_my_request_proposals(req, res);
            if (data != null)
                res.send((0, methods_1.sendResponse)(data));
        });
        // list all the job applications I have sent
        this.list_my_job_request = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let data = yield this.jobRequestService.list_my_job_request(req, res);
            if (data != null)
                res.send((0, methods_1.sendResponse)(data));
        });
        // accept or reject job application
        this.toggle_request_proposals = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let data = yield this.jobRequestService.toggle_request_proposals(req, res);
            if (data != null)
                res.send((0, methods_1.sendResponse)(data));
        });
        // submit accepted job application for completion
        this.submit_accepted_job_request_for_review = (req, res) => __awaiter(this, void 0, void 0, function* () {
            // let data = await this.jobRequestService.submit_accepted_job_request_for_review(req, res)
            // if (data != null)
            //     res.send(sendResponse(data))
        });
        // accept or reject the job application completion request
        this.toggle_accepted_job_request_for_review = (req, res) => __awaiter(this, void 0, void 0, function* () {
            // let data = await this.jobRequestService.toggle_accepted_job_request_for_review(req, res)
            // if (data != null)
            //     res.send(sendResponse(data))
        });
    }
}
exports.JobRequestController = JobRequestController;
