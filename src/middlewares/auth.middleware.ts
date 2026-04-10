import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { env } from "../config/env";

type AuthPayload = {
  userId: number;
  role: string;
};

export const authMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
): void => {
  const authHeader = request.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    response.status(401).json({ message: "Authorization token is required" });
    return;
  }

  const token = authHeader.replace("Bearer ", "");

  try {
    const payload = jwt.verify(token, env.jwtSecret) as AuthPayload;
    response.locals.user = payload;
    next();
  } catch {
    response.status(401).json({ message: "Invalid or expired token" });
  }
};
