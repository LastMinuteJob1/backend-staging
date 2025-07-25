import { AppError, sendError } from "../../helper/error"
import { Request, Response, request } from "express";
import { generateRandomNumber, getUser, hashPassword } from "../../helper/methods";
import Job from "./JobModel";
import User from "../user/UserModel";
import { BlobController } from "../../third-party/azure-blob-storage/BlobController";
import slugify from "slugify";
import { Op, where } from "sequelize";
import { NotificationController } from "../notification/NotificationController";
import { NOTIFICATION_TYPE } from "../notification/NotificationInterface";
import { log } from "console";
import JobPics from "./JobPics";
import JobRequest from "../job_request/JobRequestModel";
import { JobRequestStatus } from "../job_request/JobRequestInterface";
import { EMAIL_USERNAME } from "../../config/env";
import { NotificationService } from "../notification/NotificationService";
import { MailService } from "../mailer/MailService";
import { StorageService } from "../../../storage/StorageService";
import fs from "fs";
import { StripeService } from "../../third-party/stripe-payment/StripeService";
import StripePayment from "../../third-party/stripe-payment/StripeModel";
import Profile from "../profile/ProfileModel";
import Wallet from "../wallet/WalletModel";
import TransactionHistory from "../wallet/TransactionHistoryModel";

export class JobService {

    // private blobController = new BlobController()
    private notificationController = new NotificationController()
    private notificationService = new NotificationService();
    private storageService = new StorageService("job-pics");
    private emailService = new MailService();
    private stripeService = new StripeService();

    public create_job = async (req: Request, res: Response) => {
        try {


            let {
                description, price,
                location, date, pricing, time,
            } = req.body

            log(req.body)

            // performing upload using azure-blob-storage third party

            let user: User = await getUser(req)

            if (!user) {
                res.status(400).send(sendError("Something went wrong, please login"));
                return null
            }

            // check for kyc verification
            let _user = await User.findOne({
                where: { email: user.email }, include: [{
                    model: Profile
                }],
                attributes: { exclude: ["password", "verification_code"] }
            });

            if (!_user) {
                res.status(403).send(sendError("Something went wrong, please login"));
                return null
            }

            // let { Profile } = user;
            let profile = (<any> _user)["Profile"];

            const { is_kyc_verified, prove_of_location, kyc_docs } = profile;

            if (!is_kyc_verified) {
                res.status(401).send(sendError(`Your KYC status is still pending, kindly upload or verify the following documents 'Prove of location' and 'National ID'`));
                return null
            }

            // const profile: Profile = _user["Profile"];

            let slug = slugify(description.substring(0, 10) + " " + generateRandomNumber(), { lower: true })

            let obj = {
                slug, description, price,
                job_location: location, job_date: date, pricing, job_time: time,
            }
            // log({obj})
            const job: any = await Job.create(obj)

            if (!job) {
                res.status(400).send(sendError("Error creating job"));
                return null
            }

            await job.setUser(user.id)
            // await job.save()

            // job.user 

            // stack in an in-app notification
            this.notificationController.add_notification({
                from: "Last Minute Job", // sender
                title: "Job creation",
                type: NOTIFICATION_TYPE.JOB_POST_NOTIFICATION,
                content: `Hello ${user.fullname}, \nYour job have been posted successfully, kindly proceed to the next step.`,
                user: user // receipant
            })

            return await Job.findOne({
                where: { slug },
                include: [
                    { model: User, attributes: { exclude: ["password", "verification_code", "token"] } },
                    { model: JobPics }
                ]
            })

        } catch (error: any) {
            res.status(500).send(sendError(error));
            log({ error })
            return null
        }
    }

    public view_job = async (req: Request, res: Response) => {
        try {

            let { slug } = req.params

            const job = await Job.findOne({
                where: { slug },
                include: [
                    { model: User, include: [
                        { model: Profile }
                    ], attributes: { exclude: ["password", "verification_code", "token"] } },
                    { model: JobPics }
                ]
            })

            if (job == null) {
                res.status(404).send(sendError("Job not found"));
                return null
            }

            return job

        } catch (error: any) {
            res.status(500).send(sendError(error));
            return null
        }
    }

