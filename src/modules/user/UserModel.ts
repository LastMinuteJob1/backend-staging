import { DataTypes, Model } from "sequelize";
import sequelize from "../../config/db";

class User extends Model {
  declare id:number;
  declare email: string;
  declare fullname: string;
  declare phone_number: number;
  declare address: string;
  declare password: string;
  declare is_verified: boolean;
  declare verification_code: string;
  declare token: string;
}

User.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  fullname: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone_number: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  verification_code: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  is_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  token: {
    type: DataTypes.STRING
  },
}, { sequelize, tableName: "users" });

export default User