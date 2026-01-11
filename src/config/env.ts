import "dotenv/config";

export const env = {
  PORT: Number(process.env.PORT),

  DB_HOST: process.env.DB_HOST!,
  DB_PORT: Number(process.env.DB_PORT),
  DB_USER: process.env.DB_USER!,
  DB_PASSWORD: process.env.DB_PASSWORD!,
  DB_NAME: process.env.DB_NAME!,

  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET!,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET!,
  JWT_ACCESS_TTL: process.env.JWT_ACCESS_TTL!,
  JWT_REFRESH_TTL: process.env.JWT_REFRESH_TTL!,
};

