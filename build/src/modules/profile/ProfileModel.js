"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../../config/db"));
const UserModel_1 = __importDefault(require("../user/UserModel"));
const sequelizePaginate = require('sequelize-paginate');
class Profile extends sequelize_1.Model {
}
Profile.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    job_title: {
        type: sequelize_1.DataTypes.STRING,
    },
    job_description: {
        type: sequelize_1.DataTypes.STRING,
    },
    years_of_experience: {
        type: sequelize_1.DataTypes.STRING,
    },
    certifications: {
        type: sequelize_1.DataTypes.STRING,
    },
    other_jobs: {
        type: sequelize_1.DataTypes.STRING,
    },
    description: {
        type: sequelize_1.DataTypes.STRING,
    },
    other_info: {
        type: sequelize_1.DataTypes.STRING,
    }
}, { sequelize: db_1.default, tableName: "profile" });
UserModel_1.default.hasOne(Profile);
Profile.belongsTo(UserModel_1.default);
sequelizePaginate.paginate(Profile);
exports.default = Profile;
