import { NextFunction, Response } from "express";

import { AuthenticatedRequest } from "./auth.middleware";

export const requireAdmin = (
  request: AuthenticatedRequest,
  response: Response,
  next: NextFunction
): void => {
  if (!request.user) {
    response.status(401).json({
      message: "Usuario no autenticado"
    });
    return;
  }

  if (request.user.role !== "admin") {
    response.status(403).json({
      message: "Permiso de administrador requerido"
    });
    return;
  }

  next();
};
