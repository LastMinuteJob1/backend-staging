import { DataTypes, Model } from "sequelize";
import sequelize from "../../config/db";
// import User from "../../modules/user/UserModel";
import Job from "../../modules/job/JobModel";

class StripePayment extends Model {
  declare id:number;
  declare ref:string;
  declare data:any;
}

StripePayment.init({
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
}, { sequelize, tableName: "stripe-payments" });

Job.hasOne(StripePayment);
StripePayment.belongsTo(Job);

export default StripePayment