"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../../config/db"));
const interac_model_1 = __importDefault(require("./interac-model"));
const sequelizePaginate = require('sequelize-paginate');
class InteracPayment extends sequelize_1.Model {
}
InteracPayment.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    ref: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    deposited: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false
    }
}, { sequelize: db_1.default, tableName: "interac-payments" });
interac_model_1.default.hasOne(InteracPayment);
InteracPayment.belongsTo(interac_model_1.default);
sequelizePaginate.paginate(InteracPayment);
exports.default = InteracPayment;
