"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const env_1 = require("./env");
const dbConfig = {
    'development': {
        username: env_1.MYSQL_USERNAME,
        password: env_1.MYSQL_PASSWORD,
        database: env_1.MYSQL_DATABASE,
        host: env_1.MYSQL_HOST,
        dialect: 'postgres',
    },
    'testing': {},
    'preproduction': {},
    'production': {}
    // Additional configurations for other environments (optional)
};
exports.default = dbConfig;
