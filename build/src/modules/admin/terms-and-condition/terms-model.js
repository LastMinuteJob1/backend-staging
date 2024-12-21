"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../../../config/db"));
class TermsAndConditions extends sequelize_1.Model {
}
TermsAndConditions.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    faq: {
        type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.JSON)
    },
    terms: {
        type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.JSON)
    }
}, { sequelize: db_1.default, tableName: "terms_and_conditions" });
exports.default = TermsAndConditions;
