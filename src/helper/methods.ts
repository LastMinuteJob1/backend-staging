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

const jwt = new JWTToken('HS256', JWT_SECRET_KEY, '24h');

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
    const min = 1000;
    const max = 9999;
    let value = Math.floor(Math.random() * (max - min + 1) + min);
    return value.toString()
}
   
export async function getUser(req:Request): Promise<User> {
    const headers = req["headers"]
    let user_req:any = headers["user"];
    if (user_req == null) return new User()
    else return JSON.parse(user_req)
}

export function getCharges(price:number) {
    return (7.5*price)/100
}

export function generateReferralCode(options?:any) {
    // Define default options
    const defaultOptions = {
      prefixLength: 6, // Adjust as desired
      separator: "-",
      codeLength: 5,
    };
  
    // Merge provided options with defaults
    const settings = Object.assign({}, defaultOptions, options);
  
    // Generate random prefix
    let prefix = "";
    for (let i = 0; i < settings.prefixLength; i++) {
      const randomChar = String.fromCharCode(Math.floor(Math.random() * 26) + 65); // Generate A-Z characters
      prefix += randomChar;
    }
  
    // Generate random numbers for the code part
    const code = Math.floor(Math.random() * Math.pow(10, settings.codeLength)).toString().padStart(settings.codeLength, "0");
  
    // Combine the components
    return prefix + settings.separator + code;
  }

  
export function generateOTP(length: number = 4) {
  const digits = '0123456789';
  let otp = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * digits.length);
    const randomDigit = digits[randomIndex];
    otp += randomDigit;
  }

  return otp;
}
