import { Request, Response } from "express";

import { prisma } from "../config/prisma";

const parseOptionalString = (value: string | undefined): string | undefined => {
  if (!value) {
    return undefined;
  }

  const trimmedValue = value.trim();

  return trimmedValue === "" ? undefined : trimmedValue;
};

const parseOptionalPort = (value: string | undefined): number => {
  if (!value) {
    return 587;
  }

  const parsedPort = Number(value);

  if (Number.isNaN(parsedPort) || parsedPort <= 0) {
    return 587;
  }

  return parsedPort;
};

const getEmailConfig = () => ({
  host: parseOptionalString(process.env.EMAIL_HOST),
  port: parseOptionalPort(process.env.EMAIL_PORT),
  user: parseOptionalString(process.env.EMAIL_USER),
  pass: parseOptionalString(process.env.EMAIL_PASS),
  from: parseOptionalString(process.env.EMAIL_FROM) ?? "salesguard@example.com"
});

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

const roundNumber = (value: number, digits: number): number => Number(value.toFixed(digits));

const getSeverity = (score: number): string => {
  const absoluteScore = Math.abs(score);

  if (absoluteScore >= 3) {
    return "high";
  }

  return "medium";
};

const sendAnomaliesEmail = async (
  recipient: string | undefined,
  datasetName: string,
  anomaliesCount: number,
  average: number,
  standardDeviation: number
): Promise<{ mode: string; recipient: string | null; message: string }> => {
  if (!recipient) {
    return {
      mode: "skipped",
      recipient: null,
      message: "El dataset no tiene un email de usuario asociado"
    };
  }

  const subject = `SalesGuard: ${anomaliesCount} anomalia(s) detectada(s) en ${datasetName}`;
  const text = [
    `Se detectaron ${anomaliesCount} anomalia(s) en el dataset "${datasetName}".`,
    `Promedio: ${average}`,
    `Desviacion estandar: ${standardDeviation}`
  ].join("\n");

  const emailConfig = getEmailConfig();

  if (!emailConfig.host) {
    console.log("SalesGuard email demo", {
      to: recipient,
      subject,
      text
    });

    return {
      mode: "demo",
      recipient,
      message: "No hay SMTP configurado. El email se registro en consola"
    };
  }

  const nodemailer = require("nodemailer");
  const transporter = nodemailer.createTransport({
    host: emailConfig.host,
    port: emailConfig.port,
    secure: emailConfig.port === 465,
    auth:
      emailConfig.user && emailConfig.pass
        ? {
            user: emailConfig.user,
            pass: emailConfig.pass
          }
        : undefined
  });

  await transporter.sendMail({
    from: emailConfig.from,
    to: recipient,
    subject,
    text
  });

  return {
    mode: "smtp",
    recipient,
    message: "Email enviado correctamente"
  };
};

export const getAllAnomalies = async (_request: Request, response: Response): Promise<void> => {
  try {
    const anomalies = await prisma.anomaly.findMany({
      orderBy: [{ date: "asc" }, { id: "asc" }]
    });

    response.status(200).json({ anomalies });
  } catch {
    response.status(500).json({
      message: "Error al obtener anomalias"
    });
  }
};

export const getAnomalyById = async (request: Request, response: Response): Promise<void> => {
  try {
    const id = parseId(request.params.id);

    if (!id) {
      response.status(400).json({
        message: "Id de anomalia invalido"
      });
      return;
    }

    const anomaly = await prisma.anomaly.findUnique({
      where: { id }
    });

    if (!anomaly) {
      response.status(404).json({
        message: "Anomalia no encontrada"
      });
      return;
    }

    response.status(200).json({ anomaly });
  } catch {
    response.status(500).json({
      message: "Error al obtener anomalia"
    });
  }
};

export const runAnomalyAnalysis = async (request: Request, response: Response): Promise<void> => {
  try {
    const datasetId = parseId(request.params.datasetId);

    if (!datasetId) {
      response.status(400).json({
        message: "DatasetId invalido"
      });
      return;
    }

    const dataset = await prisma.dataset.findUnique({
      where: { id: datasetId },
      include: {
        user: {
          select: {
            email: true
          }
        },
        dailySales: {
          orderBy: {
            date: "asc"
          }
        }
      }
    });

    if (!dataset) {
      response.status(404).json({
        message: "Dataset no encontrado"
      });
      return;
    }

    if (dataset.dailySales.length === 0) {
      response.status(400).json({
        message: "El dataset no tiene ventas diarias registradas"
      });
      return;
    }

    const values = dataset.dailySales.map((item) => Number(item.dailySales));
    const total = values.reduce((sum, value) => sum + value, 0);
    const average = total / values.length;
    const variance =
      values.reduce((sum, value) => sum + (value - average) ** 2, 0) / values.length;
    const standardDeviation = Math.sqrt(variance);

    const detectedAnomalies = dataset.dailySales.reduce<
      Array<{
        datasetId: number;
        date: Date;
        value: number;
        score: number;
        severity: string;
      }>
    >((result, item) => {
      const currentValue = Number(item.dailySales);
      const score = standardDeviation === 0 ? 0 : (currentValue - average) / standardDeviation;

      if (Math.abs(score) < 2) {
        return result;
      }

      result.push({
        datasetId,
        date: item.date,
        value: roundNumber(currentValue, 2),
        score: roundNumber(score, 4),
        severity: getSeverity(score)
      });

      return result;
    }, []);

    await prisma.anomaly.deleteMany({
      where: { datasetId }
    });

    if (detectedAnomalies.length > 0) {
      await prisma.anomaly.createMany({
        data: detectedAnomalies
      });
    }

    let email: { mode: string; recipient: string | null; message: string } = {
      mode: "not-sent",
      recipient: dataset.user.email ?? null,
      message: "No se detectaron anomalias"
    };

    if (detectedAnomalies.length > 0) {
      try {
        email = await sendAnomaliesEmail(
          dataset.user.email,
          dataset.name,
          detectedAnomalies.length,
          roundNumber(average, 2),
          roundNumber(standardDeviation, 4)
        );
      } catch {
        email = {
          mode: "error",
          recipient: dataset.user.email ?? null,
          message: "Las anomalias se guardaron, pero no se pudo enviar el email"
        };
      }
    }

    response.status(200).json({
      message: "Analisis de anomalias ejecutado correctamente",
      summary: {
        datasetId: dataset.id,
        datasetName: dataset.name,
        totalRecords: dataset.dailySales.length,
        average: roundNumber(average, 2),
        standardDeviation: roundNumber(standardDeviation, 4),
        anomaliesDetected: detectedAnomalies.length,
        email
      },
      anomalies: detectedAnomalies.map((item) => ({
        date: item.date.toISOString().slice(0, 10),
        value: item.value,
        score: item.score,
        severity: item.severity
      }))
    });
  } catch {
    response.status(500).json({
      message: "Error al ejecutar analisis de anomalias"
    });
  }
};
