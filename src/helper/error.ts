export class AppError extends Error {
    statusCode: number;
  
    constructor(public message: string, statusCode: number = 500) {
      super(message);
      this.statusCode = statusCode;
    }
}

export function sendError(message:string, status:any = 500) {
  // setTimeout(() => {throw new AppError(message)}, 500)
  return {
    message, result:[], status
  }
}