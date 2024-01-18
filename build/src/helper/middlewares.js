"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signup_middleware = exports.ErrorWatcher = void 0;
const error_1 = require("./error");
const schema_1 = require("./schema");
const ErrorWatcher = (err, req, res, next) => {
    if (err instanceof error_1.AppError) {
        res.status(err.statusCode).json({ message: err.message });
    }
    else {
        // Handle other errors (e.g., log and send generic error response)
    }
};
exports.ErrorWatcher = ErrorWatcher;
function signup_middleware(req, res, next) {
    const { error } = schema_1.userSchema.validate(req.body);
    if (error)
        res.status(400).json({ error: error.details });
    else
        next();
}
exports.signup_middleware = signup_middleware;
