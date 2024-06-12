import User from "../../modules/user/UserModel";

export interface IPushNotification {
    user: User,
    title: string,
    content: string,
    image?: string,
    icon?: string
}