import { MailInterface } from "./MailInterface";
import { MailService } from "./MailService";

export class MailController {

    private mailService:MailService;

    constructor () {
        this.mailService = new MailService()
    }

    public async send (options:MailInterface) {
        return await this.mailService.send(options);
    }

}