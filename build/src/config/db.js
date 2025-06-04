"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const env_1 = require("./env");
const dbConfig = {
    'development': {
        username: env_1.DB_UID,
        password: env_1.DB_PWD,
        database: env_1.DB_NAME,
        host: env_1.DB_HOST,
        port: env_1.DB_PORT,
        dialect: 'postgres',
        models: [],
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false, // You can set this to true if you want to validate the certificate
            },
        },
    },
    'testing': {},
    'preproduction': {},
    'production': {}
    // Additional configurations for other environments (optional)
};
let config = dbConfig["development"];
const sequelize = new sequelize_1.Sequelize(config);
exports.default = sequelize;
