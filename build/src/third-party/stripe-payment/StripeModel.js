"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../../config/db"));
// import User from "../../modules/user/UserModel";
const JobModel_1 = __importDefault(require("../../modules/job/JobModel"));
class StripePayment extends sequelize_1.Model {
}
StripePayment.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    ref: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    data: {
        type: sequelize_1.DataTypes.JSON,
        allowNull: false,
    }
}, { sequelize: db_1.default, tableName: "stripe-payments" });
JobModel_1.default.hasOne(StripePayment);
StripePayment.belongsTo(JobModel_1.default);
exports.default = StripePayment;
