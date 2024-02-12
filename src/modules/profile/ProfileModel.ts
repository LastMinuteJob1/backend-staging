import { DataTypes, Model } from "sequelize";
import sequelize from "../../config/db";
import User from "../user/UserModel";

const sequelizePaginate = require('sequelize-paginate')

class Profile extends Model {
 declare id:number;
 declare job_title:string;
 declare job_description:string;
 declare years_of_experience:string;
 declare certifications:string;
 declare other_jobs:string;
 declare description:string;
 declare other_info:string;
}

Profile.init({
 id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
 },
 job_title: {
    type: DataTypes.STRING,
 },
 job_description: {
    type: DataTypes.STRING,
 },
 years_of_experience: {
    type: DataTypes.STRING,
 },
 certifications: {
    type: DataTypes.STRING,
 },
 other_jobs: {
    type: DataTypes.STRING,
 },
 description: {
    type: DataTypes.STRING,
 },
 other_info: {
    type: DataTypes.STRING,
 }
}, { sequelize, tableName: "job" });

User.hasOne(Profile)
Profile.belongsTo(User)

sequelizePaginate.paginate(Profile)
export default Profile