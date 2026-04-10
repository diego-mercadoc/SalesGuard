export const swaggerDocument = {
  openapi: "3.0.3",
  info: {
    title: "SalesGuard API",
    version: "1.0.0",
    description: "API para detectar anomalias en ventas diarias."
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Servidor local"
    }
  ],
  tags: [
    { name: "System", description: "Informacion general de la API" },
    { name: "Health", description: "Estado del servidor" },
    { name: "Auth", description: "Registro, login y usuario actual" },
    { name: "Users", description: "CRUD basico de usuarios" }
  ],
  paths: {
    "/api": {
      get: {
        tags: ["System"],
        summary: "Informacion base de la API",
        responses: {
          "200": {
            description: "Informacion general del servicio",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiOverviewResponse" }
              }
            }
          }
        }
      }
    },
    "/api/health": {
      get: {
        tags: ["Health"],
        summary: "Health check del servidor",
        responses: {
          "200": {
            description: "Servidor funcionando",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/HealthResponse" }
              }
            }
          }
        }
      }
    },
    "/api/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Registrar usuario",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/AuthRequest" }
            }
          }
        },
        responses: {
          "201": { description: "Usuario registrado" },
          "400": { description: "Datos invalidos" },
          "409": { description: "Email ya registrado" }
        }
      }
    },
    "/api/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Iniciar sesion",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/AuthRequest" }
            }
          }
        },
        responses: {
          "200": { description: "Login correcto" },
          "400": { description: "Datos faltantes" },
          "401": { description: "Credenciales invalidas" }
        }
      }
    },
    "/api/auth/me": {
      get: {
        tags: ["Auth"],
        summary: "Obtener usuario actual",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": { description: "Usuario autenticado" },
          "401": { description: "Token faltante o invalido" }
        }
      }
    },
    "/api/users": {
      get: {
        tags: ["Users"],
        summary: "Listar usuarios",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": { description: "Listado de usuarios" },
          "401": { description: "Token faltante o invalido" }
        }
      }
    },
    "/api/users/{id}": {
      get: {
        tags: ["Users"],
        summary: "Consultar usuario por id",
        security: [{ bearerAuth: [] }],
        parameters: [{ $ref: "#/components/parameters/UserId" }],
        responses: {
          "200": { description: "Usuario encontrado" },
          "404": { description: "Usuario no encontrado" }
        }
      },
      patch: {
        tags: ["Users"],
        summary: "Editar usuario",
        security: [{ bearerAuth: [] }],
        parameters: [{ $ref: "#/components/parameters/UserId" }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateUserRequest" }
            }
          }
        },
        responses: {
          "200": { description: "Usuario actualizado" },
          "400": { description: "Datos invalidos" },
          "404": { description: "Usuario no encontrado" }
        }
      },
      delete: {
        tags: ["Users"],
        summary: "Eliminar usuario",
        security: [{ bearerAuth: [] }],
        parameters: [{ $ref: "#/components/parameters/UserId" }],
        responses: {
          "204": { description: "Usuario eliminado" },
          "404": { description: "Usuario no encontrado" }
        }
      }
    }
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT"
      }
    },
    parameters: {
      UserId: {
        name: "id",
        in: "path",
        required: true,
        schema: {
          type: "integer",
          example: 1
        }
      }
    },
    schemas: {
      ApiOverviewResponse: {
        type: "object",
        properties: {
          name: { type: "string", example: "SalesGuard API" },
          version: { type: "string", example: "1.0.0" },
          environment: { type: "string", example: "development" },
          docs: { type: "string", example: "/docs" },
          health: { type: "string", example: "/api/health" }
        }
      },
      HealthResponse: {
        type: "object",
        properties: {
          status: { type: "string", example: "ok" },
          service: { type: "string", example: "salesguard-api" },
          environment: { type: "string", example: "development" },
          timestamp: {
            type: "string",
            format: "date-time",
            example: "2026-04-10T18:30:00.000Z"
          }
        }
      },
      AuthRequest: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", example: "demo@salesguard.com" },
          password: { type: "string", example: "secret123" }
        }
      },
      UpdateUserRequest: {
        type: "object",
        properties: {
          email: { type: "string", example: "updated@salesguard.com" },
          role: { type: "string", example: "admin" }
        }
      },
      User: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          email: { type: "string", example: "demo@salesguard.com" },
          role: { type: "string", example: "user" },
          createdAt: {
            type: "string",
            format: "date-time",
            example: "2026-04-10T18:30:00.000Z"
          }
        }
      },
      ErrorResponse: {
        type: "object",
        properties: {
          message: { type: "string", example: "Internal server error" }
        }
      }
    }
  }
};
