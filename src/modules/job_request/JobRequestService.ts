import { Request, Response } from "express";
import { sendError } from "../../helper/error";
import Job from "../job/JobModel";
import User from "../user/UserModel";
import { generateRandomNumber, generateReferralCode, getCharges, getUser } from "../../helper/methods";
import JobRequest from "./JobRequestModel";
import slugify from "slugify";
import { log } from "console";
import { Op, where } from "sequelize";
import { JobRequestStatus } from "./JobRequestInterface";
import { NotificationService } from "../notification/NotificationService";
import { MailService } from "../mailer/MailService";
import { EMAIL_USERNAME } from "../../config/env";
import { NOTIFICATION_TYPE } from "../notification/NotificationInterface";
import { StripeService } from "../../third-party/stripe-payment/StripeService";

export class JobRequestService {

    private notificationService = new NotificationService()
    private emailService = new MailService()
    private stripeService = new StripeService()

    public create_request = async (req:Request, res:Response) => {
        try {

            // get the current user
            const user = await getUser(req)

            if (user == null) {
                res.send(sendError("Authentication failed, please login again"))
                return null
            }

            // fetch the job
            const {slug} = req.params
            let job = await Job.findOne({where:{slug}, include:[{model:User, attributes:{exclude:["password", "verification_code", "token"]}}]})
            if (!job) {
                res.send(sendError("This job no longer exist"))
                return null
            }

            // check if you are not the owner of the job
            if (job.dataValues.User.id == user.id) {
                res.send(sendError("You can not apply to a job you posted"))
                return null
            }

            // check if job is active
            if (!job.active) {
                res.send(sendError("This job no longer taking application"))
                return null
            }
            
            // check if you haven't applied before
            let my_job_request = await JobRequest.findOne({
                include: [
                    {
                        model:User,
                        attributes: {exclude:["password", "verification_code", "token"]},
                        where:{id:user.id}
                    },
                    {
                        model: Job,
                        where:{slug},
                        include: [{
                            model:User,
                            attributes: {exclude:["password", "verification_code", "token"]},
                        }]
                    }
                ]
            })

            if (my_job_request) {console.log("Already applied"); return my_job_request;}

            // apply for job
            let job_req_slug = slugify((generateReferralCode()), {lower:true})
            let my_job_application:any = await JobRequest.create({slug:job_req_slug})
            await my_job_application.setUser(user.id)
            await my_job_application.setJob(job.id)

            // forward email and inapp notification to job owner
            // parallel operations

            this.notificationService.add_notification({
                from: "Last Minute Job", user: job.dataValues.User,
                title: `Job Application Update`,
                type: NOTIFICATION_TYPE.JOB_REJECT_NOTIFICATION,
                content:  `${user.fullname} Just applied for your job, kindly review in the app`
            })

            this.emailService.send({
                from: EMAIL_USERNAME, to: job.dataValues.User.email,
                text: `Dear ${job.dataValues.User["fullname"].split(" ")[0]} <br> ${user["fullname"]} just sent a proposal regarding your job`,
                subject: "Job Application"
            })

            return await JobRequest.findOne({where:{slug:job_req_slug}, include: [
                {
                    model:User,
                    attributes: {exclude:["password", "verification_code", "token"]},
                },
                {
                    model: Job,
                    include: [{
                        model:User,
                        attributes: {exclude:["password", "verification_code", "token"]},
                    }]
                }
            ]})
            
        } catch (error:any) {
            res.send(sendError(error))
            return null
        }
    }

    public open_request = async (req:Request, res:Response) => {
        try {
            
            // get the current user
            const user = await getUser(req)

            if (user == null) {
                res.send(sendError("Authentication failed, please login again"))
                return null
            }

            const {slug} = req.params

            // view request
            const job_request = await JobRequest.findOne({where:{slug}, include:[{model:Job, include: [{model:User, attributes:{exclude:["password", "verification_code", "token"]}}]}]})

            if (!job_request) {
                res.send(sendError("The request you are trying to open doen't exist"))
                return null
            }
            
            return job_request
            
        } catch (error:any) {
            res.send(sendError(error))
            return null
        }
    }

    public list_my_request_proposals = async (req:Request, res:Response) => {
        try {

            // get the current user
            const user = await getUser(req)

            if (user == null) {
                res.send(sendError("Authentication failed, please login again"))
                return null
            }

            const {email} = req.params

            if (email != user.email) {
                res.send(sendError("Unauthorized for this action, please use your email"))
                return null
            }

            let {
                page, limit, desc, q, status
            } = req.query

            let page_ = page ? parseInt(page as string) : 1;
            let limit_ = limit ? parseInt(limit as string) : 10
            let desc_ = desc ? parseInt(desc as string) : 1
            let q_ = q ? q : ""
            let status_ = status ? status : ""

            let clause:any = {
                page:page_, paginate:limit_,
                order:[['id', desc_ == 1 ? "DESC" : "ASC"]],
                include:[
                    {
                        model:User, attributes:{exclude:["password", "verification_code", "token"]},
                        include:[]
                    },
                    {model:Job, where:{
                        [Op.or]: [
                            // { title: { [Op.like]: `%${q_}%` } },
                            { description: { [Op.like]: `%${q_}%` } },
                          ]
                    }, include: [{model:User, where:{email}, attributes:{exclude:["password", "verification_code", "token"]}}]}
                ]
            }

            if (status_) clause.where = {status:status_}
            // view request
            const job_request = await (<any>JobRequest).paginate(clause)

            return job_request
            
        } catch (error:any) {
            res.send(sendError(error))
            return null
        }
    }

