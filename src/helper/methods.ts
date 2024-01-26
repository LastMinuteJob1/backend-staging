import { JWT_SECRET_KEY } from "../config/env";
import User from "../modules/user/UserModel";
import { responseInterface } from "./Interfaces";
import { JWTToken } from "./authorization";
import { AppError } from "./error";
import { Request, Response } from "express";

const crypto = require('crypto');

export function sendResponse (data:any, message:string = "OK", status:number = 200) : responseInterface {
    return {
        message, result:data, status
    }
}

const jwt = new JWTToken('HS256', JWT_SECRET_KEY, '1h');

export async function generateToken (user:any) {
    return await jwt.generateToken({ email: user.email, name: user.fullname });
}

export async function validateToken(token:string) {
    try {
        const decoded = await jwt.validateToken(token);
        return decoded
    } catch (error) {
        return null
    }
}

export function hashPassword(password:string) {
    const hash = crypto.createHash('sha256');
    hash.update(password);
    const value = hash.digest('hex');
    return value;
  }

// export async function disableToken(token:string) {
//     if (validateToken(token)) {
//         jwt.disableToken(token)
//     }
// }

export function generateRandomNumber(): string {
    const min = 100000;
    const max = 999999;
    let value = Math.floor(Math.random() * (max - min + 1) + min);
    return value.toString()
}
   
export async function getUser(req:Request): Promise<User> {
    const headers = req["headers"]
    let user_req:any = headers["user"];
    if (user_req == null) return new User()
    else return JSON.parse(user_req)
}