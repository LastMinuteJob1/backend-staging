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
exports.GeofencingController = void 0;
const geofencing_service_1 = require("./geofencing-service");
const methods_1 = require("../../helper/methods");
class GeofencingController {
    constructor() {
        this._geofencing_service = new geofencing_service_1.GeofencingService();
        this.list_provinces = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let data = yield this._geofencing_service.list_provinces();
            res.send((0, methods_1.sendResponse)(data));
        });
    }
}
exports.GeofencingController = GeofencingController;
