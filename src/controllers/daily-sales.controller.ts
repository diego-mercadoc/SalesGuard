import { Request, Response } from "express";

import { prisma } from "../config/prisma";

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

export const getAllDailySales = async (_request: Request, response: Response): Promise<void> => {
  try {
    const dailySales = await prisma.dailySales.findMany({
      orderBy: [{ date: "asc" }, { id: "asc" }]
    });

    response.status(200).json({ dailySales });
  } catch {
    response.status(500).json({
      message: "Error al obtener ventas diarias"
    });
  }
};

export const getDailySaleById = async (request: Request, response: Response): Promise<void> => {
  try {
    const id = parseId(request.params.id);

    if (!id) {
      response.status(400).json({
        message: "Id de venta diaria invalido"
      });
      return;
    }

    const dailySale = await prisma.dailySales.findUnique({
      where: { id }
    });

    if (!dailySale) {
      response.status(404).json({
        message: "Venta diaria no encontrada"
      });
      return;
    }

    response.status(200).json({ dailySale });
  } catch {
    response.status(500).json({
      message: "Error al obtener venta diaria"
    });
  }
};

export const createDailySale = async (request: Request, response: Response): Promise<void> => {
  try {
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

export const updateDailySale = async (request: Request, response: Response): Promise<void> => {
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

export const deleteDailySale = async (request: Request, response: Response): Promise<void> => {
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
