import { DataTypes, Model } from "sequelize";
import sequelize from "../../config/db";
import User from "../user/UserModel";

const sequelizePaginate = require('sequelize-paginate')

class Job extends Model {
 declare id:number
 declare slug:string
 declare title:string
 declare picx_url:string
 declare description:string
 declare price:number
 declare location:string
 declare priority_lvl:number
 declare userId:number
 declare active:boolean
}

Job.init({
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
 picx_url: {
    type: DataTypes.STRING,
    allowNull: false
 },
 description: {
    type: DataTypes.STRING,
    allowNull: false
 },
 price: {
    type: DataTypes.FLOAT,
    allowNull: false
 },
 location: {
    type: DataTypes.STRING,
    allowNull: false
 },
 priority_lvl: {
    type: DataTypes.INTEGER,
 },
 active: {
   type: DataTypes.BOOLEAN,
   defaultValue: true
 }
}, { sequelize, tableName: "job" });

User.hasMany(Job)
Job.belongsTo(User)

sequelizePaginate.paginate(Job)
export default Job