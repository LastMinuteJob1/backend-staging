"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../../../config/db"));
class Admin extends sequelize_1.Model {
}
Admin.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    username: {
        type: sequelize_1.DataTypes.STRING,
        // allowNull: false,
        unique: true
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        // allowNull: false
    },
    first_name: {
        type: sequelize_1.DataTypes.STRING,
        // allowNull: false
    },
    last_name: {
        type: sequelize_1.DataTypes.STRING,
        // allowNull: false
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    phone_number: {
        type: sequelize_1.DataTypes.STRING,
        // allowNull: false,
        unique: true
    },
    dob: {
        type: sequelize_1.DataTypes.DATEONLY,
        // allowNull: false
    },
    token: {
        type: sequelize_1.DataTypes.STRING,
        // allowNull: false
    },
    two_factor_temp_secret: {
        type: sequelize_1.DataTypes.STRING,
        // allowNull: false
    },
    two_factor_temp_secret_ascii: {
        type: sequelize_1.DataTypes.STRING,
        // allowNull: false
    },
    address: {
        type: sequelize_1.DataTypes.STRING,
        // allowNull: false
    },
    bio: {
        type: sequelize_1.DataTypes.TEXT
    },
    roles: {
        type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
        defaultValue: []
    },
    active: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: true
    },
    is2FA_active: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false
    }
}, { sequelize: db_1.default, tableName: "admins" });
exports.default = Admin;
