import dotenv from "dotenv";

dotenv.config();

const parsePort = (value: string | undefined): number => {
  const fallbackPort = 3000;

  if (!value) {
    return fallbackPort;
  }

  const parsedPort = Number(value);

  if (Number.isNaN(parsedPort) || parsedPort <= 0) {
    return fallbackPort;
  }

  return parsedPort;
};

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: parsePort(process.env.PORT),
  apiPrefix: process.env.API_PREFIX ?? "/api",
  jwtSecret: process.env.JWT_SECRET ?? "salesguard-secret",
  databaseUrl:
    process.env.DATABASE_URL ??
    'postgresql://salesguard:salesguard@localhost:5432/salesguard?schema=public'
};
