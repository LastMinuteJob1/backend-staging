export interface IJobRequest {
    slug:string,
    status:number
}

export enum JobRequestStatus {
    REJECTED, ACCEPT, PENDING, COMPLETED_PENDING, COMPLETED
}