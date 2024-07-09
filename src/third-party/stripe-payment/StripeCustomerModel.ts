import { DataTypes, Model } from "sequelize";
import sequelize from "../../config/db";
import User from "../../modules/user/UserModel";

class StripeCustomer extends Model {
  declare id:number;
  declare data:any;
}

StripeCustomer.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  data: {
    type: DataTypes.JSON,
    allowNull: false,
  }
}, { sequelize, tableName: "stripe-customers" });

User.hasOne(StripeCustomer);
StripeCustomer.belongsTo(User);

export default StripeCustomer