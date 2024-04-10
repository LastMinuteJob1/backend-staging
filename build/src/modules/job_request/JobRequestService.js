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
exports.JobRequestService = void 0;
const error_1 = require("../../helper/error");
const JobModel_1 = __importDefault(require("../job/JobModel"));
const UserModel_1 = __importDefault(require("../user/UserModel"));
const methods_1 = require("../../helper/methods");
const JobRequestModel_1 = __importDefault(require("./JobRequestModel"));
const slugify_1 = __importDefault(require("slugify"));
const sequelize_1 = require("sequelize");
const JobRequestInterface_1 = require("./JobRequestInterface");
const NotificationService_1 = require("../notification/NotificationService");
const MailService_1 = require("../mailer/MailService");
const env_1 = require("../../config/env");
const NotificationInterface_1 = require("../notification/NotificationInterface");
const StripeService_1 = require("../../third-party/stripe-payment/StripeService");
class JobRequestService {
    constructor() {
        this.notificationService = new NotificationService_1.NotificationService();
        this.emailService = new MailService_1.MailService();
        this.stripeService = new StripeService_1.StripeService();
        this.create_request = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                // get the current user
                const user = yield (0, methods_1.getUser)(req);
                if (user == null) {
                    res.status(400).send((0, error_1.sendError)("Authentication failed, please login again"));
                    return null;
                }
                // fetch the job
                const { slug } = req.params;
                let job = yield JobModel_1.default.findOne({ where: { slug }, include: [{ model: UserModel_1.default, attributes: { exclude: ["password", "verification_code", "token"] } }] });
                if (!job) {
                    res.status(404).send((0, error_1.sendError)("This job no longer exist"));
                    return null;
                }
                // check if you are not the owner of the job
                if (job.dataValues.User.id == user.id) {
                    res.status(400).send((0, error_1.sendError)("You can not apply to a job you posted"));
                    return null;
                }
                // check if job is active
                if (!job.active) {
                    res.status(401).send((0, error_1.sendError)("This job no longer taking application"));
                    return null;
                }
                // check if you haven't applied before
                let my_job_request = yield JobRequestModel_1.default.findOne({
                    include: [
                        {
                            model: UserModel_1.default,
                            attributes: { exclude: ["password", "verification_code", "token"] },
                            where: { id: user.id }
                        },
                        {
                            model: JobModel_1.default,
                            where: { slug },
                            include: [{
                                    model: UserModel_1.default,
                                    attributes: { exclude: ["password", "verification_code", "token"] },
                                }]
                        }
                    ]
                });
                if (my_job_request) {
                    console.log("Already applied");
                    return my_job_request;
                }
                // apply for job
                let job_req_slug = (0, slugify_1.default)(((0, methods_1.generateReferralCode)()), { lower: true });
                let my_job_application = yield JobRequestModel_1.default.create({ slug: job_req_slug });
                yield my_job_application.setUser(user.id);
                yield my_job_application.setJob(job.id);
                // forward email and inapp notification to job owner
                // parallel operations
                this.notificationService.add_notification({
                    from: "Last Minute Job", user: job.dataValues.User,
                    title: `Job Application Update`,
                    type: NotificationInterface_1.NOTIFICATION_TYPE.JOB_REJECT_NOTIFICATION,
                    content: `${user.fullname} Just applied for your job, kindly review in the app`
                });
                this.emailService.send({
                    from: env_1.EMAIL_USERNAME, to: job.dataValues.User.email,
                    text: `Dear ${job.dataValues.User["fullname"].split(" ")[0]} <br> ${user["fullname"]} just sent a proposal regarding your job`,
                    subject: "Job Application"
                });
                return yield JobRequestModel_1.default.findOne({ where: { slug: job_req_slug }, include: [
                        {
                            model: UserModel_1.default,
                            attributes: { exclude: ["password", "verification_code", "token"] },
                        },
                        {
                            model: JobModel_1.default,
                            include: [{
                                    model: UserModel_1.default,
                                    attributes: { exclude: ["password", "verification_code", "token"] },
                                }]
                        }
                    ] });
            }
            catch (error) {
                res.status(500).send((0, error_1.sendError)(error));
                return null;
            }
        });
        this.open_request = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                // get the current user
                const user = yield (0, methods_1.getUser)(req);
                if (user == null) {
                    res.status(401).send((0, error_1.sendError)("Authentication failed, please login again"));
                    return null;
                }
                const { slug } = req.params;
                // view request
                const job_request = yield JobRequestModel_1.default.findOne({ where: { slug }, include: [{ model: JobModel_1.default, include: [{ model: UserModel_1.default, attributes: { exclude: ["password", "verification_code", "token"] } }] }] });
                if (!job_request) {
                    res.status(404).send((0, error_1.sendError)("The request you are trying to open doen't exist"));
                    return null;
                }
                return job_request;
            }
            catch (error) {
                res.status(500).send((0, error_1.sendError)(error));
                return null;
            }
        });
        this.list_my_request_proposals = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                // get the current user
                const user = yield (0, methods_1.getUser)(req);
                if (user == null) {
                    res.status(400).send((0, error_1.sendError)("Authentication failed, please login again"));
                    return null;
                }
                const { email } = req.params;
                if (email != user.email) {
                    res.status(400).send((0, error_1.sendError)("Unauthorized for this action, please use your email"));
                    return null;
                }
                let { page, limit, desc, q, status } = req.query;
                let page_ = page ? parseInt(page) : 1;
                let limit_ = limit ? parseInt(limit) : 10;
                let desc_ = desc ? parseInt(desc) : 1;
                let q_ = q ? q : "";
                let status_ = status ? status : "";
                let clause = {
                    page: page_, paginate: limit_,
                    order: [['id', desc_ == 1 ? "DESC" : "ASC"]],
                    include: [
                        {
                            model: UserModel_1.default, attributes: { exclude: ["password", "verification_code", "token"] },
                            include: []
                        },
                        { model: JobModel_1.default, where: {
                                [sequelize_1.Op.or]: [
                                    // { title: { [Op.like]: `%${q_}%` } },
                                    { description: { [sequelize_1.Op.like]: `%${q_}%` } },
                                ]
                            }, include: [{ model: UserModel_1.default, where: { email }, attributes: { exclude: ["password", "verification_code", "token"] } }] }
                    ]
                };
                if (status_)
                    clause.where = { status: status_ };
                // view request
                const job_request = yield JobRequestModel_1.default.paginate(clause);
                return job_request;
            }
            catch (error) {
                res.status(500).send((0, error_1.sendError)(error));
                return null;
            }
        });
        this.list_my_job_request = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                // get the current user
                const user = yield (0, methods_1.getUser)(req);
                if (user == null) {
                    res.status(400).send((0, error_1.sendError)("Authentication failed, please login again"));
                    return null;
                }
                const { email } = req.params;
                if (email != user.email) {
                    res.status(400).send((0, error_1.sendError)("Unauthorized for this action, please use your email"));
                    return null;
                }
                let { page, limit, desc, q, status } = req.query;
                let page_ = page ? parseInt(page) : 1;
                let limit_ = limit ? parseInt(limit) : 10;
                let desc_ = desc ? parseInt(desc) : 1;
                let q_ = q ? q : "";
                let status_ = status ? status : "";
                let clause = {
                    page: page_, paginate: limit_,
                    order: [['id', desc_ == 1 ? "DESC" : "ASC"]],
                    include: [
                        {
                            model: UserModel_1.default, where: { email }, attributes: { exclude: ["password", "verification_code", "token"] },
                            include: []
                        },
                        { model: JobModel_1.default, where: {
                                [sequelize_1.Op.or]: [
                                    // { title: { [Op.like]: `%${q_}%` } },
                                    { description: { [sequelize_1.Op.like]: `%${q_}%` } },
                                ]
                            }, include: [{ model: UserModel_1.default, attributes: { exclude: ["password", "verification_code", "token"] } }] }
                    ]
                };
                if (status_)
                    clause["where"] = { status: status_ };
                // view request
                const job_request = yield JobRequestModel_1.default.paginate(clause);
                return job_request;
            }
            catch (error) {
                res.status(500).send((0, error_1.sendError)(error));
                return null;
            }
        });
        this.toggle_request_proposals = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                // get user
                const user = yield (0, methods_1.getUser)(req);
                if (user == null) {
                    res.status(400).send((0, error_1.sendError)("Authentication failed, please login again"));
                    return null;
                }
                const job_req_slug = req.params.slug;
                let { status } = req.body;
                status = parseInt(status);
                // verify if the job belongs to the user
                let job_req = yield JobRequestModel_1.default.findOne({ where: { slug: job_req_slug }, include: [
                        {
                            model: UserModel_1.default, attributes: { exclude: ["password", "verification_code", "token"] }
                        },
                        {
                            model: JobModel_1.default, include: [{
                                    model: UserModel_1.default, attributes: { exclude: ["password", "verification_code", "token"] }
                                }]
                        }
                    ] });
                if (job_req == null) {
                    res.status(404).send((0, error_1.sendError)("This job request doen't exist"));
                    return null;
                }
                if (job_req.dataValues.Job.dataValues.User.id != user.id) {
                    res.status(400).send((0, error_1.sendError)("Unauthorized to perform this action"));
                    return null;
                }
                // toggle job request
                // if toggle == accept
                const job = job_req.dataValues.Job;
                if (status == JobRequestInterface_1.JobRequestStatus.ACCEPT) {
                    if (!job.active) {
                        res.status(404).send((0, error_1.sendError)("The current job request has been assigned to a user already"));
                        return null;
                    }
                    // update job to false
                    yield job.update({ active: false });
                    // auto-reject all requests and add inapp notification
                    let rejected_emails = [];
                    JobRequestModel_1.default.findAll({
                        include: [
                            {
                                model: UserModel_1.default, attributes: { exclude: ["password", "verification_code", "token"] }
                            },
                            {
                                model: JobModel_1.default,
                                where: { slug: job.slug },
                                include: [{
                                        model: UserModel_1.default, attributes: { exclude: ["password", "verification_code", "token"] }
                                    }]
                            }
                        ]
                    }).then((job_requests) => {
                        job_requests.forEach((job_request) => {
                            if (job_request.id != job_req.dataValues.id) {
                                // escaping the user that got accepted
                                if (job_request.dataValues.User.emai != job_req.User.email) {
                                    rejected_emails.push(job_request.dataValues.User.email);
                                    job_request.update({ status: JobRequestInterface_1.JobRequestStatus.REJECTED });
                                    this.emailService.send({
                                        from: env_1.EMAIL_USERNAME, to: job_request.dataValues.User.email,
                                        text: `Dear ${job_request.dataValues.User.fullname} <br> we are sorry to inform you that your job application <b>${job_request.dataValues.Job.title}</b> was rejected.
                                    <br>Ther are more jobs on our platform, we are sure you'll find your ideal job soon.
                                    <br>Best regards`,
                                        subject: "Job Application Update"
                                    });
                                    this.notificationService.add_notification({
                                        from: "Last Minute Job", user: job_request.dataValues.User,
                                        title: `Job Application Update`,
                                        type: NotificationInterface_1.NOTIFICATION_TYPE.JOB_REJECT_NOTIFICATION,
                                        content: `Your job application ${job_request.dataValues.Job.title} was rejected`
                                    });
                                }
                            }
                        });
                    }).finally(() => {
                        // disbuse rejection email
                        // rejected_emails.forEach((rejected_email:string) => {
                        // forward in app rejection and email rejection
                        // updating the exact jpb request
                        // job_req.update({status})
                        // })
                    });
                }
                let accepted_job_req = yield job_req.update({ status });
                // disbuse acceptance email and in app notification to the owner of the request
                this.emailService.send({
                    from: env_1.EMAIL_USERNAME, to: job_req.dataValues.User.email,
                    text: status == JobRequestInterface_1.JobRequestStatus.ACCEPT ? `Dear ${job_req.dataValues.User.fullname} 
                <br>We are glad to inform you that your job application has been accepted
                <br>Ensure you do a wonderful job
                <br>Best Regards`
                        :
                            `Dear ${job_req.dataValues.User.fullname} 
                <br> we are sorry to inform you that your job application <b>${job_req.dataValues.Job.title}</b> was rejected.
                <br>There are more jobs on our platform, we are sure you'll find your ideal job soon.
                <br>Best regards`,
                    subject: "Job Application Update"
                });
                this.notificationService.add_notification({
                    from: "Last Minute Job", user: job_req.dataValues.User,
                    title: `Job Application Update`,
                    type: NotificationInterface_1.NOTIFICATION_TYPE.JOB_REJECT_NOTIFICATION,
                    content: status == JobRequestInterface_1.JobRequestStatus.ACCEPT ? `Your job application ${job_req.dataValues.Job.title} was accepted` : `Your job application ${job_req.dataValues.Job.title} was rejected`
                });
                return accepted_job_req;
            }
            catch (error) {
                res.status(500).send((0, error_1.sendError)(error));
                return null;
            }
        });
        // public submit_accepted_job_request_for_review = async (req:Request, res:Response) => {
        //     try {
        //           // get user
        //           const user = await getUser(req)
        //           if (user == null) {
        //               res.send(sendError("Authentication failed, please login again"))
        //               return null
        //           }
        //           const job_req_slug = req.params.slug
        //         // finding the job request
        //         let job_req:any = await JobRequest.findOne({where:{slug:job_req_slug, status:JobRequestStatus.ACCEPT}, include:[
        //             // the applicant
        //             { 
        //                 model: User, attributes:{exclude:["password", "verification_code", "token"]}
        //             },
        //             {
        //                 // job and owner of the job
        //                 model: Job, include:[{
        //                     model: User, attributes:{exclude:["password", "verification_code", "token"]}
        //                 }]
        //             }
        //         ]})
        //         if (job_req == null) {
        //             res.send(sendError("This job hasn't been assigned to a last minute app user"))
        //             return null
        //         }
        //         // check if the job was assigned to me
        //         if (job_req.User.id !=  user.id) {
        //             res.send(sendError("Unauthorized for this action, job wasn't assigned to you"))
        //             return null
        //         }
        //         // update the job
        //         await job_req.update({status:JobRequestStatus.COMPLETED_PENDING})
        //         // forward email and in-app notification
        //         let job:Job = job_req.Job;
        //         let job_owner:User =  job.dataValues.User, {email} = job_owner;
        //         // parallel operations
        //         this.notificationService.add_notification({
        //             from: "Last Minute Job", user: job_req.dataValues.User,
        //             title: `Ongoing Job Update`,
        //             type: NOTIFICATION_TYPE.JOB_REJECT_NOTIFICATION,
        //             content:  `${user.fullname} has submitted your job for review`
        //         })
        //         this.emailService.send({
        //             from: EMAIL_USERNAME, to: email,
        //             text: `Dear ${job_owner["fullname"].split(" ")[0]} <br> your on-going job '${job.title}' has been submitted for review. kindly review the submission`,
        //             subject: "Job Submission"
        //         })
        //         return await JobRequest.findOne({where:{slug:job_req_slug}, include:[
        //             // the applicant
        //             { 
        //                 model: User, attributes:{exclude:["password", "verification_code", "token"]}
        //             },
        //             {
        //                 // job and owner of the job
        //                 model: Job, include:[{
        //                     model: User, attributes:{exclude:["password", "verification_code", "token"]}
        //                 }]
        //             }
        //         ]})
        //     } catch (error:any) {
        //         res.send(sendError(error))
        //         return null
        //     }
        // }
        // public toggle_accepted_job_request_for_review = async (req:Request, res:Response) => {
        //     try {
        //         // get user
        //         const user = await getUser(req)
        //         if (user == null) {
        //             res.send(sendError("Authentication failed, please login again"))
        //             return null
        //         }
        //         const job_req_slug = req.params.slug
        //         let {status} = req.body;
        //         if (!status) {
        //             res.send(sendError("Please provide a status for this action"))
        //             return null
        //         }
        //         status  = parseInt(status as string);
        //         // verify if the job belongs to the user
        //         let job_req:any = await JobRequest.findOne({where:{slug:job_req_slug, status:JobRequestStatus.COMPLETED_PENDING}, include:[
        //             { 
        //                 model: User, attributes:{exclude:["password", "verification_code", "token"]}
        //             },
        //             {
        //                 model: Job, include:[{
        //                     model: User, attributes:{exclude:["password", "verification_code", "token"]}
        //                 }]
        //             }
        //         ]})
        //         if (job_req == null) {
        //             res.send(sendError("This job hasn't been submitted for review yet"))
        //             return null
        //         }
        //         if (job_req.dataValues.Job.dataValues.User.id != user.id) {
        //             res.send(sendError("Unauthorized to perform this action"))
        //             return null
        //         }
        //         let worker:User = job_req.User, {email} = worker,
        //             job:Job = job_req.Job;
        //         if (status == JobRequestStatus.COMPLETED) {
        //             await job_req.update({status, completed:true})
        //              // parallel operations
        //             this.notificationService.add_notification({
        //                 from: "Last Minute Job", user: job_req.dataValues.User,
        //                 title: `Job Submission Update`,
        //                 type: NOTIFICATION_TYPE.JOB_REJECT_NOTIFICATION,
        //                 content:  `${worker.fullname} your job has been marked as completed`
        //             })
        //             this.emailService.send({
        //                 from: EMAIL_USERNAME, to: email,
        //                 text: `Dear ${worker["fullname"].split(" ")[0]} <br> congratulations '${job.title}' has been approved, keep the good work on `,
        //                 subject: "Job Accepted"
        //             })
        //             // process stripe payment
        //             return await this.stripeService.disburse_payment({
        //                 amount: job.price,
        //                 from: user,
        //                 to: worker,
        //                 narration: `Payment fot ${job.title}`,
        //                 charges: getCharges(job.price)
        //             })
        //         } else if (status == JobRequestStatus.COMPLETED_REJECTED) {
        //             await job_req.update({status})
        //              // parallel operations
        //              this.notificationService.add_notification({
        //                 from: "Last Minute Job", user: job_req.dataValues.User,
        //                 title: `Job Submission Update`,
        //                 type: NOTIFICATION_TYPE.JOB_REJECT_NOTIFICATION,
        //                 content:  `${worker.fullname} your job was rejected, we will appreciate you try as much as possible to improve the service provided`
        //             })
        //             this.emailService.send({
        //                 from: EMAIL_USERNAME, to: email,
        //                 text: `Dear ${worker["fullname"].split(" ")[0]} <br> Unfortunately '${job.title}' has been rejected, try as much as possible to improve the service provided `,
        //                 subject: "Job Rejected"
        //             })
        //             return job_req
        //         } else {
        //             res.send(sendError("You either can accept or reject this submission"))
        //             return null
        //         }
        //     } catch (error:any) {
        //         res.send(sendError(error))
        //         return null
        //     }
        // }
    }
}
exports.JobRequestService = JobRequestService;
