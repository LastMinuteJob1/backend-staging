"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../../config/db"));
const UserModel_1 = __importDefault(require("../user/UserModel"));
const sequelizePaginate = require('sequelize-paginate');
class NotificationModel extends sequelize_1.Model {
}
NotificationModel.init({
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
    from: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    content: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    type: {
        type: sequelize_1.DataTypes.INTEGER
    },
    seen: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false
    },
}, { sequelize: db_1.default, tableName: "notifications" });
UserModel_1.default.hasMany(NotificationModel);
NotificationModel.belongsTo(UserModel_1.default);
sequelizePaginate.paginate(NotificationModel);
exports.default = NotificationModel;
