import { configDotenv } from "dotenv";

configDotenv();

interface Config {
  PORT: number;
  NODE_ENV: string;
  DATABASE_PATH: string;
  CLIENT_URL: string;
  JWT_SECRET: string;
}

if (!process.env.PORT) {
  throw new Error("Error: PORT is not defined in the environment variables");
}

if (!process.env.NODE_ENV) {
  throw new Error("Error: NODE_ENV is not defined in the environment variables");
}

if (!process.env.DATABASE_PATH) {
  throw new Error("Error: DATABASE_PATH is not defined in the environment variables");
}

if (!process.env.CLIENT_URL) {
  throw new Error("Error: CLIENT_URL is not defined in the environment variables");
}

if (!process.env.JWT_SECRET) {
  throw new Error("Error: JWT_SECRET is not defined in the environment variables");
}


const config: Config = {
  PORT: Number(process.env.PORT) || 3000,
  NODE_ENV: process.env.NODE_ENV,
  DATABASE_PATH: process.env.DATABASE_PATH,
  CLIENT_URL: process.env.CLIENT_URL,
  JWT_SECRET: process.env.JWT_SECRET,
};

export default config;