    public update_job = async (req: Request, res: Response) => {
        try {

            let {
                description, price, pricing,
                location, type, date, time
            } = req.body

            let { slug } = req.params

            let user: User = await getUser(req)

            if (!user) {
                res.status(400).send(sendError("Something went wrong, please login"));
                return null
            }

            // include in the where clause where current user is the owner of the job
            let job = await Job.findOne({
                where: { slug },
                include: [
                    {
                        where: { id: user.id },
                        model: User, attributes: { exclude: ["password", "verification_code", "token"] }
                    },
                    {
                        model: JobPics
                    }
                ]
            })

            if (!job) {
                res.status(400).send(sendError("You can't update this job"));
                return null
            }

            await job.update({
                where: { slug },
                // title: title || job.title,
                description: description || job.description,
                price: price || job.price,
                location: location || job.job_location,
                job_location: location || job.job_location,
                job_date: date || job.job_date,
                // type:type || job.type, 
                pricing: pricing || job.pricing,
                job_time: time || job.job_time,
                // priority: priority || job.priority_lvl
            })

            return await this.view_job(req, res)

        } catch (error: any) {
            res.status(500).send(sendError(error));
            return null
        }
    }

    public delete_job = async (req: Request, res: Response) => {
        try {

            let { slug } = req.params

            let user: User = await getUser(req)

            if (!user) {
                res.status(400).send(sendError("Something went wrong, please login"));
                return null
            }

            // include in the where clause where current user is the owner of the job
            let job = await Job.findOne({
                where: { slug },
                include: [{
                    where: { id: user.id },
                    model: User, attributes: { exclude: ["password", "verification_code", "token"] }
                }]
            })

            if (!job) {
                res.status(400).send(sendError("You can not delete this job"));
                return null
            }

            return await job.destroy()

        } catch (error: any) {
            res.status(500).send(sendError(error));
            return null
        }
    }

    public list_my_jobs = async (req: Request, res: Response) => {
        try {

            let {
                page, limit, desc, q, type, published, from_date, to_date, time
            } = req.query

            const { email } = req.params

            const user = User.findOne({
                where: { email }
            })

            if (!user) {
                res.status(400).send(sendError(`user with email ${email} does not exist`));
                return null
            }

            let page_ = page ? parseInt(page as string) : 1;
            let limit_ = limit ? parseInt(limit as string) : 10
            let desc_ = desc ? parseInt(desc as string) : 1
            let q_ = q ? q : ""
            let type_ = type ? type : ""
            let pb_ = published ? published : "";

            let published_ = pb_ == "true" ? true : false;

            console.log({ published_ });

            // list by date
            if (from_date) {

                let from_date_ = new Date(from_date as string);
                let to_date_ = to_date ? new Date(to_date as string) : new Date();
                to_date_.setDate(to_date_.getDate() + 1);

                log(">>>>>>>>>>>>>>>>>>>>>>>>Filtering by date>>>>>>>>>>>>>>>>>>>>>>");

                return await (<any>Job).paginate({
                    page: page_, paginate: limit_,
                    order: [['id', desc_ == 1 ? "DESC" : "ASC"]],
                    where: {
                        createdAt: {
                            [Op.between]: [from_date_, to_date_]
                        },
                        published: published_,
                    },
                    include: [
                        {
                            model: JobPics
                        }, {
                            where: { email },
                            model: User, attributes: { exclude: ["password", "verification_code", "token"] }
                        }]
                });

            }

            // // list by time
            // if (time) return await (<any> Job).paginate({
            //     page:page_, paginate:limit_,
            //     order:[['id', desc_ == 1 ? "DESC" : "ASC"]],
            //     where:{
            //         // job_time: {Op["like"]:``}
            //     },
            //     include: [
            //         {
            //             model: JobPics
            //         },{
            //         where: {email},
            //         model: User, attributes:{exclude:["password", "verification_code", "token"]}
            //     }] 
            // });


            // search query param
            let where = q_ == "" ? {
                where: { published: published_ }
            } : {
                where: {
                    [Op.and]: [
                        { published: published_ },
                        { description: { [Op.like]: `%${q_}%` } }
                    ]
                }
            };

            if (type_ != "")
                return await (<any>Job).paginate({
                    page: page_, paginate: limit_,
                    order: [['id', desc_ == 1 ? "DESC" : "ASC"]],
                    where: { [Op.and]: [{ type: type_ }, { published: published_ }] },
                    include: [
                        {
                            model: JobPics
                        }, {
                            where: { email },
                            model: User, attributes: { exclude: ["password", "verification_code", "token"] }
                        }]
                });

            //  pagination
            const { docs, pages, total } = await (<any>Job).paginate({
                page: page_, paginate: limit_,
                order: [['id', desc_ == 1 ? "DESC" : "ASC"]],
                ...where,
                include: [
                    {
                        model: JobPics
                    }, {
                        where: { email },
                        model: User, attributes: { exclude: ["password", "verification_code", "token"] }
                    }]
            })

            return { docs, pages, total }

        } catch (error: any) {
            res.status(500).send(sendError(error));
            log({ error })
            return null
        }
    }

