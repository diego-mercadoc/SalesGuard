import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

import { env } from "../config/env";

export type AuthUser = {
  id: number;
  email: string;
  role: string;
};

export type AuthenticatedRequest = Request & {
  user?: AuthUser;
};

type TokenPayload = JwtPayload & AuthUser;

export const authenticateToken = (
  request: AuthenticatedRequest,
  response: Response,
  next: NextFunction
): void => {
  const authorizationHeader = request.headers.authorization;

  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
    response.status(401).json({
      message: "Token faltante"
    });
    return;
  }

  const token = authorizationHeader.replace("Bearer ", "");

  try {
    const decodedToken = jwt.verify(token, env.jwtSecret) as TokenPayload;

    request.user = {
      id: decodedToken.id,
      email: decodedToken.email,
      role: decodedToken.role
    };

    next();
  } catch {
    response.status(401).json({
      message: "Token invalido"
    });
  }
};
