import { EMAIL_PASSWORD, EMAIL_SERVICE, EMAIL_USERNAME, SMTP_HOST, SMTP_PORT } from "../../config/env";
import { MailInterface } from "./MailInterface";
import nodemailer from "nodemailer"

export class MailService {

    private transporter;

    constructor () {
        this.transporter = nodemailer.createTransport({
           host: SMTP_HOST,
           port: 465,
           secure: true,
           auth: {
            user: EMAIL_USERNAME,
            pass: EMAIL_PASSWORD
           }
        });
        // this.transporter = nodemailer.createTransport({
        //     host: SMTP_HOST,
        //     port: 465,
        //     secure: true, 
        //     tls: {
        //      rejectUnauthorized: false, 
        //      ciphers: 'HIGH:!SSLv2:!aNULL:!eNULL:!IDEA:!LOW:!MD5:!PSK:!RC4:!SEED:!3DES:!SRP:!EXP:!FALLBACK_SCSV' // Supported ciphers
        //     },
        //     auth: {
        //      user: EMAIL_USERNAME,
        //      pass: EMAIL_PASSWORD 
        //     }
        //  }); 
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
 
    public async send (options:MailInterface) {
        return await this.transporter.sendMail(options)
    }
}
