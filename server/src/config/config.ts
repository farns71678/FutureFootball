import dotenv from 'dotenv';

dotenv.config();

interface Config {
  port: number;
  nodeEnv: string;
  apiHost: string;
  apiUrl: string;
  apiKey: string;
  databaseUrl: string | undefined;
  jwtSecret: string;
}

if (!process.env.JWT_SECRET) throw 'No JWT Secret';

const config: Config = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  apiHost: process.env.API_HOST || '',
  apiUrl: process.env.API_URL || '',
  apiKey: process.env.API_KEY || '',
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
};

export default config;
