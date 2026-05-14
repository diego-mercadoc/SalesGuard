import { Response } from "express";

import { prisma } from "../config/prisma";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";

const parseDatasetId = (value: unknown): number | null => {
  if (typeof value !== "string") {
    return null;
  }

  const id = Number(value);

  if (!Number.isInteger(id) || id <= 0) {
    return null;
  }

  return id;
};

const parseName = (value: unknown): string | null => {
  if (typeof value !== "string" || value.trim() === "") {
    return null;
  }

  return value.trim();
};

const parseUserId = (value: unknown): number | null => {
  const userId = Number(value);

  if (!Number.isInteger(userId) || userId <= 0) {
    return null;
  }

  return userId;
};

const isAdmin = (request: AuthenticatedRequest): boolean => request.user?.role === "admin";

const getAuthenticatedUserId = (request: AuthenticatedRequest): number | null => {
  return request.user?.id ?? null;
};

export const getAllDatasets = async (
  request: AuthenticatedRequest,
  response: Response
): Promise<void> => {
  try {
    const authenticatedUserId = getAuthenticatedUserId(request);

    if (!authenticatedUserId) {
      response.status(401).json({
        message: "Usuario no autenticado"
      });
      return;
    }

    const datasets = await prisma.dataset.findMany({
      where: isAdmin(request) ? undefined : { userId: authenticatedUserId },
      orderBy: { id: "asc" }
    });

    response.status(200).json({ datasets });
  } catch {
    response.status(500).json({
      message: "Error al obtener datasets"
    });
  }
};

export const getDatasetById = async (
  request: AuthenticatedRequest,
  response: Response
): Promise<void> => {
  try {
    const id = parseDatasetId(request.params.id);
    const authenticatedUserId = getAuthenticatedUserId(request);

    if (!authenticatedUserId) {
      response.status(401).json({
        message: "Usuario no autenticado"
      });
      return;
    }

    if (!id) {
      response.status(400).json({
        message: "Id de dataset invalido"
      });
      return;
    }

    const dataset = await prisma.dataset.findUnique({
      where: { id }
    });

    if (!dataset) {
      response.status(404).json({
        message: "Dataset no encontrado"
      });
      return;
    }

    if (!isAdmin(request) && dataset.userId !== authenticatedUserId) {
      response.status(403).json({
        message: "No tienes permiso para acceder a este dataset"
      });
      return;
    }

    response.status(200).json({ dataset });
  } catch {
    response.status(500).json({
      message: "Error al obtener dataset"
    });
  }
};

export const createDataset = async (
  request: AuthenticatedRequest,
  response: Response
): Promise<void> => {
  try {
    const authenticatedUserId = getAuthenticatedUserId(request);
    const name = parseName(request.body.name);
    const requestedUserId =
      request.body.userId === undefined ? null : parseUserId(request.body.userId);
    const description =
      typeof request.body.description === "string" ? request.body.description.trim() : undefined;

    if (!authenticatedUserId) {
      response.status(401).json({
        message: "Usuario no autenticado"
      });
      return;
    }

    if (!name) {
      response.status(400).json({
        message: "Name es requerido"
      });
      return;
    }

    if (isAdmin(request) && request.body.userId !== undefined && !requestedUserId) {
      response.status(400).json({
        message: "UserId es requerido"
      });
      return;
    }

    const userId = isAdmin(request) ? requestedUserId ?? authenticatedUserId : authenticatedUserId;

    const dataset = await prisma.dataset.create({
      data: {
        name,
        description: description === "" ? null : description,
        userId
      }
    });

    response.status(201).json({
      message: "Dataset creado correctamente",
      dataset
    });
  } catch {
    response.status(500).json({
      message: "Error al crear dataset"
    });
  }
};

export const updateDataset = async (
  request: AuthenticatedRequest,
  response: Response
): Promise<void> => {
  try {
    const id = parseDatasetId(request.params.id);
    const authenticatedUserId = getAuthenticatedUserId(request);

    if (!authenticatedUserId) {
      response.status(401).json({
        message: "Usuario no autenticado"
      });
      return;
    }

    if (!id) {
      response.status(400).json({
        message: "Id de dataset invalido"
      });
      return;
    }

    const existingDataset = await prisma.dataset.findUnique({
      where: { id }
    });

    if (!existingDataset) {
      response.status(404).json({
        message: "Dataset no encontrado"
      });
      return;
    }

    if (!isAdmin(request) && existingDataset.userId !== authenticatedUserId) {
      response.status(403).json({
        message: "No tienes permiso para modificar este dataset"
      });
      return;
    }

    const name = parseName(request.body.name);

    if (!name) {
      response.status(400).json({
        message: "Name es requerido"
      });
      return;
    }

    const parsedUserId =
      request.body.userId === undefined ? undefined : parseUserId(request.body.userId);

    if (isAdmin(request) && request.body.userId !== undefined && !parsedUserId) {
      response.status(400).json({
        message: "UserId invalido"
      });
      return;
    }

    const userId = isAdmin(request) ? parsedUserId ?? undefined : undefined;

    const description =
      typeof request.body.description === "string" ? request.body.description.trim() : undefined;

    const dataset = await prisma.dataset.update({
      where: { id },
      data: {
        name,
        description: description === undefined ? undefined : description === "" ? null : description,
        userId
      }
    });

    response.status(200).json({
      message: "Dataset actualizado correctamente",
      dataset
    });
  } catch {
    response.status(500).json({
      message: "Error al actualizar dataset"
    });
  }
};

export const deleteDataset = async (
  request: AuthenticatedRequest,
  response: Response
): Promise<void> => {
  try {
    const id = parseDatasetId(request.params.id);

    if (!id) {
      response.status(400).json({
        message: "Id de dataset invalido"
      });
      return;
    }

    const existingDataset = await prisma.dataset.findUnique({
      where: { id }
    });

    if (!existingDataset) {
      response.status(404).json({
        message: "Dataset no encontrado"
      });
      return;
    }

    await prisma.dataset.delete({
      where: { id }
    });

    response.status(200).json({
      message: "Dataset eliminado correctamente"
    });
  } catch {
    response.status(500).json({
      message: "Error al eliminar dataset"
    });
  }
};
