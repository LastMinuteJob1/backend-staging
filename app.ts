import express from 'express';
import bodyParser from 'body-parser';
import userRouter from './src/modules/user/UserRoute';
import { ACCESS_KEY, APP_VERSION,EMAIL_PASSWORD,EMAIL_USERNAME,JWT_SECRET_KEY,/*, EMAIL_PASSWORD, EMAIL_SERVICE, EMAIL_USERNAME*/ 
SECRET_KEY,
STRIPE_SECRET_KEY} from './src/config/env';
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
import adminDashboardRoute from './src/modules/admin-dashboard/AdminDashboardRoute';
import StripeCustomer from './src/third-party/stripe-payment/StripeCustomerModel';
import Withdrawal from './src/modules/wallet/Withdrawal';
import { hashPassword } from './src/helper/methods';
import geofencingRoute from './src/third-party/geofencing/geofencing-route';
// import { JobRequestStatus } from './src/modules/job_request/JobRequestInterface';

const app = express();
const port = 3000 || process.env.PORT;

let mailController:MailController;

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
app.use("/geofencing", geofencingRoute)

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
 
    User.hasMany(Job) 
    Job.belongsTo(User) 
 
    // await JobRequest.update({status: JobRequestStatus.ACCEPT}, {where:{id:1}});
    // Job.findAll().then(async (job:any) => console.log(job))
    console.log("Synced Models") 
    // preparing mailing service 
    mailController = new MailController()
    console.log("Email service ready"); 

    app.listen(port, async () => {

        console.log(`Server listening on port ${port} - App version ${APP_VERSION}`);

        // log("*****************Registering Webhook**********************")
        // log(await new StripeService().register_webhook()); 

        // new MailService().send({
        //     from: EMAIL_USERNAME,
        //     to: 'chibuezeadeyemi@gmail.com',
        //     subject: 'Testing',
        //     html: "Jilo Billionaire - From LMJ backend"
        // });

        // for (var i = 0; i < 4; i ++)
        //     Wallet.update({balance: 500}, {where:{id:i}}) 

        log({EMAIL_USERNAME, EMAIL_PASSWORD})

        setInterval(() => {
            log(`Every 60 seconds heart-beat ${new Date().toISOString()}`);
        }, 1000 * 60);

    }); 
    
})
.catch((error) => console.error('Unable to connect to the database:', error))
.finally(async () => { }); 

const storage_path = path.join(__dirname + "/storage")
export { mailController, storage_path }    