import { NextFunction, Request, Response } from "express";

type ErrorWithStatus = Error & {
  statusCode?: number;
};

export const errorHandler = (
  error: ErrorWithStatus,
  _request: Request,
  response: Response,
  _next: NextFunction
): void => {
  const statusCode = error.statusCode ?? 500;

  response.status(statusCode).json({
    message: error.message || "Internal server error"
  });
};
