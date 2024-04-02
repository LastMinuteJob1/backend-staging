"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../../config/db"));
const UserInterface_1 = require("./UserInterface");
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
    pronoun: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    postal_code: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    city: {
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
    active: {
        type: sequelize_1.DataTypes.ENUM,
        values: [UserInterface_1.IUserAccountStatus.ACTIVE, UserInterface_1.IUserAccountStatus.IN_ACTIVE, UserInterface_1.IUserAccountStatus.DELETED],
        defaultValue: UserInterface_1.IUserAccountStatus.ACTIVE
    },
    reason: {
        type: sequelize_1.DataTypes.STRING
    }
}, { sequelize: db_1.default, tableName: "users" });
exports.default = User;
