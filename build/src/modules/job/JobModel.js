"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../../config/db"));
const JobInterface_1 = require("./JobInterface");
const sequelizePaginate = require('sequelize-paginate');
class Job extends sequelize_1.Model {
}
Job.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    slug: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true, unique: true
    },
    description: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    job_location: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    type: {
        type: sequelize_1.DataTypes.ENUM,
        values: [JobInterface_1.ADTYPE.GOODS, JobInterface_1.ADTYPE.SERVICES]
    },
    price: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    job_date: {
        type: sequelize_1.DataTypes.STRING, // Change to DataTypes.DATE
        allowNull: true
    },
    job_time: {
        type: sequelize_1.DataTypes.STRING
    },
    published: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false
    },
    UserId: {
        type: sequelize_1.DataTypes.INTEGER
    },
    pricing: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        values: ["fixed", "negotiable"]
    }
}, { sequelize: db_1.default, tableName: "job" });
sequelizePaginate.paginate(Job);
exports.default = Job;
