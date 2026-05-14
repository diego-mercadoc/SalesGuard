const mockPrisma = {
  user: {
    findUnique: jest.fn()
  },
  dataset: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn()
  }
};

jest.mock("../src/config/prisma", () => ({
  prisma: mockPrisma
}));

jest.mock("bcrypt", () => ({
  __esModule: true,
  default: {
    hash: jest.fn(),
    compare: jest.fn()
  }
}));

import bcrypt from "bcrypt";
import request from "supertest";

import { app } from "../src/app";

const mockCompare = bcrypt.compare as jest.Mock;

const buildUser = () => ({
  id: 1,
  email: "owner@example.com",
  passwordHash: "hashed-password",
  role: "user",
  createdAt: new Date("2026-05-09T12:00:00.000Z"),
  updatedAt: new Date("2026-05-09T12:00:00.000Z")
});

const buildDataset = () => ({
  id: 10,
  name: "Ventas Abril",
  description: "Dataset de ejemplo",
  userId: 1,
  createdAt: new Date("2026-05-09T12:00:00.000Z"),
  updatedAt: new Date("2026-05-09T12:00:00.000Z")
});

const loginAndGetToken = async (): Promise<string> => {
  const user = buildUser();

  mockPrisma.user.findUnique.mockResolvedValueOnce(user);
  mockCompare.mockResolvedValueOnce(true);

  const response = await request(app).post("/api/auth/login").send({
    email: user.email,
    password: "secret123"
  });

  expect(response.status).toBe(200);

  return response.body.token as string;
};

describe("Dataset endpoints", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("returns the list of datasets", async () => {
    const token = await loginAndGetToken();
    const datasets = [buildDataset()];

    mockPrisma.dataset.findMany.mockResolvedValueOnce(datasets);

    const response = await request(app)
      .get("/api/datasets")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.datasets).toEqual([
      expect.objectContaining({
        id: datasets[0].id,
        name: datasets[0].name,
        userId: datasets[0].userId
      })
    ]);
    expect(mockPrisma.dataset.findMany).toHaveBeenCalledWith({
      where: { userId: 1 },
      orderBy: { id: "asc" }
    });
  });

  it("creates a dataset successfully for the authenticated user", async () => {
    const token = await loginAndGetToken();
    const dataset = buildDataset();

    mockPrisma.dataset.create.mockResolvedValueOnce(dataset);

    const response = await request(app)
      .post("/api/datasets")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: dataset.name,
        description: dataset.description,
        userId: 999
      });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Dataset creado correctamente");
    expect(response.body.dataset).toEqual(
      expect.objectContaining({
        id: dataset.id,
        name: dataset.name,
        description: dataset.description,
        userId: dataset.userId
      })
    );
    expect(mockPrisma.dataset.create).toHaveBeenCalledWith({
      data: {
        name: dataset.name,
        description: dataset.description,
        userId: 1
      }
    });
  });

  it("returns 404 when the dataset does not exist", async () => {
    const token = await loginAndGetToken();

    mockPrisma.dataset.findUnique.mockResolvedValueOnce(null);

    const response = await request(app)
      .get("/api/datasets/999")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      message: "Dataset no encontrado"
    });
  });

  it("returns 403 when trying to access a dataset from another user", async () => {
    const token = await loginAndGetToken();

    mockPrisma.dataset.findUnique.mockResolvedValueOnce({
      ...buildDataset(),
      userId: 2
    });

    const response = await request(app)
      .get("/api/datasets/10")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      message: "No tienes permiso para acceder a este dataset"
    });
  });
});
