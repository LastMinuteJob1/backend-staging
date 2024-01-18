import { NextFunction, Request, Response } from "express";
import { AppError } from "./error";
import { userSchema } from "./schema";

export const ErrorWatcher = (err: any, req: Request, res: Response, next: (err?: any) => void) => {
    if (err instanceof AppError) {
      res.status(err.statusCode).json({ message: err.message });
    } else {
      // Handle other errors (e.g., log and send generic error response)
    }
  }

export function signup_middleware (req:Request, res:Response, next: NextFunction) {
  const { error } = userSchema.validate(req.body);
  if (error) res.status(400).json({ error: error.details });
  else next()
}