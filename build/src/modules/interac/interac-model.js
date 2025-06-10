"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../../config/db"));
const UserModel_1 = __importDefault(require("../user/UserModel"));
const sequelizePaginate = require('sequelize-paginate');
class Interac extends sequelize_1.Model {
}
Interac.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    verification_code: {
        type: sequelize_1.DataTypes.STRING
    },
    is_verified: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false
    }
}, { sequelize: db_1.default, tableName: "interac-accounts" });
UserModel_1.default.hasMany(Interac);
Interac.belongsTo(UserModel_1.default);
sequelizePaginate.paginate(Interac);
exports.default = Interac;
