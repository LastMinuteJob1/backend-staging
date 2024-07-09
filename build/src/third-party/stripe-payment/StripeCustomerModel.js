"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../../config/db"));
const UserModel_1 = __importDefault(require("../../modules/user/UserModel"));
class StripeCustomer extends sequelize_1.Model {
}
StripeCustomer.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    data: {
        type: sequelize_1.DataTypes.JSON,
        allowNull: false,
    }
}, { sequelize: db_1.default, tableName: "stripe-customers" });
UserModel_1.default.hasOne(StripeCustomer);
StripeCustomer.belongsTo(UserModel_1.default);
exports.default = StripeCustomer;
