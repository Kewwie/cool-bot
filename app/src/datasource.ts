import { DataSource, DataSourceOptions } from 'typeorm';
import { env } from './env';

export const dataSourceOptions: DataSourceOptions = {
	type: 'mongodb',
	url: env.DATABASE_URL,
	useUnifiedTopology: true,
	synchronize: true, // Set to false in production
	logging: ['error', 'query'],
	entities: [
		__dirname + '/**/entities/*.ts',
		__dirname + '/**/entities/*.js',
	],
};

export const dataSource = new DataSource(dataSourceOptions);
