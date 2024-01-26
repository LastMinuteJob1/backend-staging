import { DataTypes, Model } from "sequelize";
import sequelize from "../../config/db";
import User from "../user/UserModel";

const sequelizePaginate = require('sequelize-paginate')

class NotificationModel extends Model {
    declare id:number
    declare slug:string
    declare title:string
    declare content:string
    declare type:number
    declare from:string
    declare seen:boolean
}

NotificationModel.init({
    id: {
       type: DataTypes.INTEGER,
       autoIncrement: true,
       primaryKey: true
    },
    slug: {
       type: DataTypes.STRING,
       unique: true,
       allowNull: false
    },
    title: {
       type: DataTypes.STRING,
       allowNull: false
    },
    from: {
       type: DataTypes.STRING,
       allowNull: false
    },
    content: {
       type: DataTypes.STRING,
       allowNull: false
    },
    type: {
       type: DataTypes.INTEGER
    },
    seen: {
       type: DataTypes.BOOLEAN,
       defaultValue: false
    },
   }, { sequelize, tableName: "notifications" });
   
   User.hasMany(NotificationModel)
   NotificationModel.belongsTo(User)
   
   sequelizePaginate.paginate(NotificationModel)
   export default NotificationModel