    public list_all_jobs = async (req: Request, res: Response) => {
        try {

            let {
                page, limit, desc, q, type, from_date,
                to_date, job_date, job_time, from_price, to_price,
            } = req.query

            let page_ = page ? parseInt(page as string) : 1;
            let limit_ = limit ? parseInt(limit as string) : 10
            let desc_ = desc ? parseInt(desc as string) : 1
            let q_ = q ? q : ""
            let type_ = type ? type : ""
            //  pagination

            if (from_price && to_price) {
                log("<<<-----------------Filtering by price--------------->>>");
                return await (<any>Job).paginate({
                    page: page_, paginate: limit_,
                    order: [['id', desc_ == 1 ? "DESC" : "ASC"]],
                    where: {
                        active: true,
                        price: {
                            [Op.between]: [(parseFloat(from_price as string) - 0.00001), parseFloat(to_price as string)]
                        },
                        published: true
                    },
                    include: [
                        {
                            model: JobPics
                        }, {
                            model: User, attributes: { exclude: ["password", "verification_code", "token"] },
                            include: [
                                {
                                    model: Profile
                                }
                            ]
                        }]
                });
            }

            if (job_date) {

                log(">>>>>>>>>>>>>>>>>>Job Date>>>>>>>>>>>>>>>>>>>>")

                return await (<any>Job).paginate({
                    page: page_, paginate: limit_,
                    order: [['id', desc_ == 1 ? "DESC" : "ASC"]],
                    where: {
                        active: true,
                        job_date: { [Op.like]: `%${job_date}%` },
                        published: true
                    },
                    include: [
                        {
                            model: JobPics
                        }, {
                            model: User, attributes: { exclude: ["password", "verification_code", "token"], },
                            include: [
                                {
                                    model: Profile
                                }
                            ]
                        }]
                });

            }

            if (job_time) {

                log(">>>>>>>>>>>>>>>>>>Job Time>>>>>>>>>>>>>>>>>>>>")

                return await (<any>Job).paginate({
                    page: page_, paginate: limit_,
                    order: [['id', desc_ == 1 ? "DESC" : "ASC"]],
                    where: {
                        active: true,
                        job_time: { [Op.like]: `%${job_time}%` },
                        published: true
                    },
                    include: [
                        {
                            model: JobPics
                        }, {
                            model: User, attributes: { exclude: ["password", "verification_code", "token"] },
                            include: [
                                {
                                    model: Profile
                                }
                            ]
                        }]
                });

            }

            if (from_date) {

                let from_date_ = new Date(from_date as string);
                let to_date_ = to_date ? new Date(to_date as string) : new Date();
                to_date_.setDate(to_date_.getDate() + 1);

                log(">>>>>>>>>>>>>>>>>>>>>>>>Filtering by date>>>>>>>>>>>>>>>>>>>>>>");

                return await (<any>Job).paginate({
                    page: page_, paginate: limit_,
                    order: [['id', desc_ == 1 ? "DESC" : "ASC"]],
                    where: {
                        active: true,
                        createdAt: {
                            [Op.between]: [from_date_, to_date_]
                        },
                        published: true
                    },
                    include: [
                        {
                            model: JobPics
                        }, {
                            model: User, attributes: { exclude: ["password", "verification_code", "token"] },
                            include: [
                                {
                                    model: Profile
                                }
                            ]
                        }]
                });

            }

            log({ type_ })
            if (type_ != "")
                return await (<any>Job).paginate({
                    page: page_, paginate: limit_,
                    order: [['id', desc_ == 1 ? "DESC" : "ASC"]],
                    where: { active: true, published: true },
                    include: [
                        {
                            model: JobPics
                        }, {
                            model: User, attributes: { exclude: ["password", "verification_code", "token"] },
                            include: [
                                {
                                    model: Profile
                                }
                            ]
                        }]
                });


            // results by job search
            log("----------------------Searchng by location and description------------------")
            const { docs, pages, total } = await (<any>Job).paginate({
                page: page_, paginate: limit_,
                order: [['id', desc_ == 1 ? "DESC" : "ASC"]],
                where: {
                    active: true,
                    [Op.or]: [
                        { description: { [Op.like]: `%${q_}%` } },
                        { job_location: { [Op.like]: `%${q_}%` } },
                    ],
                    published: true
                },
                include: [
                    {
                        model: JobPics
                    }, {
                        model: User, attributes: { exclude: ["password", "verification_code", "token"] },
                        include: [
                            {
                                model: Profile
                            }
                        ]
                    }]
            })

            if (docs.length == 0) {
                // results by user search
                console.log("user search");

                const { docs_, pages_, total_ } = await (<any>Job).paginate({
                    page: page_, paginate: limit_,
                    order: [['id', desc_ == 1 ? "DESC" : "ASC"]],
                    where: { published: true },
                    include: [
                        {
                            model: JobPics
                        },
                        {
                            where: {
                                active: true,
                                [Op.or]: [
                                    { fullname: { [Op.like]: `%${q_}%` } },
                                    { email: { [Op.like]: `%${q_}%` } },
                                ]
                            },
                            model: User, attributes: { exclude: ["password", "verification_code", "token"] },
                            include: [
                                {
                                    model: Profile
                                }
                            ]
                        }
                    ]
                })
                return { docs_, pages_, total_ }
            }

            return { docs, pages, total }

        } catch (error: any) {
            res.status(500).send(sendError(error));
            log({ error })
            return null
        }
    }

