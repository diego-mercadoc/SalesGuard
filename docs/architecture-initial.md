# SalesGuard - Arquitectura inicial

## Vision general

SalesGuard es una aplicacion web con enfoque backend-first para detectar anomalias en ventas diarias. El flujo esperado es:

1. autenticacion del usuario
2. carga de un dataset CSV
3. validacion y persistencia en PostgreSQL
4. ejecucion del analisis estadistico
5. consulta de resultados y anomalías detectadas

## Stack base

- Node.js
- Express
- TypeScript
- PostgreSQL
- Swagger / OpenAPI
- JWT para autenticacion futura

## Estructura del backend

- `src/config/`: configuracion compartida
- `src/controllers/`: controladores HTTP
- `src/middlewares/`: middlewares globales
- `src/routes/`: definicion de endpoints
- `src/server.ts`: arranque del servidor
- `src/app.ts`: composicion de middlewares y rutas

## Criterios de arquitectura

- API REST con separacion clara entre rutas, controladores y configuracion
- Preparada para integrar ORM y capas de servicio en los siguientes sprints
- Documentacion de API disponible desde etapas tempranas
- Manejo global de errores para crecimiento ordenado del backend

## Flujo tecnico esperado

CSV -> validacion -> persistencia -> analisis z-score -> almacenamiento de anomalias -> consulta via API
