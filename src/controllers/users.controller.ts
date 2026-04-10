import { Request, Response } from "express";

import { prisma } from "../config/prisma";

const parseId = (value: string | string[] | undefined): number | null => {
  if (!value || Array.isArray(value)) {
    return null;
  }

  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
};

const isValidEmail = (email: string): boolean => email.includes("@") && email.includes(".");

export const listUsers = async (_request: Request, response: Response): Promise<void> => {
  const users = await prisma.user.findMany({
    orderBy: { id: "asc" },
    select: {
      id: true,
      email: true,
      role: true,
      createdAt: true
    }
  });

  response.status(200).json({ users });
};

export const getUserById = async (request: Request, response: Response): Promise<void> => {
  const id = parseId(request.params.id);

  if (!id) {
    response.status(400).json({ message: "Invalid user id" });
    return;
  }

  const user = await prisma.user.findUnique({
    where: { id },
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

export const updateUser = async (request: Request, response: Response): Promise<void> => {
  const id = parseId(request.params.id);
  const { email, role } = request.body;

  if (!id) {
    response.status(400).json({ message: "Invalid user id" });
    return;
  }

  if (!email && !role) {
    response.status(400).json({ message: "Email or role is required" });
    return;
  }

  if (email && !isValidEmail(email)) {
    response.status(400).json({ message: "Email format is invalid" });
    return;
  }

  const user = await prisma.user.update({
    where: { id },
    data: {
      ...(email ? { email } : {}),
      ...(role ? { role } : {})
    },
    select: {
      id: true,
      email: true,
      role: true,
      createdAt: true
    }
  });

  response.status(200).json({ user });
};

export const deleteUser = async (request: Request, response: Response): Promise<void> => {
  const id = parseId(request.params.id);

  if (!id) {
    response.status(400).json({ message: "Invalid user id" });
    return;
  }

  await prisma.user.delete({ where: { id } });

  response.status(204).send();
};
