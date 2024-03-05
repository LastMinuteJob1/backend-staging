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
class ProfileService {
    constructor() {
        this.viewProfile = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let user = yield (0, methods_1.getUser)(req), uid = UserModel_1.default.findOne({ where: { email: user.email }, include: [{
                            model: ProfileModel_1.default
                        }],
                    attributes: { exclude: ["password", "verification_code"] } });
                return uid;
            }
            catch (error) {
                res.send((0, error_1.sendError)(error));
                return null;
            }
        });
        this.addProfile = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let user = yield this.viewProfile(req, res);
                if (!user) {
                    res.send((0, error_1.sendError)("Unfortunately something went wrong"));
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
                        res.send((0, error_1.sendError)("Unable to create profile"));
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
                    yield profile.update({
                        job_title, job_description, years_of_experience,
                        certifications, other_jobs, description,
                        other_info
                    });
                }
                return yield this.viewProfile(req, res);
            }
            catch (error) {
                res.send((0, error_1.sendError)(error));
                return null;
            }
        });
        this.upload = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                (0, console_1.log)(">>>>>>>>>>>>>>>>>>>>>>>>UPLOAD>>>>>>>>>>>>>>>>>>>>>>>>");
                const { filename } = req.file;
                let { type } = req.body;
                (0, console_1.log)({ body: req.body }, { type });
                if (type != "pics" && type != "prove") {
                    res.send((0, error_1.sendError)("upload type must either be 'pics' or 'prove'"));
                    return null;
                }
                let data = type == "pics" ? {
                    profile_pics: filename
                } : {
                    prove_of_location: filename
                };
                let user = yield (0, methods_1.getUser)(req), email = user.email;
                let new_user = yield UserModel_1.default.findOne({ where: { email }, include: [{ model: ProfileModel_1.default }] });
                let profile = new_user["Profile"];
                yield yield profile.update(data);
                return yield this.viewProfile(req, res);
            }
            catch (err) {
                res.send((0, error_1.sendError)(err));
                (0, console_1.log)(err);
                return null;
            }
        });
    }
}
exports.ProfileService = ProfileService;
