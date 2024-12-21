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
exports.AdminInteracService = void 0;
const error_1 = require("../../../helper/error");
const console_1 = require("console");
const interac_service_1 = require("../../interac/interac-service");
class AdminInteracService {
    constructor() {
        this.interacService = new interac_service_1.InteracSercvice();
        this.listAllInteracAccounts = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.interacService.listAllAccount(req, res);
            }
            catch (error) {
                res.status(500).send((0, error_1.sendError)(error));
                (0, console_1.log)({ error });
                return null;
            }
        });
        this.listAllInteracPayments = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.interacService.allInteracPayments(req, res);
            }
            catch (error) {
                res.status(500).send((0, error_1.sendError)(error));
                (0, console_1.log)({ error });
                return null;
            }
        });
        this.toggleInteracPayment = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.interacService.togglePayment(req, res);
            }
            catch (error) {
                res.status(500).send((0, error_1.sendError)(error));
                (0, console_1.log)({ error });
                return null;
            }
        });
    }
}
exports.AdminInteracService = AdminInteracService;
