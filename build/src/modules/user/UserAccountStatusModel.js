"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../../config/db"));
const UserInterface_1 = require("./UserInterface");
const UserModel_1 = __importDefault(require("./UserModel"));
class UserAccountStatus extends sequelize_1.Model {
}
UserAccountStatus.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    status: {
        type: sequelize_1.DataTypes.ENUM,
        values: [UserInterface_1.IUserAccountStatus.ACTIVE, UserInterface_1.IUserAccountStatus.IN_ACTIVE],
        defaultValue: UserInterface_1.IUserAccountStatus.ACTIVE
    },
    reason: {
        type: sequelize_1.DataTypes.STRING
    }
}, { sequelize: db_1.default, tableName: "user-account-statuses" });
UserModel_1.default.hasOne(UserAccountStatus);
UserAccountStatus.belongsTo(UserModel_1.default);
exports.default = UserAccountStatus;
