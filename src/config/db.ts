import { Sequelize } from "sequelize";
import { DB_NAME, DB_HOST, DB_PWD, DB_PORT, DB_UID } from "./env";

const dbConfig = {
    'development': {
      username: DB_UID,
      password: DB_PWD,
      database: DB_NAME,
      host: DB_HOST, 
      port: DB_PORT,
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