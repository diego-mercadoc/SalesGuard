export const swaggerDocument = {
  openapi: "3.0.3",
  info: {
    title: "SalesGuard API",
    version: "1.0.0",
    description:
      "Documentacion del backend de SalesGuard para endpoints base, health check y autenticacion del Sprint 2."
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Servidor local de desarrollo"
    }
  ],
  tags: [
    { name: "System", description: "Informacion general de la API" },
    { name: "Health", description: "Estado del servicio" },
    { name: "Auth", description: "Registro, login y usuario autenticado" }
  ],
  paths: {
    "/api": {
      get: {
        tags: ["System"],
        summary: "Obtener informacion general de la API",
        description:
          "Devuelve informacion basica del servicio y rutas utiles para descubrir los endpoints disponibles.",
        responses: {
          "200": {
            description: "Informacion general obtenida correctamente",
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
        summary: "Verificar estado del servidor",
        description: "Confirma que la API esta arriba y respondiendo en el entorno actual.",
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
        description: "Crea un usuario nuevo y devuelve un JWT para autenticacion.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/AuthRequest" }
            }
          }
        },
        responses: {
          "201": {
            description: "Usuario registrado correctamente",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/AuthSuccessResponse" }
              }
            }
          },
          "400": {
            description: "Datos invalidos",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          },
          "409": {
            description: "Email duplicado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          }
        }
      }
    },
    "/api/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Iniciar sesion",
        description: "Valida credenciales y devuelve un JWT junto con el usuario autenticado.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/AuthRequest" }
            }
          }
        },
        responses: {
          "200": {
            description: "Login exitoso",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/AuthSuccessResponse" }
              }
            }
          },
          "400": {
            description: "Datos faltantes",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          },
          "401": {
            description: "Credenciales invalidas",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          }
        }
      }
    },
    "/api/auth/me": {
      get: {
        tags: ["Auth"],
        summary: "Obtener usuario autenticado",
        description: "Devuelve el usuario asociado al Bearer token enviado en el header Authorization.",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "Usuario autenticado obtenido correctamente",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CurrentUserResponse" }
              }
            }
          },
          "401": {
            description: "Token faltante o invalido",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          },
          "404": {
            description: "Usuario no encontrado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          }
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
    schemas: {
      ApiOverviewResponse: {
        type: "object",
        properties: {
          name: { type: "string", example: "SalesGuard API" },
          version: { type: "string", example: "1.0.0" },
          environment: { type: "string", example: "development" },
          docs: { type: "string", example: "/docs" },
          health: { type: "string", example: "/api/health" },
          auth: {
            type: "object",
            properties: {
              register: { type: "string", example: "/api/auth/register" },
              login: { type: "string", example: "/api/auth/login" },
              me: { type: "string", example: "/api/auth/me" }
            }
          }
        }
      },
      HealthResponse: {
        type: "object",
        properties: {
          status: { type: "string", example: "ok" },
          service: { type: "string", example: "salesguard-api" },
          environment: { type: "string", example: "development" }
        }
      },
      AuthRequest: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: {
            type: "string",
            format: "email",
            example: "juan@example.com"
          },
          password: {
            type: "string",
            minLength: 6,
            example: "123456"
          }
        }
      },
      User: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          email: { type: "string", format: "email", example: "juan@example.com" },
          role: { type: "string", example: "user" },
          createdAt: {
            type: "string",
            format: "date-time",
            example: "2026-04-10T00:00:00.000Z"
          },
          updatedAt: {
            type: "string",
            format: "date-time",
            example: "2026-04-10T00:00:00.000Z"
          }
        }
      },
      AuthSuccessResponse: {
        type: "object",
        properties: {
          message: {
            type: "string",
            example: "Usuario registrado correctamente"
          },
          token: {
            type: "string",
            example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
          },
          user: { $ref: "#/components/schemas/User" }
        }
      },
      CurrentUserResponse: {
        type: "object",
        properties: {
          user: { $ref: "#/components/schemas/User" }
        }
      },
      ErrorResponse: {
        type: "object",
        properties: {
          message: { type: "string", example: "Token invalido" }
        }
      }
    }
  }
};
