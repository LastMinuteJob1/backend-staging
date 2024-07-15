import { DataTypes, Model } from "sequelize";
import sequelize from "../../config/db";
import User from "../user/UserModel";
import StripeCustomer from "../../third-party/stripe-payment/StripeCustomerModel";

const sequelizePaginate = require('sequelize-paginate')

class Withdrawal extends Model {
  declare id:number; 
  declare amount:number; 
}

Withdrawal.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  }, 
  amount: {
    type: DataTypes.FLOAT,
    defaultValue: 0.0
  },
}, { sequelize, tableName: "withdrawal" });

StripeCustomer.hasOne(Withdrawal)
Withdrawal.belongsTo(StripeCustomer)

sequelizePaginate.paginate(Withdrawal)
export default Withdrawal