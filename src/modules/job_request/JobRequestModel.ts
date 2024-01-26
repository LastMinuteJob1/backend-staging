import { DataTypes, Model } from "sequelize";
import sequelize from "../../config/db";
import User from "../user/UserModel";
import Job from "../job/JobModel";
import { JobRequestStatus } from "./JobRequestInterface";

const sequelizePaginate = require('sequelize-paginate')

class JobRequest extends Model {
    declare id:number
    declare slug:string
    declare status:number
}

JobRequest.init({
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
    status: {
        type: DataTypes.INTEGER,
        defaultValue: JobRequestStatus.PENDING
     },
   }, { sequelize, tableName: "job_request" });
   
   // person who sent the job request
   User.hasMany(JobRequest)
   JobRequest.belongsTo(User)
   // particular job sending job request to
   Job.hasMany(JobRequest)
   JobRequest.belongsTo(Job)
   
   sequelizePaginate.paginate(JobRequest)
   export default JobRequest