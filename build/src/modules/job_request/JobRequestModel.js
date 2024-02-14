"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../../config/db"));
const UserModel_1 = __importDefault(require("../user/UserModel"));
const JobModel_1 = __importDefault(require("../job/JobModel"));
const JobRequestInterface_1 = require("./JobRequestInterface");
const sequelizePaginate = require('sequelize-paginate');
class JobRequest extends sequelize_1.Model {
}
JobRequest.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    slug: {
        type: sequelize_1.DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    status: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: JobRequestInterface_1.JobRequestStatus.PENDING
    },
    completed: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false
    },
}, { sequelize: db_1.default, tableName: "job_request" });
// person who sent the job request
UserModel_1.default.hasMany(JobRequest);
JobRequest.belongsTo(UserModel_1.default);
// particular job sending job request to
JobModel_1.default.hasMany(JobRequest);
JobRequest.belongsTo(JobModel_1.default);
sequelizePaginate.paginate(JobRequest);
exports.default = JobRequest;
