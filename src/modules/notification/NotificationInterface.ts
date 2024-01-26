import User from "../user/UserModel";

export enum NOTIFICATION_TYPE {
    JOB_POST_NOTIFICATION = 0,
    JOB_REQUEST_NOTIFICATION = 1,
    JOB_REJECT_NOTIFICATION = 2,
    JOB_ACCEPT_NOTIFICATION = 3
}

export interface Notification {
    title:string,
    type:number,
    content:string,
    from:string,
    user: User
}