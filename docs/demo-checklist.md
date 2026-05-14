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
- Si vas a mostrar la UI minima integrada, la ruta publica es `/demo/`.
- Si se va a mostrar Google login en produccion, `GOOGLE_REDIRECT_URI` debe ser `https://TU-SERVICIO.onrender.com/api/auth/google/callback`.
- Esa misma URL debe registrarse en Google Cloud Console.
- Para la UI integrada, usa `https://TU-SERVICIO.onrender.com/demo/` en `GOOGLE_AUTH_SUCCESS_REDIRECT` y `GOOGLE_AUTH_FAILURE_REDIRECT`.

## Preparacion local para la demo

1. Ejecutar `npm install`.
2. Copiar `.env.example` a `.env`.
3. Ejecutar `docker compose up -d` o usar una base PostgreSQL ya disponible.
4. Ejecutar `npm run db:generate`.
5. Ejecutar `npm run db:migrate`.
6. Ejecutar `npm run dev`.
7. Confirmar `http://localhost:3000/api/health`.
8. Si vas a mostrar la UI minima, abrir `http://localhost:3000/demo/`.
9. Si vas a mostrar Google login, validar las variables de OAuth y el callback local `http://localhost:3000/api/auth/google/callback`.

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
2. Abrir `/demo/` para mostrar la UI minima.
3. Hacer login con Google desde la UI o usar Swagger si el OAuth aun no esta configurado.
4. Crear un dataset.
5. Registrar ventas con la UI.
6. Ejecutar el analisis desde la UI.
7. Mostrar anomalías detectadas y explicar el z-score.
8. Mostrar Swagger en `GET /docs`.
9. Ejecutar `npm run build -- --noEmit`.
10. Ejecutar `npm test` si quieres cerrar el demo con validacion automatizada.
11. Si el deploy ya esta listo, abrir la URL publica de Render y repetir `GET /api/health`, `/demo/` o `/docs`.

## Archivos utiles para la presentacion

- `README.md`
- `docs/database-diagram.md`
- `docs/sprint-4-core-tests-evidence.md`
- `docs/sprint-5-plan.md`
