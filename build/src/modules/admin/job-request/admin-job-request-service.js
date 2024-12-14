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
exports.AdminJobRequestService = void 0;
const error_1 = require("../../../helper/error");
const JobRequestService_1 = require("../../job_request/JobRequestService");
const JobRequestModel_1 = __importDefault(require("../../job_request/JobRequestModel"));
class AdminJobRequestService {
    constructor() {
        this.jobRequestService = new JobRequestService_1.JobRequestService();
        this.listAllJobRequest = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.jobRequestService.list_all_request_proposals(req, res);
            }
            catch (error) {
                res.status(500).send((0, error_1.sendError)(error));
                return null;
            }
        });
        this.viewJobRequest = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.jobRequestService.open_request(req, res);
            }
            catch (error) {
                res.status(500).send((0, error_1.sendError)(error));
                return null;
            }
        });
        this.deleteJobRequest = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let { slug } = req.params;
                return yield JobRequestModel_1.default.destroy({ where: { slug } });
            }
            catch (error) {
                res.status(500).send((0, error_1.sendError)(error));
                return null;
            }
        });
        this.toggle_request_proposals_admin = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.jobRequestService.toggle_request_proposals_admin(req, res);
            }
            catch (error) {
                res.status(500).send((0, error_1.sendError)(error));
                return null;
            }
        });
    }
}
exports.AdminJobRequestService = AdminJobRequestService;
