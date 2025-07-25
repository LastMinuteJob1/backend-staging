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
exports.AdminDashboardService = void 0;
const error_1 = require("../../helper/error");
const console_1 = require("console");
const terms_model_1 = __importDefault(require("./terms-and-condition/terms-model"));
class AdminDashboardService {
    constructor() {
        this.load_faq = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let { q } = req.query;
                return yield terms_model_1.default.findOne({ where: { id: 1 } });
            }
            catch (error) {
                res.status(500).send((0, error_1.sendError)(error));
                (0, console_1.log)({ error });
                return null;
            }
        });
    }
}
exports.AdminDashboardService = AdminDashboardService;
