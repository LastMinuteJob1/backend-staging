"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../../../config/db"));
class Faq extends sequelize_1.Model {
}
Faq.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    title: {
        type: sequelize_1.DataTypes.STRING
    },
    content: {
        type: sequelize_1.DataTypes.STRING
    }
}, { sequelize: db_1.default, tableName: "faqs" });
exports.default = Faq;
