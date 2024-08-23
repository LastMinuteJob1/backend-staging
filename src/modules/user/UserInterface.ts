export interface SignupRequest {
    fullname:string,
    email:string,
    phone_number?:string,
    address:string, 
    password:string,
    isGmail:boolean,
    token?: string,
    token_id?: string,
    pronoun:string, 
    city:string, 
    postal_code:number,
    dob: Date,
    province: string
}

export enum IUserAccountStatus {
    IN_ACTIVE = 'in-active', ACTIVE = 'active', DELETED = 'deleted'
}