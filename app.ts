import express from 'express';
import bodyParser from 'body-parser';
import userRouter from './src/modules/user/UserRoute';
import { APP_VERSION, EMAIL_PASSWORD, EMAIL_SERVICE, EMAIL_USERNAME } from './src/config/env';
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

const app = express();
const port = 3000 || process.env.PORT;

let mailController:MailController;

// Body parser middleware
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: false }));

// mounting routes 
app.use("/user", userRouter)
app.use("/profile", profileRoute)
app.use("/job", jobRoute)
app.use("/notification", notificationRoute)
app.use("/job-request", jobRequestRoute)

// connecting to DB
sequelize.sync({alter:false, force:false}).then(async () => {    
    console.log('Connection to database established successfully.\n');
    // syncing models
    await User.sync()
    await Job.sync()
    await NotificationModel.sync()
    await JobRequest.sync()
    await Profile.sync()
    console.log("Synced Models") 
    // preparing mailing service
    mailController = new MailController()
    console.log("Email service ready");
    app.listen(port, () => console.log(`Server listening on port ${port} - App version ${APP_VERSION}`)); 
}).catch((error) => console.error('Unable to connect to the database:', error));
 
export {
    mailController 
}