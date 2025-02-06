import { DataTypes, Model } from "sequelize";
import sequelize from "../../../config/db";

class Faq extends Model {
    declare id: number;
    declare faq: Object[];
    declare terms: Object[];
}

Faq.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING
    },
    content: {
        type: DataTypes.STRING
    }
}, { sequelize, tableName: "faqs" });

export default Faq