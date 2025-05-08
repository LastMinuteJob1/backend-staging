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
exports.AdminService = void 0;
const error_1 = require("../../../helper/error");
const admin_model_1 = __importDefault(require("./admin-model"));
const methods_1 = require("../../../helper/methods");
const console_1 = require("console");
const _2FA_1 = require("../../../helper/2FA");
const sequelize_1 = require("sequelize");
const admin_link_model_1 = __importDefault(require("./admin-link-model"));
const app_1 = require("../../../../app");
const env_1 = require("../../../config/env");
const StorageService_1 = require("../../../../storage/StorageService");
class AdminService {
    constructor() {
        this.storageService = new StorageService_1.StorageService("job-pics");
        // super admin only
        this.addAdmin = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let { email } = req.body;
                let exisiting_admin = yield admin_model_1.default.findOne({ where: { email } });
                let admin = !exisiting_admin ? yield admin_model_1.default.create({ email, roles: ["subadmin"] }) : exisiting_admin;
                let slug = (0, methods_1.generateUUID)();
                let all_Active_links = yield admin_link_model_1.default.findAll({
                    where: { active: true },
                    include: [
                        {
                            model: admin_model_1.default, where: { id: admin.id }
                        }
                    ]
                });
                all_Active_links.map((link) => {
                    link.update({ active: false });
                });
                let link = yield admin_link_model_1.default.create({ token: slug });
                (yield link).setAdmin(admin);
                (0, console_1.log)({ admin, link });
                setTimeout(() => __awaiter(this, void 0, void 0, function* () { return yield link.update({ active: false }); }), (1000 * 60 * 60 * 24));
                return {
                    message: `A link has been sent to ${email}, valid within 24 hours`,
                    status: "Sccuessful"
                };
            }
            catch (error) {
                res.status(500).send((0, error_1.sendError)(error));
                return null;
            }
        });
        this.removeAdmin = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let { username } = req.params;
                yield admin_model_1.default.destroy({
                    where: {
                        [sequelize_1.Op.or]: {
                            username, email: username
                        }
                    }
                });
                return {
                    message: `${username} has been removed successfully`,
                    status: "successful"
                };
            }
            catch (error) {
                res.status(500).send((0, error_1.sendError)(error));
                return null;
            }
        });
        this.deactivateAdmin = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let { username } = req.params;
                let { status } = req.body;
                yield admin_model_1.default.update({
                    active: status == 'true'
                }, {
                    where: {
                        [sequelize_1.Op.or]: {
                            username, email: username
                        }
                    }
                });
                return {
                    message: `${username} has been ${status == 'true' ? "activated" : "deactivated"} successfully`,
                    status: "successful"
                };
            }
            catch (error) {
                res.status(500).send((0, error_1.sendError)(error));
                return null;
            }
        });
        this.listAdmin = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let _admin = yield (0, methods_1.getAdmin)(req);
                return yield admin_model_1.default.findAll({
                    where: {
                        [sequelize_1.Op.not]: {
                            email: _admin.email
                        }
                    }
                });
            }
            catch (error) {
                res.status(500).send((0, error_1.sendError)(error));
                return null;
            }
        });
        // all admin
        this.loginAdmin = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let { username, password } = req.body;
                let admin = yield admin_model_1.default.findOne({
                    where: {
                        [sequelize_1.Op.or]: {
                            username, email: username
                        }
                    }
                });
                (0, console_1.log)({ admin });
                if (!admin) {
                    res.status(404).send((0, error_1.sendError)("Unable to find username or email"));
                    return null;
                }
                let token = yield (0, methods_1.generateToken)({
                    email: admin.email, name: admin.username
                });
                if (!admin.password) {
                    yield admin.update({ token });
                    return {
                        "message": "Please set up your password",
                        "email": admin.email, token
                    };
                }
                if (!(yield (0, methods_1.comparePassword)(password, admin.password))) {
                    res.status(401).send((0, error_1.sendError)("Incorrect password"));
                    return null;
                }
                if (!admin.active) {
                    res.status(401).send((0, error_1.sendError)("Your access has been restricted"));
                    return null;
                }
                if (!admin.is2FA_active) {
                    yield admin.update({ token });
                    let { secret, url } = yield (0, _2FA_1.generate2FASecret)(admin);
                    return {
                        message: "Please add 2FA Authentication",
                        secret, url, token
                    };
                }
                yield admin.update({ token });
                return yield admin_model_1.default.findOne({
                    where: { [sequelize_1.Op.or]: { username, email: username } }, attributes: {
                        exclude: [
                            "verification_code", "password",
                            "two_factor_temp_secret",
                            "two_factor_temp_secret_ascii"
                        ]
                    }
                });
            }
            catch (error) {
                (0, console_1.log)(error);
                res.status(500).send((0, error_1.sendError)(error));
                return null;
            }
        });
        this.setPasswordAdmin = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let _admin = yield (0, methods_1.getAdmin)(req);
                let { password } = req.body;
                password = yield (0, methods_1.hashPassword)(password);
                (0, console_1.log)({ password });
                yield admin_model_1.default.update({ password }, { where: { id: _admin.id } });
                if (!_admin.is2FA_active) {
                    let admin = yield admin_model_1.default.findOne({ where: { id: _admin.id } });
                    if (!admin) {
                        res.status(404).send((0, error_1.sendError)("Account not found!"));
                        return null;
                    }
                    let { secret, url } = yield (0, _2FA_1.generate2FASecret)(admin);
                    return {
                        message: "Password successfully changed, please add 2FA Authentication",
                        secret, url, token: _admin.token
                    };
                }
                return {
                    update: true
                };
            }
            catch (error) {
                res.status(500).send((0, error_1.sendError)(error));
                return null;
            }
        });
        this.add2FAuthAdmin = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let _admin = yield (0, methods_1.getAdmin)(req);
                let { otp } = req.body;
                let verified = yield (0, _2FA_1.verify2FAToken)(otp, _admin);
                if (!verified) {
                    res.status(401).send((0, error_1.sendError)("Invalid Google Auth token"));
                    return null;
                }
                yield admin_model_1.default.update({ is2FA_active: verified }, { where: { id: _admin.id } });
                return { verified };
            }
            catch (error) {
                res.status(500).send((0, error_1.sendError)(error));
                return null;
            }
        });
        this.requestOTP = (request, response) => __awaiter(this, void 0, void 0, function* () {
            try {
                let { email } = request.body;
                let admin = yield admin_model_1.default.findOne({
                    where: { email }
                });
                if (admin == null) {
                    response.status(404).send((0, error_1.sendError)("Invalid email address"));
                    return null;
                }
                let code = (0, methods_1.generateRandomNumber)();
                (0, console_1.log)({ code });
                yield admin.update({
                    verification_code: code,
                    where: { email }
                });
                app_1.mailController.send({
                    from: env_1.EMAIL_USERNAME, to: email,
                    text: "Your password reset token is: " + code + " valid within 5 minutes",
                    subject: "Password Reset"
                }).catch(err => (0, console_1.log)({ err }));
                setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                    if (admin != null)
                        yield admin.update({
                            verification_code: (0, methods_1.generateRandomNumber)(),
                            where: { email }
                        });
                    console.log("code updated");
                }), 1000 * 60 * 5);
                return yield admin_model_1.default.findOne({
                    where: { email },
                    attributes: {
                        exclude: ["verification_code", "password"]
                    }
                });
            }
            catch (error) {
                response.status(500).send((0, error_1.sendError)(error));
                (0, console_1.log)({ error });
                return null;
            }
        });
        this.changePassword = (request, response) => __awaiter(this, void 0, void 0, function* () {
            try {
                let { email, password, verification_code } = request.body;
                password = yield (0, methods_1.hashPassword)(password);
                (0, console_1.log)({ password });
                let admin = yield admin_model_1.default.findOne({
                    where: { email, verification_code }
                });
                if (admin == null) {
                    response.status(404).send((0, error_1.sendError)("Invalid verification code"));
                    return null;
                }
                yield admin.update({
                    password, verification_code: (0, methods_1.generateRandomNumber)(), where: { email }
                });
                // run on another thread
                app_1.mailController.send({
                    from: env_1.EMAIL_USERNAME, to: email,
                    text: "Your password reset was successful, kindly notify us if you never initated this process",
                    subject: "Password Recovery"
                }).catch(err => (0, console_1.log)(err));
                return yield admin_model_1.default.findOne({ where: { email }, attributes: { exclude: ["verification_code", "password", "token"] } });
            }
            catch (error) {
                response.status(500).send((0, error_1.sendError)(error));
                return null;
            }
        });
        this.addProfile = (request, response) => __awaiter(this, void 0, void 0, function* () {
            try {
                let data = request.body;
                let _admin = yield (0, methods_1.getAdmin)(request);
                // let { otp } = request.body;
                yield admin_model_1.default.update(data, { where: { id: _admin.id } });
                return yield admin_model_1.default.findOne({ where: { email: _admin.email }, attributes: { exclude: ["verification_code", "password", "token"] } });
            }
            catch (error) {
                response.status(500).send((0, error_1.sendError)(error));
                return null;
            }
        });
        this.upload_pics = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                //
                let _admin = yield (0, methods_1.getAdmin)(req);
                let { files } = req;
                for (let file of files) {
                    let { filename } = file;
                    // get signed URL
                    // let url = await this.storageService.signedUploadURL(filename);
                    // upload pics
                    (0, console_1.log)({ type: typeof file, file });
                    let { status, data } = yield this.storageService.uploadPicture(file, filename);
                    console.log({ data });
                    if (!status) {
                        (0, console_1.log)("Error uploading");
                        continue;
                    }
                    let file_name = data === null || data === void 0 ? void 0 : data.Location;
                    (0, console_1.log)(file_name);
                    yield admin_model_1.default.update({ pics: filename }, { where: { id: _admin.id } });
                }
                return yield admin_model_1.default.findOne({ where: { email: _admin.email }, attributes: { exclude: ["verification_code", "password", "token"] } });
            }
            catch (error) {
                res.status(500).send((0, error_1.sendError)(error));
                (0, console_1.log)({ error });
                return null;
            }
        });
    }
}
exports.AdminService = AdminService;
