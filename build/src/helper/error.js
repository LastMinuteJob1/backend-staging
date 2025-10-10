"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
exports.sendError = sendError;
class AppError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
    }
}
exports.AppError = AppError;
function sendError(message, status = 500) {
    // setTimeout(() => {throw new AppError(message)}, 500)
    return {
        message, result: []
    };
}
