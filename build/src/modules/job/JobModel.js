"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../../config/db"));
const UserModel_1 = __importDefault(require("../user/UserModel"));
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
        unique: true,
        allowNull: false
    },
    title: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    picx_url: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false
    },
    location: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    priority_lvl: {
        type: sequelize_1.DataTypes.INTEGER,
    },
    active: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: true
    }
}, { sequelize: db_1.default, tableName: "job" });
UserModel_1.default.hasMany(Job);
Job.belongsTo(UserModel_1.default);
sequelizePaginate.paginate(Job);
exports.default = Job;
