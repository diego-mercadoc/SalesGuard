# SalesGuard

Backend de SalesGuard para Sprint 3 con autenticacion, datasets, ventas diarias y deteccion simple de anomalias.

## Modulos del sprint

- autenticacion con JWT
- CRUD de datasets
- CRUD de ventas diarias
- generacion de anomalias por dataset usando z-score
- notificacion por email simple cuando se detectan anomalias
- documentacion con Swagger

## Scripts

- `npm run dev`: ejecuta el servidor en desarrollo
- `npm run build`: compila TypeScript a `dist/`
- `npm run db:generate`: genera el cliente de Prisma
- `npm run db:migrate`: aplica migraciones en desarrollo
- `npm run db:studio`: abre Prisma Studio
- `npm start`: ejecuta el build compilado

## Variables de entorno

Variables base:

- `NODE_ENV`
- `PORT`
- `API_PREFIX`
- `JWT_SECRET`
- `DATABASE_URL`

Variables opcionales para email:

- `EMAIL_HOST`
- `EMAIL_PORT`
- `EMAIL_USER`
- `EMAIL_PASS`
- `EMAIL_FROM`

Si no se configura `EMAIL_HOST`, el analisis de anomalias sigue funcionando y el email queda en modo demo con salida por consola.

## Base de datos local

1. Copiar `.env.example` a `.env`
2. Ejecutar `docker compose up -d`
3. Ejecutar `npm run db:generate`
4. Ejecutar `npm run db:migrate`

## Endpoints disponibles

Publicos:

- `GET /api`
- `GET /api/health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /docs`

Protegidos con `Bearer token`:

- `GET /api/auth/me`
- `GET /api/datasets`
- `GET /api/datasets/:id`
- `POST /api/datasets`
- `PUT /api/datasets/:id`
- `DELETE /api/datasets/:id`
- `GET /api/daily-sales`
- `GET /api/daily-sales/:id`
- `POST /api/daily-sales`
- `PUT /api/daily-sales/:id`
- `DELETE /api/daily-sales/:id`
- `GET /api/anomalies`
- `GET /api/anomalies/:id`
- `POST /api/anomalies/run/:datasetId`

Rutas con permiso de admin:

- `DELETE /api/datasets/:id`
- `DELETE /api/daily-sales/:id`

## Flujo simple de uso

1. Crear o identificar un usuario.
2. Crear un dataset con `POST /api/datasets`.
3. Registrar ventas diarias con `POST /api/daily-sales`.
4. Ejecutar el analisis con `POST /api/anomalies/run/:datasetId`.
5. Consultar anomalias guardadas con `GET /api/anomalies`.

## Ejemplos de requests

### Crear dataset

```json
{
  "name": "Ventas Abril 2026",
  "description": "Dataset base para pruebas",
  "userId": 1
}
```

### Crear venta diaria

```json
{
  "datasetId": 1,
  "date": "2026-04-20",
  "dailySales": 2500.5
}
```

### Ejecutar analisis de anomalias

Request:

```text
POST /api/anomalies/run/1
Authorization: Bearer tu-token
```

Respuesta ejemplo:

```json
{
  "message": "Analisis de anomalias ejecutado correctamente",
  "summary": {
    "datasetId": 1,
    "datasetName": "Ventas Abril 2026",
    "totalRecords": 7,
    "average": 2450.36,
    "standardDeviation": 812.1834,
    "anomaliesDetected": 1,
    "email": {
      "mode": "demo",
      "recipient": "juan@example.com",
      "message": "No hay SMTP configurado. El email se registro en consola"
    }
  },
  "anomalies": [
    {
      "date": "2026-04-22",
      "value": 5200,
      "score": 2.3871,
      "severity": "medium"
    }
  ]
}
```

## Analisis de anomalias

El endpoint `POST /api/anomalies/run/:datasetId` hace lo siguiente:

1. busca el dataset y sus ventas diarias
2. calcula promedio
3. calcula desviacion estandar
4. calcula z-score por registro
5. guarda como anomalia cada venta con `abs(zScore) >= 2`
6. reemplaza las anomalias previas del dataset para evitar duplicados
7. intenta enviar un email simple al email del usuario dueno del dataset

## Email simple

- si existe `EMAIL_HOST`, SalesGuard intenta enviar el correo con `nodemailer`
- si no existe `EMAIL_HOST`, SalesGuard entra en modo demo
- en modo demo se imprime en consola el destinatario, asunto y contenido del correo
- el destinatario es el email del usuario asociado al dataset

## Documentacion publica

- Swagger UI: [`/docs`](http://localhost:3000/docs)
- Diagrama de base de datos: [`docs/database-diagram.md`](docs/database-diagram.md)
- Plan de Sprint 3: [`docs/sprint-3-plan.md`](docs/sprint-3-plan.md)

## Entrega Sprint 3

- Evidencias del sprint: [`evidencias-sprint-3.html`](evidencias-sprint-3.html)
- Checklist de demo: [`docs/demo-checklist.md`](docs/demo-checklist.md)
- Planeacion de Sprint 4: [`docs/sprint-4-plan.md`](docs/sprint-4-plan.md)
- Pull request base `sprint3-core`: `https://github.com/diego-mercadoc/SalesGuard/pull/2`

## Estructura base

- `src/config/`: configuracion compartida del proyecto
- `src/controllers/`: controladores HTTP
- `src/middlewares/`: middlewares globales
- `src/routes/`: rutas HTTP
- `src/app.ts`: configuracion principal de Express
- `src/server.ts`: arranque del servidor

## Documentacion adicional

- `docs/architecture-initial.md`: arquitectura inicial del backend
- `docs/database-diagram.md`: diagrama de base de datos
- `docs/database-design-initial.md`: diseno inicial de base de datos
- `docs/demo-checklist.md`: guia breve para presentar avances
- `docs/notion-board-alignment.md`: alineacion entre tablero de Notion y trabajo implementado
- `docs/sprint-2-plan.md`: objetivos del Sprint 2
- `docs/sprint-3-plan.md`: objetivos del Sprint 3
