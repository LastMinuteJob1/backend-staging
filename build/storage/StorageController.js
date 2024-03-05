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
exports.StorageController = void 0;
const StorageService_1 = require("./StorageService");
class StorageController {
    constructor() {
        this._storageService = new StorageService_1.StorageService();
        this.view = (req, res) => __awaiter(this, void 0, void 0, function* () {
            yield this._storageService.view(req, res);
        });
    }
}
exports.StorageController = StorageController;
