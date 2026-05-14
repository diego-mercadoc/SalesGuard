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
    'postgresql://salesguard:salesguard@localhost:5432/salesguard?schema=public',
  googleClientId: process.env.GOOGLE_CLIENT_ID ?? "",
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
  googleRedirectUri: process.env.GOOGLE_REDIRECT_URI ?? "",
  googleAuthSuccessRedirect: process.env.GOOGLE_AUTH_SUCCESS_REDIRECT ?? "",
  googleAuthFailureRedirect: process.env.GOOGLE_AUTH_FAILURE_REDIRECT ?? ""
};
