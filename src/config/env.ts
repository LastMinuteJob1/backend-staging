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