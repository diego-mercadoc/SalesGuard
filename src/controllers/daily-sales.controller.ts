import { Response } from "express";

import { prisma } from "../config/prisma";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";

const parseId = (value: unknown): number | null => {
  if (typeof value !== "string") {
    return null;
  }

  const id = Number(value);

  if (!Number.isInteger(id) || id <= 0) {
    return null;
  }

  return id;
};

const parseDate = (value: unknown): Date | null => {
  if (typeof value !== "string") {
    return null;
  }

  const trimmedValue = value.trim();

  if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmedValue)) {
    return null;
  }

  const [year, month, day] = trimmedValue.split("-").map(Number);
  const parsedDate = new Date(Date.UTC(year, month - 1, day));

  if (
    parsedDate.getUTCFullYear() !== year ||
    parsedDate.getUTCMonth() !== month - 1 ||
    parsedDate.getUTCDate() !== day
  ) {
    return null;
  }

  return parsedDate;
};

const parseDailySalesValue = (value: unknown): number | null => {
  const dailySales = Number(value);

  if (!Number.isFinite(dailySales) || dailySales < 0) {
    return null;
  }

  return Number(dailySales.toFixed(2));
};

const isAdmin = (request: AuthenticatedRequest): boolean => request.user?.role === "admin";

const getAuthenticatedUserId = (request: AuthenticatedRequest): number | null => {
  return request.user?.id ?? null;
};

export const getAllDailySales = async (
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

    const dailySales = await prisma.dailySales.findMany({
      where: isAdmin(request) ? undefined : { dataset: { userId: authenticatedUserId } },
      orderBy: [{ date: "asc" }, { id: "asc" }]
    });

    response.status(200).json({ dailySales });
  } catch {
    response.status(500).json({
      message: "Error al obtener ventas diarias"
    });
  }
};

export const getDailySaleById = async (
  request: AuthenticatedRequest,
  response: Response
): Promise<void> => {
  try {
    const id = parseId(request.params.id);
    const authenticatedUserId = getAuthenticatedUserId(request);

    if (!authenticatedUserId) {
      response.status(401).json({
        message: "Usuario no autenticado"
      });
      return;
    }

    if (!id) {
      response.status(400).json({
        message: "Id de venta diaria invalido"
      });
      return;
    }

    const dailySale = await prisma.dailySales.findUnique({
      where: { id },
      include: {
        dataset: {
          select: {
            userId: true
          }
        }
      }
    });

    if (!dailySale) {
      response.status(404).json({
        message: "Venta diaria no encontrada"
      });
      return;
    }

    if (!isAdmin(request) && dailySale.dataset.userId !== authenticatedUserId) {
      response.status(403).json({
        message: "No tienes permiso para acceder a esta venta diaria"
      });
      return;
    }

    const { dataset, ...dailySaleData } = dailySale;

    response.status(200).json({ dailySale: dailySaleData });
  } catch {
    response.status(500).json({
      message: "Error al obtener venta diaria"
    });
  }
};

export const createDailySale = async (
  request: AuthenticatedRequest,
  response: Response
): Promise<void> => {
  try {
    const authenticatedUserId = getAuthenticatedUserId(request);
    const datasetId = parseId(request.body.datasetId);
    const date = parseDate(request.body.date);
    const dailySales = parseDailySalesValue(request.body.dailySales);

    if (!authenticatedUserId) {
      response.status(401).json({
        message: "Usuario no autenticado"
      });
      return;
    }

    if (!datasetId) {
      response.status(400).json({
        message: "DatasetId es requerido"
      });
      return;
    }

    if (!date) {
      response.status(400).json({
        message: "Date es requerida y debe tener formato YYYY-MM-DD"
      });
      return;
    }

    if (dailySales === null) {
      response.status(400).json({
        message: "DailySales es requerido"
      });
      return;
    }

    const dataset = await prisma.dataset.findUnique({
      where: { id: datasetId }
    });

    if (!dataset) {
      response.status(404).json({
        message: "Dataset no encontrado"
      });
      return;
    }

    if (!isAdmin(request) && dataset.userId !== authenticatedUserId) {
      response.status(403).json({
        message: "No tienes permiso para registrar ventas en este dataset"
      });
      return;
    }

    const createdDailySale = await prisma.dailySales.create({
      data: {
        datasetId,
        date,
        dailySales
      }
    });

    response.status(201).json({
      message: "Venta diaria creada correctamente",
      dailySale: createdDailySale
    });
  } catch {
    response.status(500).json({
      message: "Error al crear venta diaria"
    });
  }
};

export const updateDailySale = async (
  request: AuthenticatedRequest,
  response: Response
): Promise<void> => {
  try {
    const id = parseId(request.params.id);
    const authenticatedUserId = getAuthenticatedUserId(request);

    if (!authenticatedUserId) {
      response.status(401).json({
        message: "Usuario no autenticado"
      });
      return;
    }

    if (!id) {
      response.status(400).json({
        message: "Id de venta diaria invalido"
      });
      return;
    }

    const existingDailySale = await prisma.dailySales.findUnique({
      where: { id },
      include: {
        dataset: {
          select: {
            userId: true
          }
        }
      }
    });

    if (!existingDailySale) {
      response.status(404).json({
        message: "Venta diaria no encontrada"
      });
      return;
    }

    if (!isAdmin(request) && existingDailySale.dataset.userId !== authenticatedUserId) {
      response.status(403).json({
        message: "No tienes permiso para modificar esta venta diaria"
      });
      return;
    }

    const datasetId = parseId(request.body.datasetId);
    const date = parseDate(request.body.date);
    const dailySales = parseDailySalesValue(request.body.dailySales);

    if (!datasetId) {
      response.status(400).json({
        message: "DatasetId es requerido"
      });
      return;
    }

    if (!date) {
      response.status(400).json({
        message: "Date es requerida y debe tener formato YYYY-MM-DD"
      });
      return;
    }

    if (dailySales === null) {
      response.status(400).json({
        message: "DailySales es requerido"
      });
      return;
    }

    const dataset = await prisma.dataset.findUnique({
      where: { id: datasetId }
    });

    if (!dataset) {
      response.status(404).json({
        message: "Dataset no encontrado"
      });
      return;
    }

    if (!isAdmin(request) && dataset.userId !== authenticatedUserId) {
      response.status(403).json({
        message: "No tienes permiso para mover esta venta a otro dataset"
      });
      return;
    }

    const updatedDailySale = await prisma.dailySales.update({
      where: { id },
      data: {
        datasetId,
        date,
        dailySales
      }
    });

    response.status(200).json({
      message: "Venta diaria actualizada correctamente",
      dailySale: updatedDailySale
    });
  } catch {
    response.status(500).json({
      message: "Error al actualizar venta diaria"
    });
  }
};

export const deleteDailySale = async (
  request: AuthenticatedRequest,
  response: Response
): Promise<void> => {
  try {
    const id = parseId(request.params.id);

    if (!id) {
      response.status(400).json({
        message: "Id de venta diaria invalido"
      });
      return;
    }

    const existingDailySale = await prisma.dailySales.findUnique({
      where: { id }
    });

    if (!existingDailySale) {
      response.status(404).json({
        message: "Venta diaria no encontrada"
      });
      return;
    }

    await prisma.dailySales.delete({
      where: { id }
    });

    response.status(200).json({
      message: "Venta diaria eliminada correctamente"
    });
  } catch {
    response.status(500).json({
      message: "Error al eliminar venta diaria"
    });
  }
};
