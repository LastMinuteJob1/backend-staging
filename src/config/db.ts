import { Sequelize } from "sequelize";
import { MYSQL_DATABASE, MYSQL_HOST, MYSQL_PASSWORD, MYSQL_PORT, MYSQL_USERNAME } from "./env";

const dbConfig = {
    'development': {
      username: MYSQL_USERNAME,
      password: MYSQL_PASSWORD,
      database: MYSQL_DATABASE,
      host: MYSQL_HOST,
      port: MYSQL_PORT,
      dialect: 'postgres',
      models: [],
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false, // You can set this to true if you want to validate the certificate
        },
      },
    },
    'testing': {

    },  
    'preproduction': { 

    },
    'production': {

    }
    // Additional configurations for other environments (optional)
  };

  let config:any = dbConfig["development"];
  const sequelize = new Sequelize(config)

  export default sequelize 