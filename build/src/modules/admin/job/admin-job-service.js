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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminJobService = void 0;
const error_1 = require("../../../helper/error");
const JobService_1 = require("../../job/JobService");
const _2FA_1 = require("../../../helper/2FA");
const methods_1 = require("../../../helper/methods");
const JobModel_1 = __importDefault(require("../../job/JobModel"));
class AdminJobService {
    constructor() {
        this.jobService = new JobService_1.JobService();
        this.allJobs = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                return this.jobService.list_all_jobs(req, res);
            }
            catch (error) {
                res.status(500).send((0, error_1.sendError)(error));
                return null;
            }
        });
        this.viewJob = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                return this.jobService.view_job(req, res);
            }
            catch (error) {
                res.status(500).send((0, error_1.sendError)(error));
                return null;
            }
        });
        this.deleteJob = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let { otp } = req.body, { slug } = req.params;
                const admin = yield (0, methods_1.getAdmin)(req);
                if (!(yield (0, _2FA_1.verify2FAToken)(otp, admin))) {
                    res.status(402).send((0, error_1.sendError)("Incorrect OTP supplied"));
                    return null;
                }
                return yield JobModel_1.default.destroy({ where: { slug } });
            }
            catch (error) {
                res.status(500).send((0, error_1.sendError)(error));
                return null;
            }
        });
    }
}
exports.AdminJobService = AdminJobService;
