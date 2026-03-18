export const swaggerDocument = {
  openapi: "3.0.3",
  info: {
    title: "SalesGuard API",
    version: "1.0.0",
    description: "API inicial para deteccion de anomalias en ventas diarias"
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Local development server"
    }
  ],
  tags: [
    {
      name: "Health",
      description: "Health checks del servicio"
    }
  ],
  paths: {
    "/api/health": {
      get: {
        tags: ["Health"],
        summary: "Consultar estado del servicio",
        responses: {
          "200": {
            description: "Servicio disponible",
            content: {
              "application/json": {
                schema: {
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
                    }
                  }
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