    public upload_pics = async (req: any, res: Response) => {
        try {

            // res.send("Under maintainace");

            let { slug } = req.params

            log("upload", req.files)

            let job = await Job.findOne({
                where: { slug },
                include: [
                    { model: User, attributes: { exclude: ["password", "verification_code", "token"] } },
                    { model: JobPics }
                ]
            })

            if (!job) {
                res.status(400).send(sendError("Unable to find job"));
                return null;
            }

            let { files } = req;

            for (let file of files) {
                let { filename } = file;
                // get signed URL
                // let url = await this.storageService.signedUploadURL(filename);
                // upload pics
                log({ type: typeof file, file });
                let { status, data } = await this.storageService.uploadPicture(file, filename);
                console.log({ data });
                if (!status) {
                    log("Error uploading");
                    continue;
                }
                let file_name = data?.Location;
                log(file_name)
                let pics = await JobPics.create({ url: file_name });
                await (<any>pics).setJob(job);
            }

            return await Job.findOne({
                where: { slug },
                include: [
                    { model: User, attributes: { exclude: ["password", "verification_code", "token"] } },
                    { model: JobPics }
                ]
            }) //09033248346

        } catch (error: any) {
            res.status(500).send(sendError(error));
            log({ error })
            return null
        }
    }

    public delete_job_pics = async (req: Request, res: Response) => {
        try {

            let { id } = req.query;

            return await JobPics.destroy({ where: { id } });

        } catch (error: any) {
            res.status(500).send(sendError(error));
            log({ error })
            return null
        }
    }

