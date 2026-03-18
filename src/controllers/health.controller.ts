import { Request, Response } from "express";

import { env } from "../config/env";

export const getHealthStatus = (_request: Request, response: Response): void => {
  response.status(200).json({
    status: "ok",
    service: "salesguard-api",
    environment: env.nodeEnv
  });
};
