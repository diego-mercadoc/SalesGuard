const mockPrisma = {
  user: {
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

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import request from "supertest";

import { app } from "../src/app";

const mockHash = bcrypt.hash as jest.Mock;
const adminToken = jwt.sign(
  {
    id: 1,
    email: "admin@example.com",
    role: "admin"
  },
  "salesguard-secret"
);
const authHeader = { Authorization: `Bearer ${adminToken}` };

const buildUser = () => ({
  id: 1,
  email: "maria@example.com",
  role: "admin",
  createdAt: new Date("2026-05-09T12:00:00.000Z"),
  updatedAt: new Date("2026-05-09T12:00:00.000Z")
});

describe("User endpoints", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("returns the list of users", async () => {
    const users = [buildUser()];

    mockPrisma.user.findMany.mockResolvedValueOnce(users);

    const response = await request(app).get("/api/users").set(authHeader);

    expect(response.status).toBe(200);
    expect(response.body.users).toEqual([
      expect.objectContaining({
        id: users[0].id,
        email: users[0].email,
        role: users[0].role
      })
    ]);
  });

  it("creates a user successfully", async () => {
    const user = buildUser();

    mockHash.mockResolvedValueOnce("hashed-password");
    mockPrisma.user.create.mockResolvedValueOnce(user);

    const response = await request(app)
      .post("/api/users")
      .set(authHeader)
      .send({
        email: user.email,
        password: "secret123",
        role: user.role
      });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Usuario creado correctamente");
    expect(response.body.user).toEqual(
      expect.objectContaining({
        id: user.id,
        email: user.email,
        role: user.role
      })
    );
  });

  it("returns 400 when the user id is invalid", async () => {
    const response = await request(app).get("/api/users/abc").set(authHeader);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "Id de usuario invalido"
    });
  });

  it("returns 404 when the user does not exist", async () => {
    mockPrisma.user.findUnique.mockResolvedValueOnce(null);

    const response = await request(app).get("/api/users/999").set(authHeader);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      message: "Usuario no encontrado"
    });
  });

  it("returns 401 when the token is missing", async () => {
    const response = await request(app).get("/api/users");

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      message: "Token faltante"
    });
  });
});
