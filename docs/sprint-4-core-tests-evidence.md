# Sprint 4 - Core tests evidence

Se agregaron pruebas automatizadas con Jest y Supertest para endpoints centrales de SalesGuard.

## Endpoints cubiertos

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

## Validación esperada

- `npm run build -- --noEmit`
- `npm test`
