export interface SignupRequest {
    fullname:string,
    email:string,
    phone_number:string,
    address:string, 
    password:string,
    isGmail:boolean,
    token?: string
}