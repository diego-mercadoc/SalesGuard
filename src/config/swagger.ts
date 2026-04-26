const bearerSecurity = [{ bearerAuth: [] }];

export const swaggerDocument = {
  openapi: "3.0.3",
  info: {
    title: "SalesGuard API",
    version: "1.0.0",
    description:
      "Documentacion del backend de SalesGuard para autenticacion, datasets, ventas diarias y deteccion simple de anomalias en Sprint 3."
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
    { name: "Auth", description: "Registro, login y usuario autenticado" },
    { name: "Datasets", description: "CRUD basico de datasets" },
    { name: "DailySales", description: "CRUD de ventas diarias" },
    { name: "Anomalies", description: "Consulta y deteccion simple de anomalias" }
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
        security: bearerSecurity,
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
    },
    "/api/datasets": {
      get: {
        tags: ["Datasets"],
        summary: "Listar datasets",
        security: bearerSecurity,
        responses: {
          "200": {
            description: "Datasets obtenidos correctamente",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/DatasetListResponse" }
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
          }
        }
      },
      post: {
        tags: ["Datasets"],
        summary: "Crear dataset",
        security: bearerSecurity,
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/DatasetRequest" }
            }
          }
        },
        responses: {
          "201": {
            description: "Dataset creado correctamente",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/DatasetResponse" }
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
          "401": {
            description: "Token faltante o invalido",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          }
        }
      }
    },
    "/api/datasets/{id}": {
      get: {
        tags: ["Datasets"],
        summary: "Obtener dataset por id",
        security: bearerSecurity,
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer", example: 1 }
          }
        ],
        responses: {
          "200": {
            description: "Dataset obtenido correctamente",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/DatasetResponse" }
              }
            }
          },
          "400": {
            description: "Id invalido",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
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
            description: "Dataset no encontrado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          }
        }
      },
      put: {
        tags: ["Datasets"],
        summary: "Actualizar dataset",
        security: bearerSecurity,
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer", example: 1 }
          }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/DatasetRequest" }
            }
          }
        },
        responses: {
          "200": {
            description: "Dataset actualizado correctamente",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/DatasetResponse" }
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
          "401": {
            description: "Token faltante o invalido",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          },
          "404": {
            description: "Dataset no encontrado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          }
        }
      },
      delete: {
        tags: ["Datasets"],
        summary: "Eliminar dataset",
        security: bearerSecurity,
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer", example: 1 }
          }
        ],
        responses: {
          "200": {
            description: "Dataset eliminado correctamente",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/MessageResponse" }
              }
            }
          },
          "400": {
            description: "Id invalido",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
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
          "403": {
            description: "Permiso de administrador requerido",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          },
          "404": {
            description: "Dataset no encontrado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          }
        }
      }
    },
    "/api/daily-sales": {
      get: {
        tags: ["DailySales"],
        summary: "Listar ventas diarias",
        security: bearerSecurity,
        responses: {
          "200": {
            description: "Ventas diarias obtenidas correctamente",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/DailySalesListResponse" }
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
          }
        }
      },
      post: {
        tags: ["DailySales"],
        summary: "Crear venta diaria",
        security: bearerSecurity,
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/DailySaleRequest" }
            }
          }
        },
        responses: {
          "201": {
            description: "Venta diaria creada correctamente",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/DailySaleResponse" }
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
          "401": {
            description: "Token faltante o invalido",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          },
          "404": {
            description: "Dataset no encontrado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          }
        }
      }
    },
    "/api/daily-sales/{id}": {
      get: {
        tags: ["DailySales"],
        summary: "Obtener venta diaria por id",
        security: bearerSecurity,
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer", example: 1 }
          }
        ],
        responses: {
          "200": {
            description: "Venta diaria obtenida correctamente",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/DailySaleResponse" }
              }
            }
          },
          "400": {
            description: "Id invalido",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
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
            description: "Venta diaria no encontrada",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          }
        }
      },
      put: {
        tags: ["DailySales"],
        summary: "Actualizar venta diaria",
        security: bearerSecurity,
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer", example: 1 }
          }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/DailySaleRequest" }
            }
          }
        },
        responses: {
          "200": {
            description: "Venta diaria actualizada correctamente",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/DailySaleResponse" }
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
          "401": {
            description: "Token faltante o invalido",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          },
          "404": {
            description: "Venta diaria o dataset no encontrado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          }
        }
      },
      delete: {
        tags: ["DailySales"],
        summary: "Eliminar venta diaria",
        security: bearerSecurity,
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer", example: 1 }
          }
        ],
        responses: {
          "200": {
            description: "Venta diaria eliminada correctamente",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/MessageResponse" }
              }
            }
          },
          "400": {
            description: "Id invalido",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
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
          "403": {
            description: "Permiso de administrador requerido",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          },
          "404": {
            description: "Venta diaria no encontrada",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          }
        }
      }
    },
    "/api/anomalies": {
      get: {
        tags: ["Anomalies"],
        summary: "Listar anomalias guardadas",
        security: bearerSecurity,
        responses: {
          "200": {
            description: "Anomalias obtenidas correctamente",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/AnomalyListResponse" }
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
          }
        }
      }
    },
    "/api/anomalies/{id}": {
      get: {
        tags: ["Anomalies"],
        summary: "Obtener anomalia por id",
        security: bearerSecurity,
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer", example: 1 }
          }
        ],
        responses: {
          "200": {
            description: "Anomalia obtenida correctamente",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/AnomalyResponse" }
              }
            }
          },
          "400": {
            description: "Id invalido",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
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
            description: "Anomalia no encontrada",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          }
        }
      }
    },
    "/api/anomalies/run/{datasetId}": {
      post: {
        tags: ["Anomalies"],
        summary: "Ejecutar analisis de anomalias por dataset",
        description:
          "Obtiene las ventas diarias del dataset, calcula promedio, desviacion estandar y z-score, guarda las anomalias detectadas y dispara una notificacion simple por email.",
        security: bearerSecurity,
        parameters: [
          {
            name: "datasetId",
            in: "path",
            required: true,
            schema: { type: "integer", example: 1 }
          }
        ],
        responses: {
          "200": {
            description: "Analisis ejecutado correctamente",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/RunAnomaliesResponse" }
              }
            }
          },
          "400": {
            description: "Dataset invalido o sin ventas",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
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
            description: "Dataset no encontrado",
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
      MessageResponse: {
        type: "object",
        properties: {
          message: { type: "string", example: "Operacion completada correctamente" }
        }
      },
      ErrorResponse: {
        type: "object",
        properties: {
          message: { type: "string", example: "Token invalido" }
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
      Dataset: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          name: { type: "string", example: "Ventas Abril 2026" },
          description: {
            type: "string",
            nullable: true,
            example: "Dataset base para pruebas de ventas diarias"
          },
          userId: { type: "integer", example: 1 },
          createdAt: {
            type: "string",
            format: "date-time",
            example: "2026-04-25T00:00:00.000Z"
          },
          updatedAt: {
            type: "string",
            format: "date-time",
            example: "2026-04-25T00:00:00.000Z"
          }
        }
      },
      DatasetRequest: {
        type: "object",
        required: ["name", "userId"],
        properties: {
          name: { type: "string", example: "Ventas Abril 2026" },
          description: {
            type: "string",
            example: "Dataset base para pruebas de ventas diarias"
          },
          userId: { type: "integer", example: 1 }
        }
      },
      DatasetListResponse: {
        type: "object",
        properties: {
          datasets: {
            type: "array",
            items: { $ref: "#/components/schemas/Dataset" }
          }
        }
      },
      DatasetResponse: {
        type: "object",
        properties: {
          message: {
            type: "string",
            example: "Dataset creado correctamente"
          },
          dataset: { $ref: "#/components/schemas/Dataset" }
        }
      },
      DailySale: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          datasetId: { type: "integer", example: 1 },
          date: { type: "string", format: "date", example: "2026-04-20" },
          dailySales: { type: "string", example: "2500.50" },
          createdAt: {
            type: "string",
            format: "date-time",
            example: "2026-04-25T00:00:00.000Z"
          },
          updatedAt: {
            type: "string",
            format: "date-time",
            example: "2026-04-25T00:00:00.000Z"
          }
        }
      },
      DailySaleRequest: {
        type: "object",
        required: ["datasetId", "date", "dailySales"],
        properties: {
          datasetId: { type: "integer", example: 1 },
          date: { type: "string", format: "date", example: "2026-04-20" },
          dailySales: { type: "number", example: 2500.5 }
        }
      },
      DailySalesListResponse: {
        type: "object",
        properties: {
          dailySales: {
            type: "array",
            items: { $ref: "#/components/schemas/DailySale" }
          }
        }
      },
      DailySaleResponse: {
        type: "object",
        properties: {
          message: {
            type: "string",
            example: "Venta diaria creada correctamente"
          },
          dailySale: { $ref: "#/components/schemas/DailySale" }
        }
      },
      Anomaly: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          datasetId: { type: "integer", example: 1 },
          date: { type: "string", format: "date", example: "2026-04-22" },
          value: { type: "string", example: "5200.00" },
          score: { type: "string", example: "2.3871" },
          severity: { type: "string", example: "medium" },
          createdAt: {
            type: "string",
            format: "date-time",
            example: "2026-04-25T00:00:00.000Z"
          }
        }
      },
      AnomalyListResponse: {
        type: "object",
        properties: {
          anomalies: {
            type: "array",
            items: { $ref: "#/components/schemas/Anomaly" }
          }
        }
      },
      AnomalyResponse: {
        type: "object",
        properties: {
          anomaly: { $ref: "#/components/schemas/Anomaly" }
        }
      },
      DetectedAnomaly: {
        type: "object",
        properties: {
          date: { type: "string", format: "date", example: "2026-04-22" },
          value: { type: "number", example: 5200 },
          score: { type: "number", example: 2.3871 },
          severity: { type: "string", example: "medium" }
        }
      },
      EmailSummary: {
        type: "object",
        properties: {
          mode: { type: "string", example: "demo" },
          recipient: { type: "string", nullable: true, example: "juan@example.com" },
          message: {
            type: "string",
            example: "No hay SMTP configurado. El email se registro en consola"
          }
        }
      },
      RunAnomaliesResponse: {
        type: "object",
        properties: {
          message: {
            type: "string",
            example: "Analisis de anomalias ejecutado correctamente"
          },
          summary: {
            type: "object",
            properties: {
              datasetId: { type: "integer", example: 1 },
              datasetName: { type: "string", example: "Ventas Abril 2026" },
              totalRecords: { type: "integer", example: 7 },
              average: { type: "number", example: 2450.36 },
              standardDeviation: { type: "number", example: 812.1834 },
              anomaliesDetected: { type: "integer", example: 1 },
              email: { $ref: "#/components/schemas/EmailSummary" }
            }
          },
          anomalies: {
            type: "array",
            items: { $ref: "#/components/schemas/DetectedAnomaly" }
          }
        }
      }
    }
  }
};
