"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const StorageController_1 = require("./StorageController");
const storageRoute = (0, express_1.Router)(), storageController = new StorageController_1.StorageController();
storageRoute.get("/:filename", storageController.view);
exports.default = storageRoute;
