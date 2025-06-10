"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../../config/db"));
const JobModel_1 = __importDefault(require("./JobModel"));
const sequelizePaginate = require('sequelize-paginate');
class JobPics extends sequelize_1.Model {
}
JobPics.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    url: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    JobId: {
        type: sequelize_1.DataTypes.INTEGER
    }
}, { sequelize: db_1.default, tableName: "job_pic" });
JobModel_1.default.hasMany(JobPics);
JobPics.belongsTo(JobModel_1.default);
// sequelizePaginate.paginate(JobPics)
exports.default = JobPics;
