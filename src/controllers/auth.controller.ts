import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { env } from "../config/env";
import { prisma } from "../config/prisma";
import { AuthenticatedRequest, AuthUser } from "../middlewares/auth.middleware";

const SALT_ROUNDS = 10;

const createToken = (user: AuthUser): string => {
  return jwt.sign(user, env.jwtSecret, { expiresIn: "7d" });
};

const formatUser = (user: {
  id: number;
  email: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}) => {
  return {
    id: user.id,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
};

const validateEmail = (email: unknown): string | null => {
  if (typeof email !== "string" || email.trim() === "") {
    return null;
  }

  return email.trim().toLowerCase();
};

const validatePassword = (password: unknown): string | null => {
  if (typeof password !== "string" || password === "") {
    return null;
  }

  return password;
};

export const registerUser = async (request: Request, response: Response): Promise<void> => {
  const email = validateEmail(request.body.email);
  const password = validatePassword(request.body.password);

  if (!email) {
    response.status(400).json({
      message: "Email requerido"
    });
    return;
  }

  if (!password) {
    response.status(400).json({
      message: "Password requerido"
    });
    return;
  }

  if (password.length < 6) {
    response.status(400).json({
      message: "Password minimo 6 caracteres"
    });
    return;
  }

  const existingUser = await prisma.user.findUnique({
    where: { email }
  });

  if (existingUser) {
    response.status(409).json({
      message: "El email ya esta registrado"
    });
    return;
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash
    }
  });

  const token = createToken({
    id: user.id,
    email: user.email,
    role: user.role
  });

  response.status(201).json({
    message: "Usuario registrado correctamente",
    token,
    user: formatUser(user)
  });
};

export const loginUser = async (request: Request, response: Response): Promise<void> => {
  const email = validateEmail(request.body.email);
  const password = validatePassword(request.body.password);

  if (!email) {
    response.status(400).json({
      message: "Email requerido"
    });
    return;
  }

  if (!password) {
    response.status(400).json({
      message: "Password requerido"
    });
    return;
  }

  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    response.status(401).json({
      message: "Credenciales invalidas"
    });
    return;
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);

  if (!passwordMatches) {
    response.status(401).json({
      message: "Credenciales invalidas"
    });
    return;
  }

  const token = createToken({
    id: user.id,
    email: user.email,
    role: user.role
  });

  response.status(200).json({
    message: "Login exitoso",
    token,
    user: formatUser(user)
  });
};

export const getAuthenticatedUser = async (
  request: AuthenticatedRequest,
  response: Response
): Promise<void> => {
  if (!request.user) {
    response.status(401).json({
      message: "Token invalido"
    });
    return;
  }

  const user = await prisma.user.findUnique({
    where: { id: request.user.id }
  });

  if (!user) {
    response.status(404).json({
      message: "Usuario no encontrado"
    });
    return;
  }

  response.status(200).json({
    user: formatUser(user)
  });
};
