import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { env } from "../config/env";
import { prisma } from "../config/prisma";
import { AuthenticatedRequest, AuthUser } from "../middlewares/auth.middleware";

const SALT_ROUNDS = 10;
const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v2/userinfo";

type GoogleTokenResponse = {
  access_token?: string;
  error?: string;
  error_description?: string;
};

type GoogleProfileResponse = {
  email?: string;
  verified_email?: boolean;
};

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

const getGoogleConfig = (response: Response) => {
  if (!env.googleClientId || !env.googleClientSecret || !env.googleRedirectUri) {
    response.status(400).json({
      message: "Google OAuth no esta configurado"
    });
    return null;
  }

  return {
    clientId: env.googleClientId,
    clientSecret: env.googleClientSecret,
    redirectUri: env.googleRedirectUri
  };
};

const redirectWithParams = (response: Response, target: string, params: Record<string, string>) => {
  const redirectUrl = new URL(target);

  Object.entries(params).forEach(([key, value]) => {
    redirectUrl.searchParams.set(key, value);
  });

  response.redirect(redirectUrl.toString());
};

const sendGoogleError = (response: Response, message: string, statusCode = 400): void => {
  if (env.googleAuthFailureRedirect) {
    redirectWithParams(response, env.googleAuthFailureRedirect, { message });
    return;
  }

  response.status(statusCode).json({ message });
};

const createGooglePasswordHash = async (email: string): Promise<string> => {
  return bcrypt.hash(`google:${email}:${Date.now()}`, SALT_ROUNDS);
};

const findOrCreateGoogleUser = async (email: string) => {
  const existingUser = await prisma.user.findUnique({
    where: { email }
  });

  if (existingUser) {
    return existingUser;
  }

  return prisma.user.create({
    data: {
      email,
      passwordHash: await createGooglePasswordHash(email)
    }
  });
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

export const startGoogleLogin = (_request: Request, response: Response): void => {
  const googleConfig = getGoogleConfig(response);

  if (!googleConfig) {
    return;
  }

  const authUrl = new URL(GOOGLE_AUTH_URL);
  authUrl.searchParams.set("client_id", googleConfig.clientId);
  authUrl.searchParams.set("redirect_uri", googleConfig.redirectUri);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("scope", "openid email profile");

  response.redirect(authUrl.toString());
};

export const googleCallback = async (request: Request, response: Response): Promise<void> => {
  const googleConfig = getGoogleConfig(response);

  if (!googleConfig) {
    return;
  }

  if (typeof request.query.error === "string") {
    sendGoogleError(response, `Google rechazo el login: ${request.query.error}`);
    return;
  }

  if (typeof request.query.code !== "string" || request.query.code.trim() === "") {
    sendGoogleError(response, "Code de Google requerido");
    return;
  }

  try {
    const tokenResponse = await fetch(GOOGLE_TOKEN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
        code: request.query.code,
        client_id: googleConfig.clientId,
        client_secret: googleConfig.clientSecret,
        redirect_uri: googleConfig.redirectUri,
        grant_type: "authorization_code"
      })
    });

    const tokenBody = (await tokenResponse.json()) as GoogleTokenResponse;

    if (!tokenResponse.ok || !tokenBody.access_token) {
      sendGoogleError(
        response,
        tokenBody.error_description ?? tokenBody.error ?? "No se pudo obtener token de Google",
        401
      );
      return;
    }

    const profileResponse = await fetch(GOOGLE_USERINFO_URL, {
      headers: {
        Authorization: `Bearer ${tokenBody.access_token}`
      }
    });

    const profile = (await profileResponse.json()) as GoogleProfileResponse;
    const email = validateEmail(profile.email);

    if (!profileResponse.ok || !email || profile.verified_email === false) {
      sendGoogleError(response, "No se pudo obtener un email valido de Google", 401);
      return;
    }

    const user = await findOrCreateGoogleUser(email);
    const token = createToken({
      id: user.id,
      email: user.email,
      role: user.role
    });

    if (env.googleAuthSuccessRedirect) {
      redirectWithParams(response, env.googleAuthSuccessRedirect, {
        token,
        userId: String(user.id),
        email: user.email
      });
      return;
    }

    response.status(200).json({
      message: "Login con Google exitoso",
      token,
      user: formatUser(user)
    });
  } catch (error) {
    console.error("Google login callback error", error);

    if (env.nodeEnv !== "production") {
      const detail = error instanceof Error ? error.message : String(error);

      response.status(500).json({
        message: "Error al completar login con Google",
        detail
      });
      return;
    }

    sendGoogleError(response, "Error al completar login con Google", 500);
  }
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
