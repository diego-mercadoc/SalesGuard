import bcrypt from "bcrypt";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";

import { env } from "../config/env";
import { prisma } from "../config/prisma";

const isValidEmail = (email: string): boolean => email.includes("@") && email.includes(".");

const buildToken = (userId: number, role: string): string => {
  return jwt.sign({ userId, role }, env.jwtSecret, { expiresIn: "1d" });
};

export const registerUser = async (request: Request, response: Response): Promise<void> => {
  const { email, password } = request.body;

  if (!email || !password) {
    response.status(400).json({ message: "Email and password are required" });
    return;
  }

  if (!isValidEmail(email)) {
    response.status(400).json({ message: "Email format is invalid" });
    return;
  }

  if (password.length < 6) {
    response.status(400).json({ message: "Password must have at least 6 characters" });
    return;
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    response.status(409).json({ message: "Email is already registered" });
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash
    },
    select: {
      id: true,
      email: true,
      role: true,
      createdAt: true
    }
  });

  response.status(201).json({
    user,
    token: buildToken(user.id, user.role)
  });
};

export const loginUser = async (request: Request, response: Response): Promise<void> => {
  const { email, password } = request.body;

  if (!email || !password) {
    response.status(400).json({ message: "Email and password are required" });
    return;
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    response.status(401).json({ message: "Invalid credentials" });
    return;
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);

  if (!passwordMatches) {
    response.status(401).json({ message: "Invalid credentials" });
    return;
  }

  response.status(200).json({
    user: {
      id: user.id,
      email: user.email,
      role: user.role
    },
    token: buildToken(user.id, user.role)
  });
};

export const getCurrentUser = async (request: Request, response: Response): Promise<void> => {
  const authUser = response.locals.user as { userId: number };
  const user = await prisma.user.findUnique({
    where: { id: authUser.userId },
    select: {
      id: true,
      email: true,
      role: true,
      createdAt: true
    }
  });

  if (!user) {
    response.status(404).json({ message: "User not found" });
    return;
  }

  response.status(200).json({ user });
};
