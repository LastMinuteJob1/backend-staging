import { DataTypes, Model } from "sequelize";
import sequelize from "../../config/db";
import Wallet from "./WalletModel";

const sequelizePaginate = require('sequelize-paginate')

class TransactionHistory extends Model {
  declare id:number; 
  declare amount:number; 
  declare data:object; 
}

TransactionHistory.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  }, 
  amount: {
    type: DataTypes.FLOAT,
  },
  data: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  WalletId:{
    type:DataTypes.INTEGER
  },
}, { sequelize, tableName: "wallet-history" });

Wallet.hasMany(TransactionHistory)
TransactionHistory.belongsTo(Wallet)

sequelizePaginate.paginate(TransactionHistory)
export default TransactionHistory