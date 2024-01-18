export interface MailInterface {
    from: string,
    to: string,
    subject: string,
    html?: string
    text?:string
}