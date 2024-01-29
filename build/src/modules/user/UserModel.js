"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../../config/db"));
class User extends sequelize_1.Model {
}
User.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    fullname: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    phone_number: {
        type: sequelize_1.DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    address: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    verification_code: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    is_verified: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false
    },
    token: {
        type: sequelize_1.DataTypes.STRING
    },
}, { sequelize: db_1.default, tableName: "users" });
exports.default = User;
