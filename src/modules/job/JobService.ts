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
export class JobService {

    private blobController = new BlobController()
    private notificationController = new NotificationController()
   
    public create_job = async (req:Request, res:Response) => {
        try {

            
            let { 
                description, price,
                location, date, ad_type, time, 
            } = req.body

            log(req.body)

            // performing upload using azure-blob-storage third party

            let user:User = await getUser(req)

            if (!user) {
                res.send(sendError("Something went wrong, please login"))
                return null
            }

            let slug = slugify(description.substring(0, 10) + " " + generateRandomNumber(), { lower: true })

            let obj = {
                slug, description, price, 
                job_location:location, job_date:date, type:ad_type, job_time:time,
            }
            // log({obj})
            const job:any = await Job.create(obj)

            if (!job) {
                res.send(sendError("Error creating job"))
                return null
            }

            await job.setUser(user.id)
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

            return await Job.findOne({
                where:{slug},
                include: [{model: User, attributes: {exclude:["password", "verification_code", "token"]}}]
            })
            
        } catch (error:any) {
            res.send(sendError(error))
            log({error})
            return null
        }
    } 

    public view_job = async (req:Request, res:Response) => {
        try {

            let {slug} = req.params

            const job = await Job.findOne({
                where:{slug},
                include: [{model: User, attributes: {exclude:["password", "verification_code", "token"]}}]
            })

            if (job == null) {
                res.send(sendError("Job not found"))
                return null
            }

            return job
            
        } catch (error:any) {
            res.send(sendError(error))
            return null
        }
    }

    public update_job = async (req:Request, res:Response) => {
        try {

            let {
                description, price,
                location, type, date, time
            } = req.body

            let {slug} = req.params

            let user:User = await getUser(req)

            if (!user) {
                res.send(sendError("Something went wrong, please login"))
                return null
            }

            // include in the where clause where current user is the owner of the job
            let job = await Job.findOne({
                where:{slug},
                include: [
                    {
                        where:{id:user.id},
                        model: User, attributes: {exclude:["password", "verification_code", "token"]}
                    },
                    {
                        model: JobPics
                    }
                ]
            })

            if (!job) {
                res.send(sendError("You can't update this job"))
                return null
            }

            await job.update({
                where:{slug},
                // title: title || job.title,
                description: description || job.description,
                price: price || job.price,
                location: location || job.job_location,
                job_location:location || job.job_location, 
                job_date:date || job.job_date, 
                type:type || job.type, 
                job_time:time || job.job_time,
                // priority: priority || job.priority_lvl
            })

            return await this.view_job(req, res)
            
        } catch (error:any) {
            res.send(sendError(error))
            return null
        }
    }

    public delete_job = async (req:Request, res:Response) => {
        try {

            let {slug} = req.params

            let user:User = await getUser(req)

            if (!user) {
                res.send(sendError("Something went wrong, please login"))
                return null
            }

            // include in the where clause where current user is the owner of the job
            let job = await Job.findOne({
                where:{slug},
                include: [{
                    where:{id:user.id},
                    model: User, attributes: {exclude:["password", "verification_code", "token"]}
                }]
            })

            if (!job) {
                res.send(sendError("You can not delete this job"))
                return null
            }

            return await job.destroy()
            
        } catch (error:any) {
            res.send(sendError(error))
            return null
        }
    }

