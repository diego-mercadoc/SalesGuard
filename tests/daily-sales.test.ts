import jwt from "jsonwebtoken";
import request from "supertest";

jest.mock("../src/config/prisma", () => ({
  prisma: {
    dataset: {
      findUnique: jest.fn()
    },
    dailySales: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn()
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
  dailySales: {
    findMany: jest.Mock;
    findUnique: jest.Mock;
    create: jest.Mock;
  };
};

describe("Daily sales endpoints", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("GET /api/daily-sales returns daily sales records", async () => {
    mockedPrisma.dailySales.findMany.mockResolvedValue([
      {
        id: 1,
        datasetId: 10,
        date: new Date("2026-04-01T00:00:00.000Z"),
        dailySales: "1500.50"
      }
    ]);

    const response = await request(app).get("/api/daily-sales").set(authHeader);

    expect(response.status).toBe(200);
    expect(response.body.dailySales).toHaveLength(1);
    expect(response.body.dailySales[0]).toMatchObject({
      id: 1,
      datasetId: 10,
      dailySales: "1500.50"
    });
    expect(mockedPrisma.dailySales.findMany).toHaveBeenCalledWith({
      where: undefined,
      orderBy: [{ date: "asc" }, { id: "asc" }]
    });
  });

  it("POST /api/daily-sales creates a daily sale", async () => {
    mockedPrisma.dataset.findUnique.mockResolvedValue({
      id: 10,
      name: "Ventas abril"
    });
    mockedPrisma.dailySales.create.mockResolvedValue({
      id: 1,
      datasetId: 10,
      date: new Date("2026-04-01T00:00:00.000Z"),
      dailySales: "1500.50"
    });

    const response = await request(app).post("/api/daily-sales").set(authHeader).send({
      datasetId: "10",
      date: "2026-04-01",
      dailySales: 1500.5
    });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Venta diaria creada correctamente");
    expect(response.body.dailySale).toMatchObject({
      id: 1,
      datasetId: 10,
      dailySales: "1500.50"
    });
    expect(mockedPrisma.dailySales.create).toHaveBeenCalledWith({
      data: {
        datasetId: 10,
        date: new Date("2026-04-01T00:00:00.000Z"),
        dailySales: 1500.5
      }
    });
  });

  it("GET /api/daily-sales/:id returns 404 when the record does not exist", async () => {
    mockedPrisma.dailySales.findUnique.mockResolvedValue(null);

    const response = await request(app).get("/api/daily-sales/999").set(authHeader);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Venta diaria no encontrada");
  });

  it("POST /api/daily-sales validates required data", async () => {
    const response = await request(app).post("/api/daily-sales").set(authHeader).send({
      date: "2026-04-01",
      dailySales: 1500.5
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("DatasetId es requerido");
    expect(mockedPrisma.dailySales.create).not.toHaveBeenCalled();
  });
});
