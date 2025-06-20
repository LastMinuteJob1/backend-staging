import { DataTypes, Model } from "sequelize";
import sequelize from "../../config/db";
import { ADTYPE } from "./JobInterface";

const sequelizePaginate = require('sequelize-paginate')

class Job extends Model {
  declare id:number; 
  declare slug:string;
  declare description:string; 
  declare job_location:string; 
  declare type:string;
  declare price:number; 
  declare job_date:any; 
  declare job_time:any; 
  declare published:boolean; 
  declare pricing:string; 
  declare active:boolean; 
  declare paid:boolean; 
}

Job.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  }, 
  slug: {
    type: DataTypes.STRING, 
    allowNull: true, unique: true
  },  
  description: {
    type: DataTypes.STRING,
    allowNull: false
  }, 
  job_location: {
    type: DataTypes.STRING,
    allowNull: false
  }, 
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }, 
  type: {
    type: DataTypes.ENUM, 
    values: [ADTYPE.GOODS, ADTYPE.SERVICES]
  }, 
  price: {
    type: DataTypes.FLOAT,
    defaultValue: 10
  }, 
  job_date: {
    type: DataTypes.STRING, // Change to DataTypes.DATE
    allowNull: true
  }, 
  paid: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  job_time: {
    type: DataTypes.STRING
  }, 
  published: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  UserId:{
    type:DataTypes.INTEGER
  },
  pricing: {
    type: DataTypes.STRING,
    allowNull: false,
    values: ["fixed", "negotiable"]
  }
}, { sequelize, tableName: "job" });

sequelizePaginate.paginate(Job)
export default Job