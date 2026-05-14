# Sprint 4 - Evidencia de pruebas

Se agregaron pruebas automatizadas con Jest y Supertest para endpoints centrales de SalesGuard. Las pruebas usan mocks de Prisma para no depender de una base PostgreSQL real durante la demo.

## Endpoints cubiertos

- `GET /api/health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/users`
- `POST /api/users`
- `GET /api/users/:id`
- `GET /api/datasets`
- `POST /api/datasets`
- `GET /api/datasets/:id`
- `GET /api/daily-sales`
- `POST /api/daily-sales`
- `GET /api/daily-sales/:id`
- `GET /api/anomalies`
- `GET /api/anomalies/:id`
- `POST /api/anomalies/run/:datasetId`

## Enfoque

- Las pruebas usan datos mínimos y mocks de Prisma.
- No requieren una base PostgreSQL real para ejecutarse.
- El análisis se valida con un dataset simple donde un valor alto genera una anomalía por z-score.

## Validacion

- `npm run build -- --noEmit`
- `npm test`

Resultado validado en `sprint4-base`:

- 6 suites pasando
- 20 pruebas pasando
