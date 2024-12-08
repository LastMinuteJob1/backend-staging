import { NextFunction, Request, Response } from "express";
import { AppError, sendError } from "./error";
import { jobSchema, userSchema } from "./schema";
import { getAdmin, validateToken } from "./methods";
import User from "../modules/user/UserModel";
import { IUserAccountStatus } from "../modules/user/UserInterface";
import { log } from "console";
import { StripeService } from "../third-party/stripe-payment/StripeService";
import Admin from "../modules/admin/onboarding/admin-model";
import { verify2FAToken } from "./2FA";

export const ErrorWatcher = (err: any, req: Request, res: Response, next: (err?: any) => void) => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ message: err.message });
  } else {
    // Handle other errors (e.g., log and send generic error response)
  }
}

export function signup_middleware(req: Request, res: Response, next: NextFunction) {
  const { error } = userSchema.validate(req.body);
  let err = (<any>error)
  log(err)
  if (error) { res.status(400).json(sendError(err["details"][0]["message"])); return }
  else next()
}

export function job_creation_middleware(req: Request, res: Response, next: NextFunction) {
  const { error } = jobSchema.validate(req.body);
  let err = (<any>error)
  if (error) { res.status(400).json(sendError(err["details"][0]["message"])); return }
  else next()
}

export async function authorization(req: Request, res: Response, next: NextFunction) {
  //  jwt authorization and stack in user into request object
  const header = req.headers,
    token = header["authorization"]?.replace("Bearer ", "") || ""
  let decoded = await validateToken(token)
  console.log(decoded)
  if (decoded == null) {
    let err = sendError("Invalid authorization code", 401)
    res.status(401).send(err)
  } else {
    let user = await User.findOne({ where: { token } })
    if (user == null) {
      let err = sendError("No user with this Auth token", 401)
      res.status(401).send(err)
      return
    }
    if (!user.active) {
      let err = sendError("This account is no longer active", 401)
      res.status(401).send(err)
      return
    }
    req.headers["user"] = JSON.stringify(user)
    next()
  }
}

export async function authorization_admin(req: Request, res: Response, next: NextFunction) {
  //  jwt authorization and stack in user into request object
  const header = req.headers,
    token = header["authorization"]?.replace("Bearer ", "") || ""
  let decoded = await validateToken(token)
  console.log(decoded)
  if (decoded == null) {
    let err = sendError("Invalid authorization code", 401)
    res.status(401).send(err)
  } else {
    let user = await Admin.findOne({ where: { token } })
    if (user == null) {
      let err = sendError("No user with this Auth token", 401)
      res.status(401).send(err)
      return
    }
    if (!user.active) {
      let err = sendError("This account is no longer active", 401)
      res.status(401).send(err)
      return
    }
    req.headers["admin"] = JSON.stringify(user)
    next()
  }
}

export async function google_authorization(req: Request, res: Response, next: NextFunction) {
  let { otp } = req.body;
  let _admin = await getAdmin(req)
  log({ _admin })
  if (!await verify2FAToken(otp, _admin)) {
    let err = sendError("Incorrect token from Google Authenticator App", 401)
    res.status(401).send(err)
    return
  }
  next();
}

export async function superadmin_authorization(req: Request, res: Response, next: NextFunction) {

  let _admin = await getAdmin(req)
  
  if (_admin.roles[0] != "superadmin") {
    let err = sendError("You are not authorized to perform this operation", 401)
    res.status(401).send(err)
    return
  }
  next();
}

const stripeService = new StripeService()

export async function stripe_authorization(req: Request, res: Response, next: NextFunction) {

  const sig = req.headers['stripe-signature'];

  log({ sig })

  let event;

  try {

    event = await stripeService.get_payment_event(req.body, sig) //stripe.webhooks.constructEvent(request.body, sig, endpointSecret);

    log({ event })
    if (!event) {
      res.status(400).json(sendError(`Webhook Error:`));
      log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
      return;
    }

    log("++++++++++++++++++++++++++++++++++++++++++++++++")
    log("Stripe Log Event: ", event)
    log("++++++++++++++++++++++++++++++++++++++++++++++++")

    next();

  } catch (err: any) {
    log({ err })
    res.status(400).send(sendError(`Webhook Error: ${err.message}`));
  }

}