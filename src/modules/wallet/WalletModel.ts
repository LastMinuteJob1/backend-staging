import { DataTypes, Model } from "sequelize";
import sequelize from "../../config/db";
import User from "../user/UserModel";

const sequelizePaginate = require('sequelize-paginate')

class Wallet extends Model {
  declare id:number; 
  declare balance:number; 
}

Wallet.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  }, 
  balance: {
    type: DataTypes.FLOAT,
    defaultValue: 0.0
  },
}, { sequelize, tableName: "wallet" });

User.hasOne(Wallet)
Wallet.belongsTo(User)

sequelizePaginate.paginate(Wallet)
export default Wallet