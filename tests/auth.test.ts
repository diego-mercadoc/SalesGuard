const mockPrisma = {
  user: {
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

const mockHash = bcrypt.hash as jest.Mock;
const mockCompare = bcrypt.compare as jest.Mock;

const buildUser = () => ({
  id: 1,
  email: "ana@example.com",
  passwordHash: "hashed-password",
  role: "user",
  createdAt: new Date("2026-05-09T12:00:00.000Z"),
  updatedAt: new Date("2026-05-09T12:00:00.000Z")
});

describe("Auth endpoints", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("registers a user successfully", async () => {
    const user = buildUser();

    mockPrisma.user.findUnique.mockResolvedValueOnce(null);
    mockHash.mockResolvedValueOnce(user.passwordHash);
    mockPrisma.user.create.mockResolvedValueOnce(user);

    const response = await request(app).post("/api/auth/register").send({
      email: user.email,
      password: "secret123"
    });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Usuario registrado correctamente");
    expect(response.body.token).toEqual(expect.any(String));
    expect(response.body.user).toEqual(
      expect.objectContaining({
        id: user.id,
        email: user.email,
        role: user.role,
        createdAt: expect.any(String),
        updatedAt: expect.any(String)
      })
    );
  });

  it("logs in a user successfully", async () => {
    const user = buildUser();

    mockPrisma.user.findUnique.mockResolvedValueOnce(user);
    mockCompare.mockResolvedValueOnce(true);

    const response = await request(app).post("/api/auth/login").send({
      email: user.email,
      password: "secret123"
    });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Login exitoso");
    expect(response.body.token).toEqual(expect.any(String));
    expect(response.body.user).toEqual(
      expect.objectContaining({
        id: user.id,
        email: user.email,
        role: user.role
      })
    );
  });

  it("returns the authenticated user when the token is valid", async () => {
    const user = buildUser();

    mockPrisma.user.findUnique.mockResolvedValueOnce(user).mockResolvedValueOnce(user);
    mockCompare.mockResolvedValueOnce(true);

    const loginResponse = await request(app).post("/api/auth/login").send({
      email: user.email,
      password: "secret123"
    });

    const response = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${loginResponse.body.token}`);

    expect(loginResponse.status).toBe(200);
    expect(response.status).toBe(200);
    expect(response.body.user).toEqual(
      expect.objectContaining({
        id: user.id,
        email: user.email,
        role: user.role
      })
    );
  });

  it("rejects access to /api/auth/me without a token", async () => {
    const response = await request(app).get("/api/auth/me");

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      message: "Token faltante"
    });
  });
});
