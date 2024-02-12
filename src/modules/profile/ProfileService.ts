import { Request, Response } from "express"
import { sendError } from "../../helper/error"
import { getUser } from "../../helper/methods"
import User from "../user/UserModel"
import Profile from "./ProfileModel"

export class ProfileService {
    public viewProfile = async(req:Request, res:Response) => {
        try {

            let user = await getUser(req),
                uid = User.findOne({where:{email:user.email}, include:[{
                    model: Profile
                }],
                attributes:{exclude:["password", "verification_code"]}})

            return uid;
            
        } catch (error:any) {
            res.send(sendError(error))
            return null
        }
    }
    public addProfile = async (req: Request, res: Response) => {
        try {
            
            let user = await this.viewProfile(req, res)

            if (!user) {
                res.send(sendError("Unfortunately something went wrong"))
                return;
            }

            let profile = user["dataValues"]["Profile"];

            let data = req.body;

            let {
                job_title, job_description, years_of_experience,
                certifications, other_jobs, description,
                other_info
            } = data;

            if (!profile) {

                let new_profile = await Profile.create({
                    job_title, job_description, years_of_experience,
                    certifications, other_jobs, description,
                    other_info
                })
                if (!new_profile) {
                    res.send(sendError("Unable to create profile"))
                    return null
                }

                await (<any>new_profile).setUser(user)

            } else {

                job_title = job_title || profile.job_title;
                job_description = job_description || profile.job_description;
                years_of_experience = years_of_experience || profile.years_of_experience;
                certifications = certifications || profile.certifications;
                other_jobs = other_jobs || profile.other_jobs;
                description = description || profile.description;
                other_info = other_info || profile.other_info

                await profile.update({
                    job_title, job_description, years_of_experience,
                    certifications, other_jobs, description,
                    other_info
                })

            }

            return await this.viewProfile(req, res);

        } catch (error:any) {
            res.send(sendError(error))
            return null
        }
    }
}