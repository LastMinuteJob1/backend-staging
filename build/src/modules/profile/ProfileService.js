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
exports.ProfileService = void 0;
const error_1 = require("../../helper/error");
const methods_1 = require("../../helper/methods");
const UserModel_1 = __importDefault(require("../user/UserModel"));
const ProfileModel_1 = __importDefault(require("./ProfileModel"));
const console_1 = require("console");
const UserInterface_1 = require("../user/UserInterface");
const StorageService_1 = require("../../../storage/StorageService");
const StripeCustomerModel_1 = __importDefault(require("../../third-party/stripe-payment/StripeCustomerModel"));
class ProfileService {
    constructor() {
        this.storageService = new StorageService_1.StorageService("profile-uploads");
        this.viewProfile = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let user = yield (0, methods_1.getUser)(req), uid = UserModel_1.default.findOne({ where: { email: user.email }, include: [{
                            model: ProfileModel_1.default
                        }, {
                            model: StripeCustomerModel_1.default
                        }],
                    attributes: { exclude: ["password", "verification_code"] } });
                return uid;
            }
            catch (error) {
                res.status(500).send((0, error_1.sendError)(error));
                return null;
            }
        });
        this.addProfile = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let user = yield this.viewProfile(req, res);
                if (!user) {
                    res.status(400).send((0, error_1.sendError)("Unfortunately something went wrong"));
                    return null;
                }
                let profile = user["dataValues"]["Profile"];
                let data = req.body;
                let referal_code = (0, methods_1.generateReferralCode)();
                let { job_title, job_description, years_of_experience, certifications, other_jobs, description, other_info, prove_of_location, } = data;
                if (!profile) {
                    let new_profile = yield ProfileModel_1.default.create({
                        job_title, job_description, years_of_experience,
                        certifications, other_jobs, description,
                        other_info, prove_of_location, referal_code
                    });
                    if (!new_profile) {
                        res.status(500).send((0, error_1.sendError)("Unable to create profile"));
                        return null;
                    }
                    yield new_profile.setUser(user);
                }
                else {
                    job_title = job_title || profile.job_title;
                    job_description = job_description || profile.job_description;
                    years_of_experience = years_of_experience || profile.years_of_experience;
                    certifications = certifications || profile.certifications;
                    other_jobs = other_jobs || profile.other_jobs;
                    description = description || profile.description;
                    other_info = other_info || profile.other_info;
                    referal_code = profile.referal_code || (0, methods_1.generateReferralCode)();
                    yield profile.update({
                        job_title, job_description, years_of_experience,
                        certifications, other_jobs, description,
                        other_info, referal_code
                    });
                }
                return yield this.viewProfile(req, res);
            }
            catch (error) {
                res.status(500).send((0, error_1.sendError)(error));
                return null;
            }
        });
        this.upload = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                (0, console_1.log)(">>>>>>>>>>>>>>>>>>>>>>>>UPLOAD>>>>>>>>>>>>>>>>>>>>>>>>");
                const file = req.file, { filename } = file;
                let { type } = req.body;
                (0, console_1.log)({ body: req.body }, { type });
                if (type != "pics" && type != "prove") {
                    res.status(400).send((0, error_1.sendError)("upload type must either be 'pics' or 'prove'"));
                    return null;
                }
                let { status, data } = yield this.storageService.uploadPicture(file, filename);
                console.log({ data });
                if (!status) {
                    (0, console_1.log)("Error uploading");
                }
                let file_name = data === null || data === void 0 ? void 0 : data.Location;
                let data_ = type == "pics" ? {
                    profile_pics: file_name
                } : {
                    prove_of_location: file_name
                };
                let user = yield (0, methods_1.getUser)(req), email = user.email;
                let new_user = yield UserModel_1.default.findOne({ where: { email }, include: [{ model: ProfileModel_1.default }] });
                let profile = new_user["Profile"];
                if (!profile) {
                    profile = yield ProfileModel_1.default.create();
                    yield new_user.setProfile(profile);
                }
                yield profile.update(data_);
                return yield this.viewProfile(req, res);
            }
            catch (err) {
                res.status(500).send((0, error_1.sendError)(err));
                (0, console_1.log)(err);
                return null;
            }
        });
        this.update_username_and_password = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let user = yield this.viewProfile(req, res);
                if (!user) {
                    res.status(400).send((0, error_1.sendError)("Unfortunately something went wrong"));
                    return null;
                }
                let { fullname, password } = req.body;
                yield user.update({
                    fullname: fullname ? fullname : user.fullname,
                    password: password ? (0, methods_1.hashPassword)(password) : user.password
                });
                return user;
            }
            catch (err) {
                res.status(500).send((0, error_1.sendError)(err));
                (0, console_1.log)(err);
                return null;
            }
        });
        this.deactivate_or_delete_account = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let user = yield this.viewProfile(req, res);
                if (!user) {
                    res.status(400).send((0, error_1.sendError)("Unfortunately something went wrong"));
                    return null;
                }
                let { status, reason } = req.body;
                if (status != UserInterface_1.IUserAccountStatus.ACTIVE && status != UserInterface_1.IUserAccountStatus.IN_ACTIVE) {
                    res.status(400).send((0, error_1.sendError)("You can only de-activate or activate account"));
                    return null;
                }
                yield user.update({ active: status, reason: reason || "" });
                return user;
            }
            catch (err) {
                res.status(500).send((0, error_1.sendError)(err));
                (0, console_1.log)(err);
                return null;
            }
        });
    }
}
exports.ProfileService = ProfileService;
