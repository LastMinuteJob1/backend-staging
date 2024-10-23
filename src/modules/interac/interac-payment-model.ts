import { DataTypes, Model } from "sequelize";
import sequelize from "../../config/db";
import Interac from "./interac-model";

const sequelizePaginate = require('sequelize-paginate')

class InteracPayment extends Model {
  declare id:number;
  declare ref: string;
  declare deposited: boolean;
}

InteracPayment.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  ref: {
    type: DataTypes.STRING,
    allowNull: false
  },
  deposited: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, { sequelize, tableName: "interac-payments" });

Interac.hasOne(InteracPayment)
InteracPayment.belongsTo(Interac)

sequelizePaginate.paginate(InteracPayment)

export default InteracPayment