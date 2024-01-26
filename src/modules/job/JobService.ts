import { AppError, sendError } from "../../helper/error"
import { Request, Response, request } from "express";
import { generateRandomNumber, getUser, hashPassword } from "../../helper/methods";
import Job from "./JobModel";
import User from "../user/UserModel";
import { BlobController } from "../../third-party/azure-blob-storage/BlobController";
import slugify from "slugify";
import { Op } from "sequelize";
import { NotificationController } from "../notification/NotificationController";
import { NOTIFICATION_TYPE } from "../notification/NotificationInterface";
export class JobService {

    private blobController = new BlobController()
    private notificationController = new NotificationController()
   
    public create_job = async (req:Request, res:Response) => {
        try {

            
            let {
                title, description, price,
                location, priority
            } = req.body

            // performing upload using azure-blob-storage third party

            let user:User = await getUser(req)

            if (!user) {
                res.send(sendError("Something went wrong, please login"))
                return null
            }

            let picx_url = await this.blobController.uploadFile(request)

            if (picx_url == null) {
                res.send(sendError("Unable to upload file, please retry"))
                return null
            }

            let slug = slugify(title + " " + generateRandomNumber(), { lower: true })

            const job:any = await Job.create({slug, title, description, price, location, priority_lvl:priority, picx_url})

            if (!job) {
                res.send(sendError("Error creating job"))
                return null
            }

            await job.setUser(user.id)
            await job.save()
            
            // job.user 

            // stack in an in-app notification
            this.notificationController.add_notification({
                from: "Last Minute Job", // sender
                title: "Job creation",
                type: NOTIFICATION_TYPE.JOB_POST_NOTIFICATION,
                content: `Hello ${user.fullname}, \nYour job '${title}' have been posted successfully, you will get feedback from our users in a couple of minutes. Stay tunned to the app`,
                user: user // receipant
            })

            return await Job.findOne({
                where:{slug},
                include: [{model: User, attributes: {exclude:["password", "verification_code", "token"]}}]
            })
            
        } catch (error:any) {
            res.send(sendError(error))
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
                title, description, price,
                location, priority
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
                include: [{
                    where:{id:user.id},
                    model: User, attributes: {exclude:["password", "verification_code", "token"]}
                }]
            })

            if (!job) {
                res.send(sendError("You can't update this job"))
                return null
            }

            await job.update({
                where:{slug},
                title: title || job.title,
                description: description || job.description,
                price: price || job.price,
                location: location || job.location,
                priority: priority || job.priority_lvl
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
                page, limit, desc, q
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

            // search query param
            let where = q_ == "" ? {} : {
                where:{
                    [Op.or]: [
                        { title: { [Op.like]: `%${q_}%` } },
                        { description: { [Op.like]: `%${q_}%` } },
                      ]
                }
            };

            //  pagination
            const {docs, pages, total} = await (<any> Job).paginate({
                page:page_, paginate:limit_,
                order:[['id', desc_ == 1 ? "DESC" : "ASC"]],
                ...where,
                include: [{
                    where: {email},
                    model: User, attributes:{exclude:["password", "verification_code", "token"]}
                }]
            })

            return {docs, pages, total}
            
        } catch (error:any) {
            res.send(sendError(error))
            return null
        }
    }

    public list_all_jobs = async (req:Request, res:Response) => {
        try {

            let {
                page, limit, desc, q
            } = req.query

            let page_ = page ? parseInt(page as string) : 1;
            let limit_ = limit ? parseInt(limit as string) : 10
            let desc_ = desc ? parseInt(desc as string) : 1
            let q_ = q ? q : ""
            //  pagination

            // results by job search
            const {docs, pages, total} = await (<any> Job).paginate({
                page:page_, paginate:limit_,
                order:[['id', desc_ == 1 ? "DESC" : "ASC"]],
                where:{
                    [Op.or]: [
                        { title: { [Op.like]: `%${q_}%` } },
                        { description: { [Op.like]: `%${q_}%` } },
                        { location: { [Op.like]: `%${q_}%` } },
                        { priority_lvl: { [Op.like]: `%${q_}%` } },
                        { createdAt: { [Op.like]: `%${q}%` } },
                    ],
                    // [Op.and]: [{active:true}]
                },
                include: [{
                    model: User, attributes:{exclude:["password", "verification_code", "token"]}
                }]
            })

            if (docs.length == 0) {
                // results by user search
                console.log("user search");
                
                const {docs_, pages_, total_} = await (<any> Job).paginate({
                    page:page_, paginate:limit_,
                    order:[['id', desc_ == 1 ? "DESC" : "ASC"]],
                    include: [{
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
            return null
        }
    }

}