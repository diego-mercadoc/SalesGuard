import jwt from "jsonwebtoken";
import request from "supertest";

jest.mock("../src/config/prisma", () => ({
  prisma: {
    dataset: {
      findUnique: jest.fn()
    },
    anomaly: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      deleteMany: jest.fn(),
      createMany: jest.fn()
    }
  }
}));

import { app } from "../src/app";
import { prisma } from "../src/config/prisma";

const authToken = jwt.sign(
  {
    id: 1,
    email: "student@example.com",
    role: "admin"
  },
  "salesguard-secret"
);

const authHeader = { Authorization: `Bearer ${authToken}` };

const mockedPrisma = prisma as unknown as {
  dataset: {
    findUnique: jest.Mock;
  };
  anomaly: {
    findMany: jest.Mock;
    findUnique: jest.Mock;
    deleteMany: jest.Mock;
    createMany: jest.Mock;
  };
};

describe("Anomalies endpoints", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "log").mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("GET /api/anomalies returns anomalies", async () => {
    mockedPrisma.anomaly.findMany.mockResolvedValue([
      {
        id: 1,
        datasetId: 10,
        date: new Date("2026-04-06T00:00:00.000Z"),
        value: "400.00",
        score: "2.2361",
        severity: "medium"
      }
    ]);

    const response = await request(app).get("/api/anomalies").set(authHeader);

    expect(response.status).toBe(200);
    expect(response.body.anomalies).toHaveLength(1);
    expect(response.body.anomalies[0]).toMatchObject({
      id: 1,
      datasetId: 10,
      value: "400.00",
      score: "2.2361",
      severity: "medium"
    });
  });

  it("GET /api/anomalies/:id returns 404 when the anomaly does not exist", async () => {
    mockedPrisma.anomaly.findUnique.mockResolvedValue(null);

    const response = await request(app).get("/api/anomalies/999").set(authHeader);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Anomalia no encontrada");
  });

  it("POST /api/anomalies/run/:datasetId runs z-score analysis for a valid dataset", async () => {
    mockedPrisma.dataset.findUnique.mockResolvedValue({
      id: 10,
      name: "Ventas abril",
      user: {
        email: "owner@example.com"
      },
      dailySales: [
        { date: new Date("2026-04-01T00:00:00.000Z"), dailySales: "100.00" },
        { date: new Date("2026-04-02T00:00:00.000Z"), dailySales: "100.00" },
        { date: new Date("2026-04-03T00:00:00.000Z"), dailySales: "100.00" },
        { date: new Date("2026-04-04T00:00:00.000Z"), dailySales: "100.00" },
        { date: new Date("2026-04-05T00:00:00.000Z"), dailySales: "100.00" },
        { date: new Date("2026-04-06T00:00:00.000Z"), dailySales: "400.00" }
      ]
    });
    mockedPrisma.anomaly.deleteMany.mockResolvedValue({ count: 0 });
    mockedPrisma.anomaly.createMany.mockResolvedValue({ count: 1 });

    const response = await request(app).post("/api/anomalies/run/10").set(authHeader);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "Analisis de anomalias ejecutado correctamente",
      summary: {
        datasetId: 10,
        datasetName: "Ventas abril",
        totalRecords: 6,
        average: 150,
        standardDeviation: 111.8034,
        anomaliesDetected: 1,
        email: {
          mode: "demo",
          recipient: "owner@example.com",
          message: "No hay SMTP configurado. El email se registro en consola"
        }
      },
      anomalies: [
        {
          date: "2026-04-06",
          value: 400,
          score: 2.2361,
          severity: "medium"
        }
      ]
    });
    expect(mockedPrisma.anomaly.deleteMany).toHaveBeenCalledWith({
      where: { datasetId: 10 }
    });
    expect(mockedPrisma.anomaly.createMany).toHaveBeenCalledWith({
      data: [
        {
          datasetId: 10,
          date: new Date("2026-04-06T00:00:00.000Z"),
          value: 400,
          score: 2.2361,
          severity: "medium"
        }
      ]
    });
  });

  it("POST /api/anomalies/run/:datasetId returns 404 for a missing dataset", async () => {
    mockedPrisma.dataset.findUnique.mockResolvedValue(null);

    const response = await request(app).post("/api/anomalies/run/999").set(authHeader);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Dataset no encontrado");
    expect(mockedPrisma.anomaly.deleteMany).not.toHaveBeenCalled();
  });
});
