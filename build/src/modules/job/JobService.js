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
exports.JobService = void 0;
const error_1 = require("../../helper/error");
const methods_1 = require("../../helper/methods");
const JobModel_1 = __importDefault(require("./JobModel"));
const UserModel_1 = __importDefault(require("../user/UserModel"));
const BlobController_1 = require("../../third-party/azure-blob-storage/BlobController");
const slugify_1 = __importDefault(require("slugify"));
const sequelize_1 = require("sequelize");
const NotificationController_1 = require("../notification/NotificationController");
const console_1 = require("console");
const JobPics_1 = __importDefault(require("./JobPics"));
class JobService {
    constructor() {
        this.blobController = new BlobController_1.BlobController();
        this.notificationController = new NotificationController_1.NotificationController();
        this.create_job = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let { description, price, location, date, ad_type, time, } = req.body;
                (0, console_1.log)(req.body);
                // performing upload using azure-blob-storage third party
                let user = yield (0, methods_1.getUser)(req);
                if (!user) {
                    res.send((0, error_1.sendError)("Something went wrong, please login"));
                    return null;
                }
                let slug = (0, slugify_1.default)(description.substring(0, 10) + " " + (0, methods_1.generateRandomNumber)(), { lower: true });
                let obj = {
                    slug, description, price,
                    job_location: location, job_date: date, type: ad_type, job_time: time,
                };
                // log({obj})
                const job = yield JobModel_1.default.create(obj);
                if (!job) {
                    res.send((0, error_1.sendError)("Error creating job"));
                    return null;
                }
                yield job.setUser(user.id);
                // await job.save()
                // job.user 
                // stack in an in-app notification
                // this.notificationController.add_notification({
                //     from: "Last Minute Job", // sender
                //     title: "Job creation",
                //     type: NOTIFICATION_TYPE.JOB_POST_NOTIFICATION,
                //     content: `Hello ${user.fullname}, \nYour job have been posted successfully, you will get feedback from our users in a couple of minutes. Stay tunned to the app`,
                //     user: user // receipant
                // })
                return yield JobModel_1.default.findOne({
                    where: { slug },
                    include: [{ model: UserModel_1.default, attributes: { exclude: ["password", "verification_code", "token"] } }]
                });
            }
            catch (error) {
                res.send((0, error_1.sendError)(error));
                (0, console_1.log)({ error });
                return null;
            }
        });
        this.view_job = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let { slug } = req.params;
                const job = yield JobModel_1.default.findOne({
                    where: { slug },
                    include: [{ model: UserModel_1.default, attributes: { exclude: ["password", "verification_code", "token"] } }]
                });
                if (job == null) {
                    res.send((0, error_1.sendError)("Job not found"));
                    return null;
                }
                return job;
            }
            catch (error) {
                res.send((0, error_1.sendError)(error));
                return null;
            }
        });
        this.update_job = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let { description, price, location, type, date, time } = req.body;
                let { slug } = req.params;
                let user = yield (0, methods_1.getUser)(req);
                if (!user) {
                    res.send((0, error_1.sendError)("Something went wrong, please login"));
                    return null;
                }
                // include in the where clause where current user is the owner of the job
                let job = yield JobModel_1.default.findOne({
                    where: { slug },
                    include: [
                        {
                            where: { id: user.id },
                            model: UserModel_1.default, attributes: { exclude: ["password", "verification_code", "token"] }
                        },
                        {
                            model: JobPics_1.default
                        }
                    ]
                });
                if (!job) {
                    res.send((0, error_1.sendError)("You can't update this job"));
                    return null;
                }
                yield job.update({
                    where: { slug },
                    // title: title || job.title,
                    description: description || job.description,
                    price: price || job.price,
                    location: location || job.job_location,
                    job_location: location || job.job_location,
                    job_date: date || job.job_date,
                    type: type || job.type,
                    job_time: time || job.job_time,
                    // priority: priority || job.priority_lvl
                });
                return yield this.view_job(req, res);
            }
            catch (error) {
                res.send((0, error_1.sendError)(error));
                return null;
            }
        });
        this.delete_job = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let { slug } = req.params;
                let user = yield (0, methods_1.getUser)(req);
                if (!user) {
                    res.send((0, error_1.sendError)("Something went wrong, please login"));
                    return null;
                }
                // include in the where clause where current user is the owner of the job
                let job = yield JobModel_1.default.findOne({
                    where: { slug },
                    include: [{
                            where: { id: user.id },
                            model: UserModel_1.default, attributes: { exclude: ["password", "verification_code", "token"] }
                        }]
                });
                if (!job) {
                    res.send((0, error_1.sendError)("You can not delete this job"));
                    return null;
                }
                return yield job.destroy();
            }
            catch (error) {
                res.send((0, error_1.sendError)(error));
                return null;
            }
        });
        this.list_my_jobs = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let { page, limit, desc, q, type, published } = req.query;
                const { email } = req.params;
                const user = UserModel_1.default.findOne({
                    where: { email }
                });
                if (!user) {
                    res.send((0, error_1.sendError)(`user with email ${email} does not exist`));
                    return null;
                }
                let page_ = page ? parseInt(page) : 1;
                let limit_ = limit ? parseInt(limit) : 10;
                let desc_ = desc ? parseInt(desc) : 1;
                let q_ = q ? q : "";
                let type_ = type ? type : "";
                let pb_ = published ? published : "";
                let published_ = pb_ == "true" ? true : false;
                console.log({ published_ });
                // search query param
                let where = q_ == "" ? {
                    where: { published: published_ }
                } : {
                    where: {
                        [sequelize_1.Op.and]: [
                            { published: published_ },
                            { description: { [sequelize_1.Op.like]: `%${q_}%` } }
                        ]
                    }
                };
                if (type_ != "")
                    return yield JobModel_1.default.paginate({
                        page: page_, paginate: limit_,
                        order: [['id', desc_ == 1 ? "DESC" : "ASC"]],
                        where: { [sequelize_1.Op.and]: [{ type: type_ }, { published: published_ }] },
                        include: [
                            {
                                model: JobPics_1.default
                            }, {
                                where: { email },
                                model: UserModel_1.default, attributes: { exclude: ["password", "verification_code", "token"] }
                            }
                        ]
                    });
                //  pagination
                const { docs, pages, total } = yield JobModel_1.default.paginate(Object.assign(Object.assign({ page: page_, paginate: limit_, order: [['id', desc_ == 1 ? "DESC" : "ASC"]] }, where), { include: [
                        {
                            model: JobPics_1.default
                        }, {
                            where: { email },
                            model: UserModel_1.default, attributes: { exclude: ["password", "verification_code", "token"] }
                        }
                    ] }));
                return { docs, pages, total };
            }
            catch (error) {
                res.send((0, error_1.sendError)(error));
                (0, console_1.log)({ error });
                return null;
            }
        });
        this.list_all_jobs = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let { page, limit, desc, q, type } = req.query;
                let page_ = page ? parseInt(page) : 1;
                let limit_ = limit ? parseInt(limit) : 10;
                let desc_ = desc ? parseInt(desc) : 1;
                let q_ = q ? q : "";
                let type_ = type ? type : "";
                //  pagination
                (0, console_1.log)({ type_ });
                if (type_ != "")
                    return yield JobModel_1.default.paginate({
                        page: page_, paginate: limit_,
                        order: [['id', desc_ == 1 ? "DESC" : "ASC"]],
                        where: { type: type_, published: true },
                        include: [
                            {
                                model: JobPics_1.default
                            }, {
                                model: UserModel_1.default, attributes: { exclude: ["password", "verification_code", "token"] }
                            }
                        ]
                    });
                // results by job search
                const { docs, pages, total } = yield JobModel_1.default.paginate({
                    page: page_, paginate: limit_,
                    order: [['id', desc_ == 1 ? "DESC" : "ASC"]],
                    where: {
                        [sequelize_1.Op.or]: [
                            { description: { [sequelize_1.Op.like]: `%${q_}%` } },
                            { job_location: { [sequelize_1.Op.like]: `%${q_}%` } },
                        ],
                        published: true
                    },
                    include: [
                        {
                            model: JobPics_1.default
                        }, {
                            model: UserModel_1.default, attributes: { exclude: ["password", "verification_code", "token"] }
                        }
                    ]
                });
                if (docs.length == 0) {
                    // results by user search
                    console.log("user search");
                    const { docs_, pages_, total_ } = yield JobModel_1.default.paginate({
                        page: page_, paginate: limit_,
                        order: [['id', desc_ == 1 ? "DESC" : "ASC"]],
                        where: { published: true },
                        include: [
                            {
                                model: JobPics_1.default
                            }, {
                                where: {
                                    [sequelize_1.Op.or]: [
                                        { fullname: { [sequelize_1.Op.like]: `%${q_}%` } },
                                        { email: { [sequelize_1.Op.like]: `%${q_}%` } },
                                    ]
                                },
                                model: UserModel_1.default, attributes: { exclude: ["password", "verification_code", "token"] }
                            }
                        ]
                    });
                    return { docs_, pages_, total_ };
                }
                return { docs, pages, total };
            }
            catch (error) {
                res.send((0, error_1.sendError)(error));
                (0, console_1.log)({ error });
                return null;
            }
        });
        this.upload_pics = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                res.send("Under maintainace");
            }
            catch (error) {
                res.send((0, error_1.sendError)(error));
                (0, console_1.log)({ error });
                return null;
            }
        });
        this.publish = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let slug = req.params.slug, job = yield JobModel_1.default.findOne({ where: { slug } });
                if (!job) {
                    res.send((0, error_1.sendError)("Unable to find job"));
                    return null;
                }
                yield job.update({ published: true });
                return job;
            }
            catch (error) {
                res.send((0, error_1.sendError)(error));
                (0, console_1.log)({ error });
                return null;
            }
        });
    }
}
exports.JobService = JobService;
