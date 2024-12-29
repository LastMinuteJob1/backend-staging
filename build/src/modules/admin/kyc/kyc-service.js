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
exports.KYCService = void 0;
const error_1 = require("../../../helper/error");
const sequelize_1 = require("sequelize");
const ProfileModel_1 = __importDefault(require("../../profile/ProfileModel"));
const UserModel_1 = __importDefault(require("../../user/UserModel"));
class KYCService {
    constructor() {
        this.allKycs = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let { page, limit, desc, q, status } = req.query;
                let page_ = page ? parseInt(page) : 1;
                let limit_ = limit ? parseInt(limit) : 10;
                let desc_ = desc ? parseInt(desc) : 1;
                let q_ = q ? q : "";
                let status_ = status ? status : "no-profile"; // no-profile , unverified-kyc, verified-kyc
                let data = [];
                switch (status_) {
                    case "no-profile":
                        data = yield UserModel_1.default.paginate({
                            page: page_, paginate: limit_,
                            order: [['id', desc_ == 1 ? "DESC" : "ASC"]],
                            where: {
                                // profile: null,
                                [sequelize_1.Op.or]: {
                                    email: { [sequelize_1.Op.like]: `%${q_}%` },
                                    phone_number: { [sequelize_1.Op.like]: `%${q_}%` },
                                    address: { [sequelize_1.Op.like]: `%${q_}%` },
                                    city: { [sequelize_1.Op.like]: `%${q_}%` },
                                    postal_code: { [sequelize_1.Op.like]: `%${q_}%` },
                                    fullname: { [sequelize_1.Op.like]: `%${q_}%` },
                                    pronoun: { [sequelize_1.Op.like]: `%${q_}%` },
                                    province: { [sequelize_1.Op.like]: `%${q_}%` },
                                    // dob: { [Op.like] : `%${q_}%`  },
                                }
                            },
                            include: [{
                                    model: ProfileModel_1.default,
                                    required: false
                                }],
                            attributes: { exclude: ["password", "verification_code", "token"] }
                        });
                        break;
                    case "unverified-kyc":
                        data = yield UserModel_1.default.paginate({
                            page: page_, paginate: limit_,
                            order: [['id', desc_ == 1 ? "DESC" : "ASC"]],
                            where: {
                                [sequelize_1.Op.or]: {
                                    email: { [sequelize_1.Op.like]: `%${q_}%` },
                                    phone_number: { [sequelize_1.Op.like]: `%${q_}%` },
                                    address: { [sequelize_1.Op.like]: `%${q_}%` },
                                    city: { [sequelize_1.Op.like]: `%${q_}%` },
                                    postal_code: { [sequelize_1.Op.like]: `%${q_}%` },
                                    fullname: { [sequelize_1.Op.like]: `%${q_}%` },
                                    pronoun: { [sequelize_1.Op.like]: `%${q_}%` },
                                    province: { [sequelize_1.Op.like]: `%${q_}%` },
                                    // dob: { [Op.like] : `%${q_}%`  },
                                }
                            },
                            include: [{
                                    required: true,
                                    model: ProfileModel_1.default,
                                    where: {
                                        is_kyc_verified: false
                                    }
                                }],
                            attributes: { exclude: ["password", "verification_code", "token"] }
                        });
                        break;
                    case "verified-kyc":
                        data = yield UserModel_1.default.paginate({
                            page: page_, paginate: limit_,
                            order: [['id', desc_ == 1 ? "DESC" : "ASC"]],
                            where: {
                                [sequelize_1.Op.or]: {
                                    email: { [sequelize_1.Op.like]: `%${q_}%` },
                                    phone_number: { [sequelize_1.Op.like]: `%${q_}%` },
                                    address: { [sequelize_1.Op.like]: `%${q_}%` },
                                    city: { [sequelize_1.Op.like]: `%${q_}%` },
                                    postal_code: { [sequelize_1.Op.like]: `%${q_}%` },
                                    fullname: { [sequelize_1.Op.like]: `%${q_}%` },
                                    pronoun: { [sequelize_1.Op.like]: `%${q_}%` },
                                    province: { [sequelize_1.Op.like]: `%${q_}%` },
                                    // dob: { [Op.like] : `%${q_}%`  },
                                }
                            },
                            include: [{
                                    required: true,
                                    model: ProfileModel_1.default,
                                    where: {
                                        is_kyc_verified: true
                                    }
                                }],
                            attributes: { exclude: ["password", "verification_code", "token"] }
                        });
                        break;
                    default:
                        data = yield UserModel_1.default.paginate({
                            page: page_, paginate: limit_,
                            order: [['id', desc_ == 1 ? "DESC" : "ASC"]],
                            where: {
                                [sequelize_1.Op.or]: {
                                    email: { [sequelize_1.Op.like]: `%${q_}%` },
                                    phone_number: { [sequelize_1.Op.like]: `%${q_}%` },
                                    address: { [sequelize_1.Op.like]: `%${q_}%` },
                                    city: { [sequelize_1.Op.like]: `%${q_}%` },
                                    postal_code: { [sequelize_1.Op.like]: `%${q_}%` },
                                    fullname: { [sequelize_1.Op.like]: `%${q_}%` },
                                    pronoun: { [sequelize_1.Op.like]: `%${q_}%` },
                                    province: { [sequelize_1.Op.like]: `%${q_}%` },
                                    // dob: { [Op.like] : `%${q_}%`  },
                                }
                            },
                            include: [{
                                    model: ProfileModel_1.default,
                                }],
                            attributes: { exclude: ["password", "verification_code", "token"] }
                        });
                        break;
                }
                return data;
            }
            catch (error) {
                res.status(500).send((0, error_1.sendError)(error));
                return null;
            }
        });
        this.toogleKyc = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let { email } = req.params;
                let { status } = req.body;
                status = status ? status == "true" ? true : false : false;
                let profile = yield ProfileModel_1.default.findOne({
                    include: [
                        {
                            model: UserModel_1.default, where: { email },
                            attributes: { exclude: ["password", "verification_code", "token"] }
                        }
                    ]
                });
                if (!profile) {
                    res.status(404).send((0, error_1.sendError)("Please contact user to upload profile"));
                    return null;
                }
                return yield profile.update({ is_kyc_verified: status });
            }
            catch (error) {
                res.status(500).send((0, error_1.sendError)(error));
                return null;
            }
        });
        this.verifyKYC = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let { urls } = req.body;
                return { urls };
            }
            catch (error) {
                res.status(500).send((0, error_1.sendError)(error));
                return null;
            }
        });
    }
}
exports.KYCService = KYCService;