    public list_my_job_request = async (req:Request, res:Response) => {
        try {

            // get the current user
            const user = await getUser(req)

            if (user == null) {
                res.send(sendError("Authentication failed, please login again"))
                return null
            }

            const {email} = req.params

            if (email != user.email) {
                res.send(sendError("Unauthorized for this action, please use your email"))
                return null
            }

            let {
                page, limit, desc, q, status
            } = req.query

            let page_ = page ? parseInt(page as string) : 1;
            let limit_ = limit ? parseInt(limit as string) : 10
            let desc_ = desc ? parseInt(desc as string) : 1
            let q_ = q ? q : ""
            let status_ = status ? status : ""

            let clause:any = {
                page:page_, paginate:limit_,
                order:[['id', desc_ == 1 ? "DESC" : "ASC"]],
                include:[
                    {
                        model:User, where:{email}, attributes:{exclude:["password", "verification_code", "token"]},
                        include:[]
                    },
                    {model:Job, where:{
                        [Op.or]: [
                            // { title: { [Op.like]: `%${q_}%` } },
                            { description: { [Op.like]: `%${q_}%` } },
                          ]
                    }, include: [{model:User, attributes:{exclude:["password", "verification_code", "token"]}}]}
                ]
            }

            if (status_) clause["where"] = {status:status_}

            // view request
            const job_request = await (<any>JobRequest).paginate(clause)

            return job_request
            
        } catch (error:any) {
            res.send(sendError(error))
            return null
        }
    }

    public toggle_request_proposals = async (req:Request, res:Response) => {
        try {

            // get user
            const user = await getUser(req)

            if (user == null) {
                res.send(sendError("Authentication failed, please login again"))
                return null
            }

            const job_req_slug = req.params.slug
            
            let {status} = req.body;
            status  = parseInt(status as string);
            // verify if the job belongs to the user
            let job_req:any = await JobRequest.findOne({where:{slug:job_req_slug}, include:[
                { 
                    model: User, attributes:{exclude:["password", "verification_code", "token"]}
                },
                {
                    model: Job, include:[{
                        model: User, attributes:{exclude:["password", "verification_code", "token"]}
                    }]
                }
            ]})

            if (job_req == null) {
                res.send(sendError("This job request doen't exist"))
                return null
            }

            if (job_req.dataValues.Job.dataValues.User.id != user.id) {
                res.send(sendError("Unauthorized to perform this action"))
                return null
            }

            // toggle job request
            
            // if toggle == accept
            const job:Job = job_req.dataValues.Job
            if (status == JobRequestStatus.ACCEPT) {
                if (!job.active) {
                    res.send(sendError("The current job request has been assigned to a user already"))
                    return null
                } 
                // update job to false
                await job.update({active:false})
                // auto-reject all requests and add inapp notification
                let rejected_emails:Array<string> = []
                JobRequest.findAll({
                    include:[
                        {
                            model: User, attributes:{exclude:["password", "verification_code", "token"]}
                        },
                        {
                            model: Job, 
                            where:{slug:job.slug},
                            include:[{
                                model: User, attributes:{exclude:["password", "verification_code", "token"]}
                            }]
                        }
                    ]
                }).then((job_requests:JobRequest[]) => {
                    job_requests.forEach((job_request:JobRequest) => {
                        if (job_request.id != job_req.dataValues.id) {
                            // escaping the user that got accepted
                            if (job_request.dataValues.User.emai != job_req.User.email) {
                                rejected_emails.push(job_request.dataValues.User.email)
                                job_request.update({status:JobRequestStatus.REJECTED})
                                this.emailService.send({
                                    from: EMAIL_USERNAME, to: job_request.dataValues.User.email,
                                    text: `Dear ${job_request.dataValues.User.fullname} <br> we are sorry to inform you that your job application <b>${job_request.dataValues.Job.title}</b> was rejected.
                                    <br>Ther are more jobs on our platform, we are sure you'll find your ideal job soon.
                                    <br>Best regards`,
                                    subject: "Job Application Update"
                                })
                                this.notificationService.add_notification({
                                    from: "Last Minute Job", user: job_request.dataValues.User,
                                    title: `Job Application Update`,
                                    type: NOTIFICATION_TYPE.JOB_REJECT_NOTIFICATION,
                                    content: `Your job application ${job_request.dataValues.Job.title} was rejected`
                                })
                            }
                        }
                    })
                }).finally(() => {
                    // disbuse rejection email
                    // rejected_emails.forEach((rejected_email:string) => {
                        // forward in app rejection and email rejection
                        // updating the exact jpb request
                        // job_req.update({status})
                    // })
                })
            }
           
            let accepted_job_req = await job_req.update({status})

            // disbuse acceptance email and in app notification to the owner of the request
            this.emailService.send({
                from: EMAIL_USERNAME, to: job_req.dataValues.User.email,
                text: status == JobRequestStatus.ACCEPT ? `Dear ${job_req.dataValues.User.fullname} 
                <br>We are glad to inform you that your job application has been accepted
                <br>Ensure you do a wonderful job
                <br>Best Regards` 
                    : 
                `Dear ${job_req.dataValues.User.fullname} 
                <br> we are sorry to inform you that your job application <b>${job_req.dataValues.Job.title}</b> was rejected.
                <br>There are more jobs on our platform, we are sure you'll find your ideal job soon.
                <br>Best regards`,
                subject: "Job Application Update"
            })
            this.notificationService.add_notification({
                from: "Last Minute Job", user: job_req.dataValues.User,
                title: `Job Application Update`,
                type: NOTIFICATION_TYPE.JOB_REJECT_NOTIFICATION,
                content:  status == JobRequestStatus.ACCEPT ? `Your job application ${job_req.dataValues.Job.title} was accepted` : `Your job application ${job_req.dataValues.Job.title} was rejected`
            })

            return accepted_job_req

        } catch (error:any) {
            res.send(sendError(error))
            return null
        }
    }

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