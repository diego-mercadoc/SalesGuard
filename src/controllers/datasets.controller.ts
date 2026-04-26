import { Request, Response } from "express";

import { prisma } from "../config/prisma";

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

export const getAllDatasets = async (_request: Request, response: Response): Promise<void> => {
  try {
    const datasets = await prisma.dataset.findMany({
      orderBy: { id: "asc" }
    });

    response.status(200).json({ datasets });
  } catch {
    response.status(500).json({
      message: "Error al obtener datasets"
    });
  }
};

export const getDatasetById = async (request: Request, response: Response): Promise<void> => {
  try {
    const id = parseDatasetId(request.params.id);

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

    response.status(200).json({ dataset });
  } catch {
    response.status(500).json({
      message: "Error al obtener dataset"
    });
  }
};

export const createDataset = async (request: Request, response: Response): Promise<void> => {
  try {
    const name = parseName(request.body.name);
    const userId = parseUserId(request.body.userId);
    const description =
      typeof request.body.description === "string" ? request.body.description.trim() : undefined;

    if (!name) {
      response.status(400).json({
        message: "Name es requerido"
      });
      return;
    }

    if (!userId) {
      response.status(400).json({
        message: "UserId es requerido"
      });
      return;
    }

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

export const updateDataset = async (request: Request, response: Response): Promise<void> => {
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

    const name = parseName(request.body.name);

    if (!name) {
      response.status(400).json({
        message: "Name es requerido"
      });
      return;
    }

    const parsedUserId =
      request.body.userId === undefined ? undefined : parseUserId(request.body.userId);

    if (request.body.userId !== undefined && !parsedUserId) {
      response.status(400).json({
        message: "UserId invalido"
      });
      return;
    }

    const userId = parsedUserId ?? undefined;

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

export const deleteDataset = async (request: Request, response: Response): Promise<void> => {
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
