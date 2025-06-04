require('dotenv').config();

export const APP_VERSION = process.env.APP_VERSION || ""

// enviroment
export const ENVIROMENT = process.env.ENVIROMENT || "" 

// MySQL
export const DB_NAME = process.env.DB_NAME || ""
export const DB_PWD = process.env.DB_PWD || ""
export const DB_UID = process.env.DB_UID || ""
export const DB_HOST = process.env.DB_HOST || ""
export const DB_PORT = process.env.DB_PORT || ""

// JWT
export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "" 

// EMAIL
export const EMAIL_USERNAME = process.env.EMAIL_USERNAME || ""
export const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD || ""
export const EMAIL_SERVICE = process.env.EMAIL_SERVICE || ""
export const SMTP_HOST = process.env.SMTP_HOST || ""
export const SMTP_PORT = process.env.SMTP_PORT || ""
export const SECURE_SMTP = process.env.EMAIL_SERVICE || ""

// STORAGE
export const ACCESS_KEY = process.env.ACCESS_KEY || ""
export const SECRET_KEY = process.env.SECRET_KEY || ""

// STRIPE PAYMENT
export const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || "";
export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || "";

// SERVER DETAILS
export const SERVER_BASE_URL = process.env.SERVER_BASE_URL || "";

// SUPER ADMIN
export const SUPER_ADMIN_UID = process.env.SUPER_ADMIN_UID || "";
export const SUPER_ADMIN_PWD = process.env.SUPER_ADMIN_PWD || "";

// AMAZON S3
export const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME || "";
export const S3_REGION_NAME = process.env.S3_REGION_NAME || "";
export const ACCESS_KEY_ID = process.env.ACCESS_KEY_ID || ""; 
export const SECRET_ACCESS_KEY = process.env.SECRET_ACCESS_KEY || "";
