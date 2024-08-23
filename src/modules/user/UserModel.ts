import { DataTypes, Model } from "sequelize";
import sequelize from "../../config/db";
import { IUserAccountStatus } from "./UserInterface";

class User extends Model {
  declare id:number;
  declare email: string;
  declare fullname: string;
  declare pronoun: string;
  declare phone_number: number;
  declare address: string;
  declare postal_code: string;
  declare city: string;
  declare password: string;
  declare is_verified: boolean;
  declare verification_code: string;
  declare token: string;
  declare active: boolean;
  declare reason: string;
  declare firebase_token: string;
  declare dob: Date;
  declare province: string;
}

User.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  fullname: {
    type: DataTypes.STRING,
    allowNull: false
  },
  pronoun: {
    type: DataTypes.STRING,
    allowNull: false
  },
  postal_code: {
    type: DataTypes.STRING,
    allowNull: false
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false
  }, 
  dob: {
    type: DataTypes.DATE,
  }, 
  province: {
    type: DataTypes.STRING,
  }, 
  phone_number: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  verification_code: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  is_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  token: {
    type: DataTypes.STRING
  },
  active: {
    type: DataTypes.BOOLEAN,
    // values: [IUserAccountStatus.ACTIVE, IUserAccountStatus.IN_ACTIVE, IUserAccountStatus.DELETED],
    defaultValue: true//IUserAccountStatus.ACTIVE
  },
  firebase_token: {
    type: DataTypes.STRING
  },
  reason: {
    type: DataTypes.STRING
  }
}, { sequelize, tableName: "users" });

export default User