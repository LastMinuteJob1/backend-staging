"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../../../config/db"));
const admin_model_1 = __importDefault(require("./admin-model"));
class AdminLink extends sequelize_1.Model {
}
AdminLink.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    token: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    active: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: true
    },
}, { sequelize: db_1.default, tableName: "admin-links" });
admin_model_1.default.hasMany(AdminLink);
AdminLink.belongsTo(admin_model_1.default);
exports.default = AdminLink;
