import { DataTypes, Model } from "sequelize";
import sequelize from "../../../config/db";

class Admin extends Model {
  declare id:number;
  declare username:string;
  declare password:string;
  declare first_name:string;
  declare last_name:string;
  declare email:string;
  declare phone_number:string;
  declare dob:Date;
  declare address:string;
  declare pics:string;
  declare bio:string;
  declare two_factor_temp_secret:string;
  declare two_factor_temp_secret_ascii:string;
  declare token:string;
  declare roles:string[];
  declare otp:string;
  declare verification_code: string
  declare active:boolean;
  declare is2FA_active:boolean;
}

Admin.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  username: {
    type: DataTypes.STRING,
    // allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    // allowNull: false
  },
  first_name: {
    type: DataTypes.STRING,
    // allowNull: false
  },
  last_name: {
    type: DataTypes.STRING,
    // allowNull: false
  },
  pics: {
    type: DataTypes.STRING,
    // allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  phone_number: {
    type: DataTypes.STRING,
    // allowNull: false,
    unique: true
  },
  dob: {
    type: DataTypes.DATEONLY,
    // allowNull: false
  },
  token: {
    type: DataTypes.STRING,
    // allowNull: false
  },
  two_factor_temp_secret: {
    type: DataTypes.STRING,
    // allowNull: false
  },
  two_factor_temp_secret_ascii: {
    type: DataTypes.STRING,
    // allowNull: false
  },
  otp: {
    type: DataTypes.STRING,
    // allowNull: false
  },
  verification_code: {
    type: DataTypes.STRING,
    // allowNull: false
  },
  address: {
    type: DataTypes.STRING,
    // allowNull: false
  },
  bio: {
    type: DataTypes.TEXT
  },
  roles: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  is2FA_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, { sequelize, tableName: "admins" });

export default Admin