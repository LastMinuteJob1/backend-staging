import User from "../../modules/user/UserModel";

export interface IPayment {
    amount: number,
    from: User,
    to: User,
    narration: string,
    charges: number,
}