    public list_my_jobs = async (req:Request, res:Response) => {
        try {

            let {
                page, limit, desc, q, type, published
            } = req.query

            const {email} = req.params 

            const user = User.findOne({
                where: {email}
            })

            if (!user) {
                res.send(sendError(`user with email ${email} does not exist`))
                return null
            }

            let page_ = page ? parseInt(page as string) : 1;
            let limit_ = limit ? parseInt(limit as string) : 10
            let desc_ = desc ? parseInt(desc as string) : 1
            let q_ = q ? q : ""
            let type_ = type ? type : ""
            let pb_ = published ? published : "";

            let published_ = pb_ == "true" ? true : false;

            console.log({published_});
            
            // search query param
            let where = q_ == "" ? {
                    where:{published:published_}
            } : {
                where:{
                    [Op.and]: [
                        {published:published_},
                        { description: { [Op.like]: `%${q_}%` } }
                    ]
                }
            };

            if (type_ != "") 
                return await (<any> Job).paginate({
                    page:page_, paginate:limit_,
                    order:[['id', desc_ == 1 ? "DESC" : "ASC"]],
                    where:{[Op.and]: [{type: type_}, {published:published_}]},
                    include: [
                        {
                            model: JobPics
                        },{
                        where: {email},
                        model: User, attributes:{exclude:["password", "verification_code", "token"]}
                    }]
                });

            //  pagination
            const {docs, pages, total} = await (<any> Job).paginate({
                page:page_, paginate:limit_,
                order:[['id', desc_ == 1 ? "DESC" : "ASC"]],
                ...where,
                include: [
                    {
                        model: JobPics
                    },{
                    where: {email},
                    model: User, attributes:{exclude:["password", "verification_code", "token"]}
                }]
            })

            return {docs, pages, total}
            
        } catch (error:any) {
            res.send(sendError(error))
            log({error})
            return null
        }
    }

    public list_all_jobs = async (req:Request, res:Response) => {
        try {

            let {
                page, limit, desc, q, type
            } = req.query 

            let page_ = page ? parseInt(page as string) : 1;
            let limit_ = limit ? parseInt(limit as string) : 10
            let desc_ = desc ? parseInt(desc as string) : 1
            let q_ = q ? q : ""
            let type_ = type ? type : ""
            //  pagination

            log({type_})
            if (type_ != "") 
                return await (<any> Job).paginate({
                    page:page_, paginate:limit_,
                    order:[['id', desc_ == 1 ? "DESC" : "ASC"]],
                    where:{type: type_, published:true},
                    include: [
                        {
                            model: JobPics
                        },{
                        model: User, attributes:{exclude:["password", "verification_code", "token"]}
                    }]
                });


            // results by job search
            const {docs, pages, total} = await (<any> Job).paginate({
                page:page_, paginate:limit_,
                order:[['id', desc_ == 1 ? "DESC" : "ASC"]],
                where:{
                    [Op.or]: [
                        { description: { [Op.like]: `%${q_}%` } },
                        { job_location: { [Op.like]: `%${q_}%` } },
                    ],
                    published:true
                },
                include: [
                    {
                        model: JobPics
                    },{
                    model: User, attributes:{exclude:["password", "verification_code", "token"]}
                }]
            })

            if (docs.length == 0) {
                // results by user search
                console.log("user search");
                
                const {docs_, pages_, total_} = await (<any> Job).paginate({
                    page:page_, paginate:limit_,
                    order:[['id', desc_ == 1 ? "DESC" : "ASC"]],
                    where: {published:true},
                    include: [
                        {
                            model: JobPics
                        },{
                        where: {
                            [Op.or]: [
                                { fullname: { [Op.like]: `%${q_}%` } },
                                { email: { [Op.like]: `%${q_}%` } },
                            ]
                        },
                        model: User, attributes:{exclude:["password", "verification_code", "token"]}
                    }]
                })
                return {docs_, pages_, total_}
            }  
            
            return {docs, pages, total}
             
        } catch (error:any) {
            res.send(sendError(error))
            log({error})
            return null
        }
    }

    public upload_pics = async (req:Request, res:Response) => {
        try {

            res.send("Under maintainace")
            
        } catch (error:any) {
            res.send(sendError(error))
            log({error})
            return null
        }
    }

    public publish = async (req:Request, res:Response) => {
        try {

            let slug  = req.params.slug,
                job = await Job.findOne({where:{slug}});

            if (!job) {
                res.send(sendError("Unable to find job"))
                return null
            }

            await job.update({published:true})

            return job;
            
        } catch (error:any) {
            res.send(sendError(error))
            log({error})
            return null
        }
    }

}