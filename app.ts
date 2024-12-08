import express from 'express';
import bodyParser from 'body-parser';
import userRouter from './src/modules/user/UserRoute';
import { ACCESS_KEY, APP_VERSION,EMAIL_PASSWORD,EMAIL_USERNAME,JWT_SECRET_KEY,/*, EMAIL_PASSWORD, EMAIL_SERVICE, EMAIL_USERNAME*/ 
SECRET_KEY,
STRIPE_SECRET_KEY,
SUPER_ADMIN_PWD,
SUPER_ADMIN_UID} from './src/config/env';
import User from './src/modules/user/UserModel';
import sequelize from './src/config/db';
import { MailController } from './src/modules/mailer/MailController';
import jobRoute from './src/modules/job/JobRoute';
import Job from './src/modules/job/JobModel';
import notificationRoute from './src/modules/notification/NotificationRoute';
import NotificationModel from './src/modules/notification/NotificationModel';
import jobRequestRoute from './src/modules/job_request/JobRequestRoute';
import JobRequest from './src/modules/job_request/JobRequestModel';
import profileRoute from './src/modules/profile/ProfileRoute';
import Profile from './src/modules/profile/ProfileModel';
import { log } from 'console';
import JobPics from './src/modules/job/JobPics';
import path from 'path';
import storageRoute from './storage/StorageRoute';
import StripePayment from './src/third-party/stripe-payment/StripeModel';
import walletRoute from './src/modules/wallet/WalletRoute';
import Wallet from './src/modules/wallet/WalletModel';
import TransactionHistory from './src/modules/wallet/TransactionHistoryModel';
import webHookRoute from './src/third-party/webhook/WebhookRoute';
import { StripeService } from './src/third-party/stripe-payment/StripeService';
import { MailService } from './src/modules/mailer/MailService';
import adminDashboardRoute from './src/modules/admin/AdminDashboardRoute';
import StripeCustomer from './src/third-party/stripe-payment/StripeCustomerModel';
import Withdrawal from './src/modules/wallet/Withdrawal';
import { hashPassword } from './src/helper/methods';
import geofencingRoute from './src/third-party/geofencing/geofencing-route';
import { Socket } from 'socket.io';
import Interac from './src/modules/interac/interac-model';
import InteracPayment from './src/modules/interac/interac-payment-model';
import interacRoute from './src/modules/interac/interac-route';
import Admin from './src/modules/admin/onboarding/admin-model';
import adminRoute from './src/modules/admin/onboarding/admin-route';
import AdminLink from './src/modules/admin/onboarding/admin-link-model';
// import { initializeApp } from "firebase-admin/app"
// import { JobRequestStatus } from './src/modules/job_request/JobRequestInterface';

const app = express();
const port: any = process.env.PORT || 3000;

let mailController:MailController;

const server = require('http').createServer(app);

// socket io
const io = require('socket.io')(server, {
    cors: {
        origin: "*"
    }
});

// Body parser middleware
// app.use(express.json());
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: false }));

// mounting routes 
app.use("/user", userRouter)
app.use("/profile", profileRoute)
app.use("/job", jobRoute)
app.use("/notification", notificationRoute)
app.use("/job-request", jobRequestRoute) 
app.use("/storage", storageRoute) 
app.use("/wallet", walletRoute) 
app.use("/webhook", webHookRoute) 
app.use("/admin-dashboard", adminDashboardRoute)
app.use("/admin", adminRoute)
app.use("/geofencing", geofencingRoute)
app.use("/interac", interacRoute)

sequelize.sync({alter:false, force:false}) 
.then(async () => {    
    // await JobRequest.drop(); 
    console.log('Connection to database established successfully.\n');
    // syncing models 
    await User.sync()
    await Job.sync()
    await JobPics.sync()
    
    await NotificationModel.sync()
    await JobRequest.sync()
 
    await Profile.sync()
 
    await StripePayment.sync();
    await StripeCustomer.sync();

    await Wallet.sync(); 
    await TransactionHistory.sync();
    await Withdrawal.sync();

    await Interac.sync();
    await InteracPayment.sync();

    await Admin.sync()
    await AdminLink.sync();
 
    User.hasMany(Job) 
    Job.belongsTo(User) 

    // await JobRequest.update({status: JobRequestStatus.ACCEPT}, {where:{id:1}});
    // Job.findAll().then(async (job:any) => console.log(job))
    // await Admin.destroy({where: {id: 3}});
    console.log("Synced Models") 
    if (!await Admin.findOne({where: {username: SUPER_ADMIN_UID}})) {
        log("Creating new admin");
        await Admin.create({
            password: await hashPassword(SUPER_ADMIN_PWD),
            username: SUPER_ADMIN_UID,
            email: "admin@lastminutejob.ca",
            roles: ["superadmin"]
        })
    }
    // preparing mailing service 
    // await User.destroy({where: {email: "olasojidami9@gmail.com"}})
    mailController = new MailController()
    console.log("Email service ready"); 

    server.listen(port, async () => {

        console.log(`Server listening on port ${port} - App version ${APP_VERSION}`);

        // log("*****************Registering Webhook**********************")
        // log(await new StripeService().register_webhook()); 

        // new MailService().send({
        //     from: EMAIL_USERNAME,
        //     to: 'chibuezeadeyemi@gmail.com',
        //     subject: 'Testing',
        //     html: "Jilo Billionaire - From LMJ backend"
        // });

        // for (var i = 0; i < 100; i ++)
        //     Wallet.update({balance: 50000}, {where:{id:i}}) 

        // log({EMAIL_USERNAME, EMAIL_PASSWORD})

        async function get_all_jobs () {
            let all_jobs = await (<any> Job).paginate({
                    page:1, paginate:25,
                    order:[['id', "DESC"]],
                    where:{
                        active: true,
                        published: true
                    },
                    include: [
                        {
                            model: JobPics
                        },{
                        model: User, attributes:{exclude:["password", "verification_code", "token"]},
                        include: [
                            {
                                model: Profile
                            }
                        ]
                    }] 
                });

                return all_jobs
        }

        setInterval(async () => {
            io.emit("jobs", await get_all_jobs())
            log(`Every 60 seconds heart-beat ${new Date().toISOString()}`);
        }, 1000 * 60)

        log("Attempting websocket connection")
        io.on("connection", async (socket: Socket) => {
            try {

                const all_jobs = await get_all_jobs()
                io.emit("jobs", all_jobs)
                log("=======Socket Connected=======")

            } catch (e) {
                log("Internal Socket Error:", e)
            }
        })

    }); 
    
})
.catch((error) => console.error('Unable to connect to the database:', error))
.finally(async () => { }); 

const storage_path = path.join(__dirname + "/storage")
// const firebase_app_instance = initializeApp();
export { mailController, storage_path, /*firebase_app_instance*/ }    