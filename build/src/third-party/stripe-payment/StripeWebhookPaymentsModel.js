"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../../config/db"));
class StripeWebhookPayment extends sequelize_1.Model {
}
StripeWebhookPayment.init({
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
}, { sequelize: db_1.default, tableName: "stripe-webhook-payments" });
exports.default = StripeWebhookPayment;
