import { DataTypes, Model } from "sequelize";
import sequelize from "../../config/db";
import Job from "./JobModel";

const sequelizePaginate = require('sequelize-paginate')

class JobPics extends Model {
  declare id:number;
  declare url:string
}

JobPics.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  }, 
  url: {
    type:DataTypes.STRING,
    allowNull: false
  },
  JobId:{
    type:DataTypes.INTEGER
  }
}, { sequelize, tableName: "job_pic" });

Job.hasMany(JobPics);
JobPics.belongsTo(Job)

// sequelizePaginate.paginate(JobPics)
export default JobPics