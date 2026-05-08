# SalesGuard - Demo checklist Sprint 3

## Preparacion

1. Ejecutar `npm install`
2. Ejecutar `docker compose up -d`
3. Ejecutar `npm run db:generate`
4. Ejecutar `npm run db:migrate`
5. Ejecutar `npm run dev`
6. Confirmar que el servidor arranque en `http://localhost:3000`
7. Tener a la mano un usuario con token valido
8. Tener un usuario administrador para probar `DELETE`

## Datos sugeridos para la demo

Dataset:

```json
{
  "name": "Ventas Abril 2026",
  "description": "Dataset para demo de Sprint 3",
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

## Flujo de demo

1. Mostrar `GET /api` y `GET /api/health`.
2. Hacer `POST /api/auth/login` para obtener el Bearer token.
3. Mostrar `GET /api/auth/me` para confirmar autenticacion.
4. Crear un dataset con `POST /api/datasets`.
5. Mostrar `GET /api/datasets` y `GET /api/datasets/:id`.
6. Insertar varias ventas con `POST /api/daily-sales`.
7. Mostrar `GET /api/daily-sales`.
8. Ejecutar `POST /api/anomalies/run/:datasetId`.
9. Mostrar `GET /api/anomalies` y explicar el z-score.
10. Mostrar en consola el email demo o el correo enviado si hay SMTP configurado.
11. Probar Swagger en `GET /docs`.
12. Mostrar el archivo `evidencias-sprint-3.html`.
13. Mostrar el PR base `sprint3-core` y la distribucion del trabajo del equipo.
14. Cerrar con la planeacion de Sprint 4.

## Archivos de apoyo para la presentacion

- `README.md`
- `evidencias-sprint-3.html`
- `docs/database-diagram.md`
- `docs/sprint-3-plan.md`
- `docs/sprint-4-plan.md`
