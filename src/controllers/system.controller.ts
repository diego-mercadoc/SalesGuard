import { Request, Response } from "express";

import { env } from "../config/env";

export const getApiOverview = (_request: Request, response: Response): void => {
  response.status(200).json({
    name: "SalesGuard API",
    version: "1.0.0",
    environment: env.nodeEnv,
    docs: "/docs",
    health: `${env.apiPrefix}/health`
  });
};
