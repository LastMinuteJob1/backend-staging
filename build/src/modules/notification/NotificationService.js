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
exports.NotificationService = void 0;
const slugify_1 = __importDefault(require("slugify"));
const methods_1 = require("../../helper/methods");
const NotificationModel_1 = __importDefault(require("./NotificationModel"));
const error_1 = require("../../helper/error");
const sequelize_1 = require("sequelize");
const UserModel_1 = __importDefault(require("../user/UserModel"));
class NotificationService {
    constructor() {
        this.open_notification = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield (0, methods_1.getUser)(req);
                if (user == null) {
                    res.send((0, error_1.sendError)("Authentication failed, please login again"));
                    return null;
                }
                let { page, limit, desc, q } = req.query;
                let page_ = page ? parseInt(page) : 1;
                let limit_ = limit ? parseInt(limit) : 10;
                let desc_ = desc ? parseInt(desc) : 1;
                let q_ = q || "";
                let where = q_ == "" ? {} : {
                    where: {
                        [sequelize_1.Op.or]: [
                            { title: { [sequelize_1.Op.like]: `%${q}%` } },
                            { content: { [sequelize_1.Op.like]: `%${q}%` } },
                        ]
                    }
                };
                //  pagination
                const { docs, pages, total } = yield NotificationModel_1.default.paginate(Object.assign(Object.assign({ page: page_, paginate: limit_, order: [['id', desc_ == 1 ? "DESC" : "ASC"]] }, where), { include: [{
                            where: { email: user.email },
                            model: UserModel_1.default, attributes: { exclude: ["password", "verification_code", "token"] }
                        }] }));
                // updating each notification as seen
                setTimeout(() => {
                    docs.forEach((doc) => {
                        doc.update({ seen: true });
                    });
                }, 5000);
                return { docs, pages, total };
            }
            catch (error) {
                res.send((0, error_1.sendError)(error));
                return null;
            }
        });
        this.add_notification = (data) => __awaiter(this, void 0, void 0, function* () {
            let { title, type, content, from, user } = data;
            let slug = (0, slugify_1.default)(title + " " + (0, methods_1.generateRandomNumber)(), { lower: true });
            let notification = yield NotificationModel_1.default.create({
                title, type, content, from, slug
            });
            yield notification.setUser(user.id);
            return yield NotificationModel_1.default.findOne({ where: { slug } });
        });
    }
}
exports.NotificationService = NotificationService;
