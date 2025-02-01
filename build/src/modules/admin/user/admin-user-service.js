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
exports.AdminUserService = void 0;
const error_1 = require("../../../helper/error");
const UserModel_1 = __importDefault(require("../../user/UserModel"));
const ProfileModel_1 = __importDefault(require("../../profile/ProfileModel"));
const sequelize_1 = require("sequelize");
const console_1 = require("console");
class AdminUserService {
    constructor() {
        // view all users
        this.all_users = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let { page, limit, desc, q, status } = req.query;
                let page_ = page ? parseInt(page) : 1;
                let limit_ = limit ? parseInt(limit) : 10;
                let desc_ = desc ? parseInt(desc) : 1;
                let q_ = q ? q : "";
                let status_ = status ? status == "true" : true;
                let data = yield UserModel_1.default.paginate({
                    page: page_, paginate: limit_,
                    order: [['id', desc_ == 1 ? "DESC" : "ASC"]],
                    where: {
                        active: status_,
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
                return data;
            }
            catch (error) {
                (0, console_1.log)(error);
                res.status(500).send((0, error_1.sendError)(error));
                return null;
            }
        });
        // view a user
        this.view_users = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let { email } = req.params;
                return yield UserModel_1.default.findOne({
                    where: { email },
                    include: [{
                            model: ProfileModel_1.default,
                        }],
                    attributes: { exclude: ["password", "verification_code", "token"] }
                });
            }
            catch (error) {
                res.status(500).send((0, error_1.sendError)(error));
                return null;
            }
        });
        // block or unblock a user
        this.toggle_user_Account = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let { status } = req.body;
                let { email } = req.params;
                let user = yield UserModel_1.default.findOne({ where: { email } });
                if (!user) {
                    res.status(404).send((0, error_1.sendError)("User not found !"));
                    return null;
                }
                yield UserModel_1.default.update({ active: user.active ? false : true }, { where: { email } });
                let updated_user = yield UserModel_1.default.findOne({ where: { email } });
                return {
                    message: `User account successfully ${(updated_user === null || updated_user === void 0 ? void 0 : updated_user.active) ? "activated" : "deactivated"}`,
                    status: "Successful"
                };
            }
            catch (error) {
                res.status(500).send((0, error_1.sendError)(error));
                return null;
            }
        });
        // usage statistics
        this.stats = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                return {
                    users: "1k", jobs: "500k", payments: "$2.5M"
                };
            }
            catch (error) {
                res.status(500).send((0, error_1.sendError)(error));
                return null;
            }
        });
    }
}
exports.AdminUserService = AdminUserService;
