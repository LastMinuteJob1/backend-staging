import { EMAIL_PASSWORD, EMAIL_SERVICE, EMAIL_USERNAME, SMTP_HOST, SMTP_PORT } from "../../config/env";
import { MailInterface } from "./MailInterface";
import nodemailer from "nodemailer"

export class MailService {

    private transporter;

    constructor() {
        // this.transporter = nodemailer.createTransport({
        //    host: SMTP_HOST,
        //    port: 465,//587,
        //    secure: true,
        //    auth: {
        //     user: EMAIL_USERNAME, 
        //     pass: EMAIL_PASSWORD
        //    }
        // });
        this.transporter = nodemailer.createTransport((<any> {
            host: SMTP_HOST,
            port: SMTP_PORT,
            secure: true,
            auth: {
                user: EMAIL_USERNAME,
                pass: EMAIL_PASSWORD
            }
        }));
        // this.transporter = nodemailer.createTransport(
        // {
        //     service: "Gmail",
        //     host: "smtp.gmail.com",
        //     port: 465,
        //     secure: true,
        //     auth: {
        //         user: EMAIL_USERNAME,
        //         pass: EMAIL_PASSWORD
        //     }
        // }
        // );
    }

    public async send(options: MailInterface) {
        return await this.transporter.sendMail(options)
    }
}
