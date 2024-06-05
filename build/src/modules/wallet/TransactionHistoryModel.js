"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../../config/db"));
const WalletModel_1 = __importDefault(require("./WalletModel"));
const sequelizePaginate = require('sequelize-paginate');
class TransactionHistory extends sequelize_1.Model {
}
TransactionHistory.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    amount: {
        type: sequelize_1.DataTypes.FLOAT,
    },
    data: {
        type: sequelize_1.DataTypes.JSON,
        allowNull: false,
    },
    WalletId: {
        type: sequelize_1.DataTypes.INTEGER
    },
}, { sequelize: db_1.default, tableName: "wallet-history" });
WalletModel_1.default.hasMany(TransactionHistory);
TransactionHistory.belongsTo(WalletModel_1.default);
sequelizePaginate.paginate(TransactionHistory);
exports.default = TransactionHistory;
