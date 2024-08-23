import { Request, Response } from "express"
import { sendError } from "../../helper/error"
import { generateReferralCode, getUser, hashPassword } from "../../helper/methods"
import User from "../user/UserModel"
import Profile from "./ProfileModel"
import { log } from "console"
import { IUserAccountStatus } from "../user/UserInterface"
import { StorageService } from "../../../storage/StorageService"
import StripeCustomer from "../../third-party/stripe-payment/StripeCustomerModel"
import Job from "../job/JobModel"

export class ProfileService {

    private storageService = new StorageService("profile-uploads")

    public openProfile = async(req:Request, res:Response) => {
        try {

            let user = await getUser(req),
                uid = await User.findOne({where:{email:user.email}, include:[{
                    model: Profile
                }, {
                    model: StripeCustomer
                }],
                attributes:{exclude:["password", "verification_code"]}})

            if (!uid) {
                res.status(400).send(sendError("Unfortunately something went wrong"));
                return null;
            }

            const jobs:number = await Job.count({
                include: [
                    {
                        model: User, where: {
                            id: uid.id
                        }
                    }
                ]
            });

            return {
                "User": uid, "Job": {
                    count: jobs
                }
            }
            
        } catch (error:any) {
            res.status(500).send(sendError(error));
            return null
        }
    }
    public viewProfile = async(req:Request, res:Response) => {
        try {

            let user = await getUser(req),
                uid = await User.findOne({where:{email:user.email}, include:[{
                    model: Profile
                }, {
                    model: StripeCustomer
                }],
                attributes:{exclude:["password", "verification_code"]}})

            if (!uid) {
                res.status(400).send(sendError("Unfortunately something went wrong"));
                return null;
            }

            return uid;
            
        } catch (error:any) {
            res.status(500).send(sendError(error));
            return null
        }
    }

    public addProfile = async (req: Request, res: Response) => {
        try {
            
            let user = await this.viewProfile(req, res)

            if (!user) {
                res.status(400).send(sendError("Unfortunately something went wrong"));
                return null;
            }

            let profile = user["dataValues"]["Profile"];

            let data = req.body;

            let referal_code = generateReferralCode()

            let {
                job_title, job_description, years_of_experience,
                certifications, other_jobs, description,
                other_info, prove_of_location, 
            } = data;

            if (!profile) {

                let new_profile = await Profile.create({
                    job_title, job_description, years_of_experience,
                    certifications, other_jobs, description,
                    other_info, prove_of_location, referal_code
                })
                if (!new_profile) {
                    res.status(500).send(sendError("Unable to create profile"));
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
                referal_code = profile.referal_code || generateReferralCode(); 

                await profile.update({
                    job_title, job_description, years_of_experience,
                    certifications, other_jobs, description,
                    other_info, referal_code
                })

            }

            return await this.viewProfile(req, res);

        } catch (error:any) {
            res.status(500).send(sendError(error));
            return null
        }
    }
    public upload = async (req: any, res: Response) => {
        try {

            log(">>>>>>>>>>>>>>>>>>>>>>>>UPLOAD>>>>>>>>>>>>>>>>>>>>>>>>")

            const file = req.file,  {filename} = file;

            let {type} = req.body;

            log({body:req.body}, {type})

            if (type != "pics" && type != "prove" && type != "kyc") {
                res.status(409).send(sendError("upload type must either be 'pics' or 'prove'"));
                return null;
            }

            let {status, data} = await this.storageService.uploadPicture(file, filename);
                console.log({data});
                if (!status) {
                    log("Error uploading");
                }
                let file_name = data?.Location;

            let data_ = type == "kyc" ? {
                kyc_docs:file_name
            } : type == "pics" ? {
                profile_pics:file_name
            } : {
                prove_of_location:file_name
            };

            let user = await getUser(req), email = user.email;
            let new_user:any = await User.findOne({where:{email}, include:[{model:Profile}]});

            let profile:Profile = new_user["Profile"];

            if (!profile) {
                profile = await Profile.create();
                await new_user.setProfile(profile);
            }

            await profile.update(data_);

            return await this.viewProfile(req, res);

        } catch (err:any) {
            res.status(500).send(sendError(err));
            log(err)
            return null
        }
    }
    public update_username_and_password = async (req: any, res: Response) => {
        try {

            let user = await this.viewProfile(req, res)

            if (!user) {
                res.status(400).send(sendError("Unfortunately something went wrong"));
                return null;
            }

            let {fullname, password} = req.body;

            await user.update({
                fullname:  fullname ? fullname : user.fullname,
                password: password ? hashPassword(password) : user.password
            }); 

            return user;

        } catch (err:any) {
            res.status(500).send(sendError(err));
            log(err)
            return null
        }
    }
    public deactivate_or_delete_account = async (req: any, res: Response) => {
        try {

            let user = await this.viewProfile(req, res)

            if (!user) {
                res.status(400).send(sendError("Unfortunately something went wrong"));
                return null;
            }

            let {status, reason} = req.body;

            if (status != IUserAccountStatus.ACTIVE && status != IUserAccountStatus.IN_ACTIVE) {
                res.status(400).send(sendError("You can only de-activate or activate account"));
                return null;
            }

            await user.update({active:status, reason:reason||""});

            return user; 

        } catch (err:any) {
            res.status(500).send(sendError(err));
            log(err)
            return null
        }
    }
}
