# SalesGuard - Guia breve de deploy y demo final

## Deploy basico en Render

Tipo de servicio:

- Web Service de Node/Express

Comandos recomendados:

- Build Command: `npm install && npm run render:build`
- Start Command: `npm run render:start`

Variables minimas:

- `DATABASE_URL`
- `JWT_SECRET`

Variables opcionales segun el demo:

- `API_PREFIX=/api`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_REDIRECT_URI`
- `GOOGLE_AUTH_SUCCESS_REDIRECT`
- `GOOGLE_AUTH_FAILURE_REDIRECT`
- `EMAIL_HOST`
- `EMAIL_PORT`
- `EMAIL_USER`
- `EMAIL_PASS`
- `EMAIL_FROM`

Notas importantes:

- `PORT` lo asigna Render automaticamente.
- `NODE_ENV=production` ya lo define Render en runtime.
- El Health Check Path recomendado es `/api/health`.
- Este repo deja `npm run db:deploy` dentro del start command para no depender de Pre-Deploy Command.
- Si se va a mostrar Google login en produccion, `GOOGLE_REDIRECT_URI` debe ser `https://TU-SERVICIO.onrender.com/api/auth/google/callback`.
- Esa misma URL debe registrarse en Google Cloud Console.
- Si la UI minima vive fuera de este repo, sus URLs publicas deben usarse en `GOOGLE_AUTH_SUCCESS_REDIRECT` y `GOOGLE_AUTH_FAILURE_REDIRECT`.

## Preparacion local para la demo

1. Ejecutar `npm install`.
2. Copiar `.env.example` a `.env`.
3. Ejecutar `docker compose up -d` o usar una base PostgreSQL ya disponible.
4. Ejecutar `npm run db:generate`.
5. Ejecutar `npm run db:migrate`.
6. Ejecutar `npm run dev`.
7. Confirmar `http://localhost:3000/api/health`.
8. Si vas a mostrar Google login, validar las variables de OAuth y el callback local `http://localhost:3000/api/auth/google/callback`.
9. Si existe una UI minima externa, correrla por separado.

## Datos sugeridos para la demo

Dataset:

```json
{
  "name": "Ventas Abril 2026",
  "description": "Dataset para demo final",
  "userId": 1
}
```

Ventas diarias sugeridas:

```json
[
  { "datasetId": 1, "date": "2026-04-20", "dailySales": 2100.5 },
  { "datasetId": 1, "date": "2026-04-21", "dailySales": 2200 },
  { "datasetId": 1, "date": "2026-04-22", "dailySales": 2150.75 },
  { "datasetId": 1, "date": "2026-04-23", "dailySales": 5400 },
  { "datasetId": 1, "date": "2026-04-24", "dailySales": 2180.25 }
]
```

## Flujo recomendado del demo final

1. Mostrar `GET /api` y `GET /api/health`.
2. Hacer `POST /api/auth/register` o `POST /api/auth/login`.
3. Mostrar `GET /api/auth/me`.
4. Si aplica, explicar `GET /api/auth/google` y el callback configurado.
5. Crear un dataset con `POST /api/datasets`.
6. Registrar ventas con `POST /api/daily-sales`.
7. Ejecutar `POST /api/anomalies/run/:datasetId`.
8. Mostrar `GET /api/anomalies` y explicar el z-score.
9. Mostrar el email en modo demo o el envio SMTP si esta configurado.
10. Mostrar Swagger en `GET /docs`.
11. Ejecutar `npm run build -- --noEmit`.
12. Ejecutar `npm test` si quieres cerrar el demo con validacion automatizada.
13. Si el deploy ya esta listo, abrir la URL publica de Render y repetir `GET /api/health` o `/docs`.

## Archivos utiles para la presentacion

- `README.md`
- `docs/database-diagram.md`
- `docs/sprint-4-core-tests-evidence.md`
- `docs/sprint-5-plan.md`
