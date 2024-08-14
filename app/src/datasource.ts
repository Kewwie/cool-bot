import { DataSource, DataSourceOptions } from "typeorm";
import { env } from "./env";

export const dataSourceOptions: DataSourceOptions = {
    type: "mongodb",
    url: env.DATABASE_URL,
    //host: env.DATABASE_HOST,
    //port: env.DATABASE_PORT,
    //username: env.DATABASE_USER,
   // password: env.DATABASE_PASS,
   // database: env.DATABASE_NAME,
    //authSource: 'admin', // Use 'admin' as the auth source if necessary
    useUnifiedTopology: true,
    synchronize: true,  // Set to false in production
    logging: ["error", "query"],
    entities: [
        __dirname + '/**/entities/*.ts',
        __dirname + '/**/entities/*.js'
    ]
}

export const dataSource = new DataSource(dataSourceOptions);