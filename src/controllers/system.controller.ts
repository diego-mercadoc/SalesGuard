import { Request, Response } from "express";

export const getApiOverview = (_req: Request, res: Response): void => {
  res.status(200).json({
    name: "SalesGuard API",
    version: "1.0.0",
    environment: process.env.NODE_ENV || "development",
    docs: "/docs",
    health: "/api/health",
    auth: {
      register: "/api/auth/register",
      login: "/api/auth/login",
      me: "/api/auth/me"
    }
  });
};
