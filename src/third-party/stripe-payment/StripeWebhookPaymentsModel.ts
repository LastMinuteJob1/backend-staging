import { DataTypes, Model } from "sequelize";
import sequelize from "../../config/db";

class StripeWebhookPayment extends Model {
  declare id:number;
  declare ref:string;
  declare data:any;
}

StripeWebhookPayment.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  ref: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  data: {
    type: DataTypes.JSON,
    allowNull: false,
  }
}, { sequelize, tableName: "stripe-webhook-payments" });

export default StripeWebhookPayment