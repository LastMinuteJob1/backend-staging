"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SERVER_BASE_URL = exports.STRIPE_WEBHOOK_SECRET = exports.STRIPE_SECRET_KEY = exports.SECRET_KEY = exports.ACCESS_KEY = exports.SECURE_SMTP = exports.SMTP_PORT = exports.SMTP_HOST = exports.EMAIL_SERVICE = exports.EMAIL_PASSWORD = exports.EMAIL_USERNAME = exports.JWT_SECRET_KEY = exports.MYSQL_PORT = exports.MYSQL_HOST = exports.MYSQL_USERNAME = exports.MYSQL_PASSWORD = exports.MYSQL_DATABASE = exports.ENVIROMENT = exports.APP_VERSION = void 0;
require('dotenv').config();
exports.APP_VERSION = process.env.APP_VERSION || "";
// enviroment
exports.ENVIROMENT = process.env.ENVIROMENT || "";
// MySQL
exports.MYSQL_DATABASE = process.env.MYSQL_DATABASE || "";
exports.MYSQL_PASSWORD = process.env.MYSQL_PASSWORD || "";
exports.MYSQL_USERNAME = process.env.MYSQL_USERNAME || "";
exports.MYSQL_HOST = process.env.MYSQL_HOST || "";
exports.MYSQL_PORT = process.env.MYSQL_PORT || "";
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
