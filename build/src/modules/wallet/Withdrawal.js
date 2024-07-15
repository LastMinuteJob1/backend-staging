"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../../config/db"));
const StripeCustomerModel_1 = __importDefault(require("../../third-party/stripe-payment/StripeCustomerModel"));
const sequelizePaginate = require('sequelize-paginate');
class Withdrawal extends sequelize_1.Model {
}
Withdrawal.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    amount: {
        type: sequelize_1.DataTypes.FLOAT,
        defaultValue: 0.0
    },
}, { sequelize: db_1.default, tableName: "withdrawal" });
StripeCustomerModel_1.default.hasOne(Withdrawal);
Withdrawal.belongsTo(StripeCustomerModel_1.default);
sequelizePaginate.paginate(Withdrawal);
exports.default = Withdrawal;
