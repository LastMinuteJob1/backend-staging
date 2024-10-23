import { DataTypes, Model } from "sequelize";
import sequelize from "../../config/db";
import User from "../user/UserModel";

const sequelizePaginate = require('sequelize-paginate')

class Interac extends Model {
  declare id:number;
  declare email: string;
  declare verification_code: string;
  declare is_verified: boolean;
}

Interac.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  verification_code: {
    type: DataTypes.STRING
  },
  is_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, { sequelize, tableName: "interac-accounts" });

User.hasMany(Interac)
Interac.belongsTo(User)

sequelizePaginate.paginate(Interac)

export default Interac