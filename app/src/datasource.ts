import { DataSource, DataSourceOptions } from "typeorm";
import { env } from "./env";

export const dataSourceOptions: DataSourceOptions = {
    type: "mongodb",
    url: env.DATABASE_URL,
    entities: ['dist/**/entities/*.js'],
    //logging: ["error", "query"],
    synchronize: true,
}

export const dataSource = new DataSource(dataSourceOptions);