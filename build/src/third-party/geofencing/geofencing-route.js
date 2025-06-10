"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const geofencing_controller_1 = require("./geofencing-controller");
const geofencingRoute = (0, express_1.Router)(), geofencingController = new geofencing_controller_1.GeofencingController();
geofencingRoute.get("/list-provinces", geofencingController.list_provinces);
exports.default = geofencingRoute;