    public publish = async (req: Request, res: Response) => {
        try {

            let slug = req.params.slug,
                job = await Job.findOne({ where: { slug } });

            let user: User = await getUser(req)


            if (!job) {
                res.status(404).send(sendError("Unable to find job"));
                return null
            }

            // *************************************
            // comment this part after live
            await job.update({ paid: true })
            // *************************************

            if (!job.paid) {
                res.status(402).send(sendError("You have to publish pay for this job, before publishing"));
                return null;
            }

            await job.update({ published: true })

            this.notificationController.add_notification({
                from: "Last Minute Job", // sender
                title: "Job Published",
                type: NOTIFICATION_TYPE.JOB_POST_NOTIFICATION,
                content: `Your job is live now! you will get response from our able users`,
                user: user // receipant
            })

            return job;

        } catch (error: any) {
            res.status(500).send(sendError(error));
            log({ error })
            return null
        }
    }

    public ongoing_job = async (req: Request, res: Response) => {
        try {

            let {
                page, limit, desc, q, status //,type, from_date, to_date, job_date, job_time
            } = req.query

            let page_ = page ? parseInt(page as string) : 1;
            let limit_ = limit ? parseInt(limit as string) : 10
            let desc_ = desc ? parseInt(desc as string) : 1
            let q_ = q ? q : ""
            let status_ = status ? status : JobRequestStatus.ACCEPT;
            // let type_ = type ? type : ""

            let user: User = await getUser(req)

            if (!user) {
                res.status(400).send(sendError("Something went wrong, please login"));
                return null
            }

            return await (<any>Job).paginate({
                page: page_, paginate: limit_,
                order: [['id', desc_ == 1 ? "DESC" : "ASC"]],
                where: { published: true, description: { [Op.like]: `%${q_}%` } },
                include: [
                    { model: JobPics },
                    { model: JobRequest, where: { status: status_ }, include: [{ model: User, attributes: { exclude: ["password", "verification_code", "token"] } }] },
                    {
                        where: {
                            [Op.or]: [
                                { fullname: { [Op.like]: `%${q_}%` } },
                                { email: { [Op.like]: `%${q_}%` } },
                            ]
                        },
                        model: User, attributes: { exclude: ["password", "verification_code", "token"] }
                    }]
            });

        } catch (error: any) {
            res.status(500).send(sendError(error));
            log({ error })
            return null
        }
    }

