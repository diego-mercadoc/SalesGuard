export const swaggerDocument = {
  openapi: "3.0.3",
  info: {
    title: "SalesGuard API - Anomaly Detection System",
    version: "1.0.0",
    description:
      "API para detección de anomalías en ventas diarias. Esta documentación permite visualizar y probar los endpoints disponibles del sistema durante el desarrollo."
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Servidor local de desarrollo"
    }
  ],
  tags: [
    {
      name: "System",
      description: "Endpoints de información general de la API"
    },
    {
      name: "Health",
      description: "Endpoints para verificar el estado del servicio"
    },
    {
      name: "Datasets",
      description: "Endpoints planeados para carga y consulta de datasets"
    }
  ],
  paths: {
    "/api": {
      get: {
        tags: ["System"],
        summary: "Obtiene información general de la API",
        description:
          "Devuelve datos básicos del servicio, incluyendo versión, entorno actual y rutas útiles para documentación y monitoreo.",
        responses: {
          "200": {
            description: "Información general del servicio obtenida correctamente",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ApiOverviewResponse"
                }
              }
            }
          },
          "500": {
            description: "Error interno del servidor",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse"
                }
              }
            }
          }
        }
      }
    },
    "/api/health": {
      get: {
        tags: ["Health"],
        summary: "Verifica el estado del servidor",
        description:
          "Permite confirmar que la API está activa y funcionando correctamente. Es útil para pruebas, monitoreo y validación del entorno.",
        responses: {
          "200": {
            description: "Servidor disponible y funcionando correctamente",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HealthResponse"
                }
              }
            }
          },
          "500": {
            description: "Error interno del servidor",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse"
                }
              }
            }
          }
        }
      }
    },
    "/api/datasets/upload": {
      post: {
        tags: ["Datasets"],
        summary: "Sube un archivo CSV de ventas",
        description:
          "Endpoint planeado para cargar un archivo CSV con ventas diarias y procesarlo dentro del sistema.",
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                required: ["file"],
                properties: {
                  file: {
                    type: "string",
                    format: "binary",
                    description: "Archivo CSV con registros de ventas diarias"
                  }
                }
              }
            }
          }
        },
        responses: {
          "201": {
            description: "Archivo cargado correctamente"
          },
          "400": {
            description: "Archivo inválido o faltante",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse"
                }
              }
            }
          },
          "500": {
            description: "Error interno del servidor",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse"
                }
              }
            }
          }
        }
      }
    }
  },
  components: {
    schemas: {
      ApiOverviewResponse: {
        type: "object",
        properties: {
          name: {
            type: "string",
            example: "SalesGuard API"
          },
          version: {
            type: "string",
            example: "1.0.0"
          },
          environment: {
            type: "string",
            example: "development"
          },
          docs: {
            type: "string",
            example: "/docs"
          },
          health: {
            type: "string",
            example: "/api/health"
          }
        }
      },
      HealthResponse: {
        type: "object",
        properties: {
          status: {
            type: "string",
            example: "ok"
          },
          service: {
            type: "string",
            example: "salesguard-api"
          },
          environment: {
            type: "string",
            example: "development"
          },
          timestamp: {
            type: "string",
            format: "date-time",
            example: "2026-03-20T18:30:00.000Z"
          }
        }
      },
      ErrorResponse: {
        type: "object",
        properties: {
          message: {
            type: "string",
            example: "Internal server error"
          }
        }
      },
      User: {
        type: "object",
        properties: {
          id: {
            type: "integer",
            example: 1
          },
          email: {
            type: "string",
            example: "user@example.com"
          },
          role: {
            type: "string",
            example: "admin"
          }
        }
      },
      Dataset: {
        type: "object",
        properties: {
          id: {
            type: "integer",
            example: 1
          },
          name: {
            type: "string",
            example: "ventas-marzo"
          },
          userId: {
            type: "integer",
            example: 1
          }
        }
      },
      DailySales: {
        type: "object",
        properties: {
          id: {
            type: "integer",
            example: 1
          },
          datasetId: {
            type: "integer",
            example: 1
          },
          date: {
            type: "string",
            format: "date",
            example: "2026-03-18"
          },
          dailySales: {
            type: "number",
            format: "float",
            example: 15420.5
          }
        }
      },
      Anomaly: {
        type: "object",
        properties: {
          id: {
            type: "integer",
            example: 1
          },
          datasetId: {
            type: "integer",
            example: 1
          },
          date: {
            type: "string",
            format: "date",
            example: "2026-03-18"
          },
          score: {
            type: "number",
            format: "float",
            example: 2.87
          },
          severity: {
            type: "string",
            example: "high"
          }
        }
      }
    }
  }
};