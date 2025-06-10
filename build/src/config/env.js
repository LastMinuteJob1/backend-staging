"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SECRET_ACCESS_KEY = exports.ACCESS_KEY_ID = exports.S3_REGION_NAME = exports.S3_BUCKET_NAME = exports.SUPER_ADMIN_PWD = exports.SUPER_ADMIN_UID = exports.SERVER_BASE_URL = exports.STRIPE_WEBHOOK_SECRET = exports.STRIPE_SECRET_KEY = exports.SECRET_KEY = exports.ACCESS_KEY = exports.SECURE_SMTP = exports.SMTP_PORT = exports.SMTP_HOST = exports.EMAIL_SERVICE = exports.EMAIL_PASSWORD = exports.EMAIL_USERNAME = exports.JWT_SECRET_KEY = exports.DB_PORT = exports.DB_HOST = exports.DB_UID = exports.DB_PWD = exports.DB_NAME = exports.ENVIROMENT = exports.APP_VERSION = void 0;
require('dotenv').config();
exports.APP_VERSION = process.env.APP_VERSION || "";
// enviroment
exports.ENVIROMENT = process.env.ENVIROMENT || "";
// MySQL
exports.DB_NAME = process.env.DB_NAME || "";
exports.DB_PWD = process.env.DB_PWD || "";
exports.DB_UID = process.env.DB_UID || "";
exports.DB_HOST = process.env.DB_HOST || "";
exports.DB_PORT = process.env.DB_PORT || "";
// JWT
exports.JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "";
// EMAIL
exports.EMAIL_USERNAME = process.env.EMAIL_USERNAME || "";
exports.EMAIL_PASSWORD = process.env.EMAIL_PASSWORD || "";
exports.EMAIL_SERVICE = process.env.EMAIL_SERVICE || "";
exports.SMTP_HOST = process.env.SMTP_HOST || "";
exports.SMTP_PORT = process.env.SMTP_PORT || "";
exports.SECURE_SMTP = process.env.EMAIL_SERVICE || "";
// STORAGE
exports.ACCESS_KEY = process.env.ACCESS_KEY || "";
exports.SECRET_KEY = process.env.SECRET_KEY || "";
// STRIPE PAYMENT
exports.STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || "";
exports.STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || "";
// SERVER DETAILS
exports.SERVER_BASE_URL = process.env.SERVER_BASE_URL || "";
// SUPER ADMIN
exports.SUPER_ADMIN_UID = process.env.SUPER_ADMIN_UID || "";
exports.SUPER_ADMIN_PWD = process.env.SUPER_ADMIN_PWD || "";
// AMAZON S3
exports.S3_BUCKET_NAME = process.env.S3_BUCKET_NAME || "";
exports.S3_REGION_NAME = process.env.S3_REGION_NAME || "";
exports.ACCESS_KEY_ID = process.env.ACCESS_KEY_ID || "";
exports.SECRET_ACCESS_KEY = process.env.SECRET_ACCESS_KEY || "";
