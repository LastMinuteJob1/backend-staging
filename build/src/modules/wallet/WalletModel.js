"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../../config/db"));
const UserModel_1 = __importDefault(require("../user/UserModel"));
const sequelizePaginate = require('sequelize-paginate');
class Wallet extends sequelize_1.Model {
}
Wallet.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    balance: {
        type: sequelize_1.DataTypes.FLOAT,
        defaultValue: 0.0
    },
}, { sequelize: db_1.default, tableName: "wallet" });
UserModel_1.default.hasOne(Wallet);
Wallet.belongsTo(UserModel_1.default);
sequelizePaginate.paginate(Wallet);
exports.default = Wallet;
