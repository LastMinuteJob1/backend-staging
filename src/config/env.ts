require('dotenv').config();

export const APP_VERSION = process.env.APP_VERSION || ""

// enviroment
export const ENVIROMENT = process.env.ENVIROMENT || ""

// MySQL
export const MYSQL_DATABASE = process.env.MYSQL_DATABASE || ""
export const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD || ""
export const MYSQL_USERNAME = process.env.MYSQL_USERNAME || ""
export const MYSQL_HOST = process.env.MYSQL_HOST || ""
export const MYSQL_PORT = process.env.MYSQL_PORT || ""

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
