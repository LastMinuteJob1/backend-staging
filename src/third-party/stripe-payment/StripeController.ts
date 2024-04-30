import { StripeService } from "./StripeService"

export class StripeController {

    private _stripeService = new StripeService();

    public verify_payment = async (ref:string) => {
        return await this._stripeService.verify_payment(ref);
    }

}