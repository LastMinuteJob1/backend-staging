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
exports.AdminDashboardService = void 0;
const error_1 = require("../../helper/error");
const console_1 = require("console");
class AdminDashboardService {
    constructor() {
        this.load_faq = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let { q } = req.query;
                return [
                    {
                        "title": "Dummy title",
                        "text": "Dummy text"
                    },
                    {
                        "title": "Dummy title",
                        "text": "Dummy text"
                    },
                    {
                        "title": "Dummy title",
                        "text": "Dummy text"
                    },
                    {
                        "title": "Dummy title",
                        "text": "Dummy text"
                    },
                ];
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
