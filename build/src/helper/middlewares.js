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
exports.authorization = exports.job_creation_middleware = exports.signup_middleware = exports.ErrorWatcher = void 0;
const error_1 = require("./error");
const schema_1 = require("./schema");
const methods_1 = require("./methods");
const UserModel_1 = __importDefault(require("../modules/user/UserModel"));
const console_1 = require("console");
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
    let err = error;
    (0, console_1.log)(err);
    if (error) {
        res.status(400).json((0, error_1.sendError)(err["details"][0]["message"]));
        return;
    }
    else
        next();
}
exports.signup_middleware = signup_middleware;
function job_creation_middleware(req, res, next) {
    const { error } = schema_1.jobSchema.validate(req.body);
    let err = error;
    if (error) {
        res.status(400).json((0, error_1.sendError)(err["details"][0]["message"]));
        return;
    }
    else
        next();
}
exports.job_creation_middleware = job_creation_middleware;
function authorization(req, res, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        //  jwt authorization and stack in user into request object
        const header = req.headers, token = ((_a = header["authorization"]) === null || _a === void 0 ? void 0 : _a.replace("Bearer ", "")) || "";
        let decoded = yield (0, methods_1.validateToken)(token);
        console.log(decoded);
        if (decoded == null) {
            let err = (0, error_1.sendError)("Invalid authorization code", 401);
            res.status(401).send(err);
        }
        else {
            let user = yield UserModel_1.default.findOne({ where: { token } });
            if (user == null) {
                let err = (0, error_1.sendError)("No user with this Auth token", 401);
                res.status(401).send(err);
                return;
            }
            if (!user.active) {
                let err = (0, error_1.sendError)("This account is no longer active", 401);
                res.status(401).send(err);
                return;
            }
            req.headers["user"] = JSON.stringify(user);
            next();
        }
    });
}
exports.authorization = authorization;
