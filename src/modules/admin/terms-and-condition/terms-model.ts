import { DataTypes, Model } from "sequelize";
import sequelize from "../../../config/db";

class TermsAndConditions extends Model {
    declare id: number;
    declare faq: Object[];
    declare terms: Object[];
}

TermsAndConditions.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    faq: {
        type: DataTypes.ARRAY(DataTypes.JSON)
    },
    terms: {
        type: DataTypes.ARRAY(DataTypes.JSON)
    }
}, { sequelize, tableName: "terms_and_conditions" });

export default TermsAndConditions