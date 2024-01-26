import { NextFunction, Request, Response } from "express";
import { AppError, sendError } from "./error";
import { jobSchema, userSchema } from "./schema";
import { validateToken } from "./methods";
import User from "../modules/user/UserModel";

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

export function job_creation_middleware (req:Request, res:Response, next: NextFunction) {
  const { error } = jobSchema.validate(req.body);
  if (error) res.status(400).json({ error: error.details });
  else next()
}

export async function authorization (req:Request, res:Response, next: NextFunction) {
  //  jwt authorization and stack in user into request object
  const header = req.headers,
        token = header["authorization"]?.replace("Bearer ", "") || ""
  let decoded = await validateToken(token)
  console.log(decoded)
  if (decoded == null) {
    let err = sendError("Invalid authorization code", 401)
    res.send(err)
  } else {
    let user = await User.findOne({where:{token}})
    if (user == null) {
      let err = sendError("No user with this Auth token", 401)
      res.send(err)
      return
    }
    req.headers["user"] = JSON.stringify(user)
    next()
  }
}