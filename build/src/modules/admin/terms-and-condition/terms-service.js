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
exports.TermsAndConditionService = void 0;
const error_1 = require("../../../helper/error");
const console_1 = require("console");
const terms_model_1 = __importDefault(require("./terms-model"));
class TermsAndConditionService {
    constructor() {
        this.termsAndConditionModel = terms_model_1.default;
        this.addFAQ = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let { faq } = req.body;
                let terms = yield this.termsAndConditionModel.findOne({ where: { id: 1 } });
                if (!terms) {
                    terms = yield this.termsAndConditionModel.create({ faq });
                }
                else {
                    let existing_faqs = terms.faq;
                    for (const _faq of faq)
                        existing_faqs.push(_faq);
                    yield terms.update({ faq: existing_faqs });
                }
                return { message: "FAQ update successfully", terms };
            }
            catch (error) {
                (0, console_1.log)(error);
                res.status(500).send((0, error_1.sendError)(error));
                return null;
            }
        });
        this.getFAQ = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                // let { faq } = req.body;
                let terms = yield this.termsAndConditionModel.findOne({ where: { id: 1 } });
                if (!terms)
                    terms = yield this.termsAndConditionModel.create();
                // await terms.update({faq})
                return terms;
            }
            catch (error) {
                (0, console_1.log)(error);
                res.status(500).send((0, error_1.sendError)(error));
                return null;
            }
        });
    }
}
exports.TermsAndConditionService = TermsAndConditionService;
