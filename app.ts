import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import userRouter from './src/modules/user/UserRoute';
import { APP_VERSION, EMAIL_PASSWORD, EMAIL_SERVICE, EMAIL_USERNAME } from './src/config/env';
import User from './src/modules/user/UserModel';
import sequelize from './src/config/db';
import { MailController } from './src/modules/mailer/MailController';

const app = express();
const port = 3000 || process.env.PORT;

let mailController:MailController;

// Body parser middleware
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: false }));
// mounting routes 
app.use("/user", userRouter)

// connecting to DB
sequelize.authenticate().then(async () => {
    console.log('Connection to database established successfully.\n');
    // syncing models
    await User.sync()
    console.log("Synced Models")
    // preparing mailing service
    mailController = new MailController()
    console.log("Email service ready");
    // // testing email service
    // let res = await mailController.send({
    //     from: EMAIL_USERNAME,
    //     to: 'chibuezeadeyemi@gmail.com',
    //     subject: 'Test mail',
    //     text: 'Node.js testing mail for GeeksforGeeks'
    // })
    // console.log(res);
    app.listen(port, () => console.log(`Server listening on port ${port} - App version ${APP_VERSION}`)); 
}).catch((error) => console.error('Unable to connect to the database:', error));
 
export {
    mailController
}