    public submit_job = async (req: Request, res: Response) => {
        try {

            let { slug } = req.params;

            // find the job

            let job = await Job.findOne({
                where: { slug },
                include: [
                    { model: User, attributes: { exclude: ["password", "verification_code", "token"] } },
                    { model: JobRequest, include: [{ model: User, attributes: { exclude: ["password", "verification_code", "token"] } }], where: { status: JobRequestStatus.ACCEPT } }
                ]
            })

            if (!job) {
                res.status(409).send(sendError("Unable to submit this job"));
                return null;
            }

            // check if user owns the job

            let user: User = await getUser(req)

            if (!user) {
                res.status(409).send(sendError("Something went wrong, please login"));
                return null
            }

            // extract the request
            let requests: JobRequest[] = (<any>job)["JobRequests"];
            for (let job_request of requests) {
                // update the request
                await (<JobRequest>job_request).update({ status: JobRequestStatus.COMPLETED });
                // notifiy the user
                let user: User = (<any>job_request)["User"];
                let { email } = user;
                log({ email, user });
                this.emailService.send({
                    from: EMAIL_USERNAME, to: email,
                    text: `Dear ${user.fullname} 
                    <br> Your job have successfuly been accepted, you'll receive your fund as soon at it's been approved
                    <br>Best regards`,
                    subject: "Job Application Update"
                })
                this.notificationService.add_notification({
                    from: "Last Minute Job", user: user,
                    title: `Job Application Update`,
                    type: NOTIFICATION_TYPE.JOB_COMPLETE_NOTIFICATION,
                    content: `Congratulations on completing your job`
                })
                // initiate the transaction
            }

            // return the job
            return job;

        } catch (error: any) {
            res.status(500).send(sendError(error));
            log({ error })
            return null
        }
    }

    public verify_transaction = async (req: Request, res: Response) => {
        try {

            let { slug } = req.params;

            let { ref, platform } = req.body;

            let user = await getUser(req);

            if (!user) {
                res.status(400).send(sendError("Something went wrong, please login"));
                return null
            }

            let job = await Job.findOne({
                where: { slug },
            });

            if (!job) {
                res.status(404).send(sendError("Unable to find job"));
                return null;
            }

            if (job.paid) {
                res.status(400).send(sendError("This job has already been paid for"));
                return null;
            }

            if (platform == "stripe") {

                let data = await this.stripeService.verify_payment(ref);

                log({ data })

                if (data.hasOwnProperty("err")) {
                    log(">>>>>>>>>>>>>TRANSACTION ERROR>>>>>>>>>>>")
                    return data;
                }

                let { amount, currency } = data;

                if (currency.toLowerCase() != "cad") {
                    res.status(402).send(sendError("Payment are only to be made in CAD"));
                    return null;
                }

                if ((job.price) > parseFloat(amount.toString())) {
                    res.status(402).send(sendError(`You have paid ${(job.price) - parseFloat(currency)}USD lower than the price of the job`));
                    return null;
                }

                if (await StripePayment.findOne({ where: { ref } })) {
                    res.status(402).send(sendError(`Duplicate transaction detected`));
                    return null;
                }

                let stripe = await StripePayment.create({
                    ref, data
                });

                if (!stripe) {
                    res.status(500).send(sendError(`Error creating transaction history`));
                    return null;
                }

                await (<any>stripe).setJob(job)

                await job.update({ paid: true });

                this.notificationController.add_notification({
                    from: "Last Minute Job", // sender
                    title: "Payment Successful",
                    type: NOTIFICATION_TYPE.JOB_POST_NOTIFICATION,
                    content: `You payment of C$${amount} is successful`,
                    user: user // receipant
                })

                return job

            } else {

                // wallet pay

                // pin verification

                let { id } = user;

                let wallet = await Wallet.findOne({
                    include: [
                        { model: User, where: { id }, attributes: ["id"] }
                    ]
                });

                if (!wallet) {
                    res.status(402).send(sendError(`Insufficient balance`));
                    return null;
                }

                if (wallet["balance"] < job.price) {
                    res.status(402).send(sendError(`Insufficient balance`));
                    return null;
                }

                await wallet.update({ balance: (wallet.balance - job.price) })

                let history = await TransactionHistory.create({
                    amount: (job.price * -1), data: job
                });

                await (<any>history).setWallet(wallet);

                await job.update({ paid: true });

                this.notificationController.add_notification({
                    from: "Last Minute Job", // sender
                    title: "Job creation",
                    type: NOTIFICATION_TYPE.JOB_POST_NOTIFICATION,
                    content: `Your payment of C$${job.price} is successful`,
                    user: user // receipant
                })

                return job;

            }

        } catch (error: any) {
            res.status(500).send(sendError(error));
            log({ error })
            return null
        }
    }

}