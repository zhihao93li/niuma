import { createConnection } from 'typeorm';

export const connectDatabase = async (): Promise<void> => {
  try {
    await createConnection({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + '/../models/*.ts'],
      synchronize: false,
    });
    console.log('Connected to PostgreSQL');
  } catch (error) {
    console.error('PostgreSQL connection error:', error);
    process.exit(1);
  }
};
