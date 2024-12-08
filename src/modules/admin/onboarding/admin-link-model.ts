import { DataTypes, Model } from "sequelize";
import sequelize from "../../../config/db";
import Admin from "./admin-model";

class AdminLink extends Model {
  declare id:number;
  declare token:string;
  declare active:boolean;
}

AdminLink.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  token: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
}, { sequelize, tableName: "admin-links" });

Admin.hasMany(AdminLink)
AdminLink.belongsTo(Admin)

export default AdminLink