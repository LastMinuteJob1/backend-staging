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
exports.StorageService = void 0;
const app_1 = require("../app");
const path_1 = __importDefault(require("path"));
const fs = require("fs");
class StorageService {
    constructor() {
        this.view = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const filePath = path_1.default.join(app_1.storage_path, req.params.filename);
                // Validate file existence and permissions
                if (!fs.existsSync(filePath)) {
                    return res.status(404).send('File not found');
                }
                const fileStats = fs.statSync(filePath);
                if (!fileStats.isFile()) {
                    return res.status(400).send('Not a file');
                }
                // Check for image files
                const extension = path_1.default.extname(filePath).toLowerCase();
                if (!['.jpg', '.jpeg', '.png', '.gif'].includes(extension)) {
                    // Handle non-image files as downloads
                    res.setHeader('Content-Type', 'application/octet-stream');
                    res.setHeader('Content-Disposition', `attachment; filename="${req.params.filename}"`);
                    fs.createReadStream(filePath).pipe(res);
                    return;
                }
                // Set image content type
                res.setHeader('Content-Type', `image/${(_a = fileStats.mimetype) === null || _a === void 0 ? void 0 : _a.split('/')[1]}`);
                // Stream the image content
                const readStream = fs.createReadStream(filePath);
                readStream.pipe(res);
            }
            catch (error) {
                console.error(error);
                res.status(500).send('Internal server error');
            }
        });
    }
}
exports.StorageService = StorageService;
