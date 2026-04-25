import { Request, Response } from "express";
import bcrypt from "bcrypt";

import { prisma } from "../config/prisma";

const SALT_ROUNDS = 10;

export const getAllUsers = async (_request: Request, response: Response): Promise<void> => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { id: "asc" },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });

    response.status(200).json({ users });
  } catch {
    response.status(500).json({
      message: "Error al obtener usuarios"
    });
  }
};

export const getUserById = async (request: Request, response: Response): Promise<void> => {
  try {
    const id = Number(request.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      response.status(400).json({
        message: "Id de usuario invalido"
      });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      response.status(404).json({
        message: "Usuario no encontrado"
      });
      return;
    }

    response.status(200).json({ user });
  } catch {
    response.status(500).json({
      message: "Error al obtener usuario"
    });
  }
};

export const createUser = async (request: Request, response: Response): Promise<void> => {
  try {
    const { email, password, role } = request.body;

    if (!email || !password) {
      response.status(400).json({
        message: "Email y password son requeridos"
      });
      return;
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        role
      },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });

    response.status(201).json({
      message: "Usuario creado correctamente",
      user
    });
  } catch {
    response.status(500).json({
      message: "Error al crear usuario"
    });
  }
};

export const updateUser = async (request: Request, response: Response): Promise<void> => {
  try {
    const id = Number(request.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      response.status(400).json({
        message: "Id de usuario invalido"
      });
      return;
    }

    const existingUser = await prisma.user.findUnique({
      where: { id }
    });

    if (!existingUser) {
      response.status(404).json({
        message: "Usuario no encontrado"
      });
      return;
    }

    const { email, password, role } = request.body;
    const data: {
      email?: string;
      passwordHash?: string;
      role?: string;
    } = {};

    if (email) {
      data.email = email;
    }

    if (role) {
      data.role = role;
    }

    if (password) {
      data.passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    }

    const user = await prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });

    response.status(200).json({
      message: "Usuario actualizado correctamente",
      user
    });
  } catch {
    response.status(500).json({
      message: "Error al actualizar usuario"
    });
  }
};

export const deleteUser = async (request: Request, response: Response): Promise<void> => {
  try {
    const id = Number(request.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      response.status(400).json({
        message: "Id de usuario invalido"
      });
      return;
    }

    const existingUser = await prisma.user.findUnique({
      where: { id }
    });

    if (!existingUser) {
      response.status(404).json({
        message: "Usuario no encontrado"
      });
      return;
    }

    await prisma.user.delete({
      where: { id }
    });

    response.status(200).json({
      message: "Usuario eliminado correctamente"
    });
  } catch {
    response.status(500).json({
      message: "Error al eliminar usuario"
    });
  }
};
