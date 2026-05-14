# SalesGuard

Backend de SalesGuard con autenticacion, datasets, ventas diarias, deteccion simple de anomalias, pruebas automatizadas y una UI minima de demo.

## Modulos del sprint

- autenticacion con JWT
- CRUD de datasets
- CRUD de ventas diarias
- generacion de anomalias por dataset usando z-score
- notificacion por email simple cuando se detectan anomalias
- documentacion con Swagger
- UI minima de demo servida desde el backend

## Scripts

- `npm run dev`: ejecuta el servidor en desarrollo
- `npm run build`: compila TypeScript a `dist/`
- `npm test`: ejecuta las pruebas automatizadas con Jest y Supertest
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

Variables para login con Google:

- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_REDIRECT_URI`
- `GOOGLE_AUTH_SUCCESS_REDIRECT`
- `GOOGLE_AUTH_FAILURE_REDIRECT`

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
- `GET /api/auth/google`
- `GET /api/auth/google/callback`
- `GET /demo`
- `GET /docs`

Usuarios:

- `GET /api/users`
- `GET /api/users/:id`
- `POST /api/users`
- `PUT /api/users/:id`
- `DELETE /api/users/:id`

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

## Login con Google

El flujo de Google OAuth queda preparado para Sprint 5:

1. configurar las variables `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` y `GOOGLE_REDIRECT_URI`
2. abrir `GET /api/auth/google`
3. Google redirige a `GET /api/auth/google/callback`
4. SalesGuard obtiene el email de Google, busca o crea el usuario local y genera el JWT del sistema

Si `GOOGLE_AUTH_SUCCESS_REDIRECT` esta configurado, el callback redirige a esa URL con `token`, `userId` y `email`. Si no esta configurado, responde JSON. Si ocurre un error y `GOOGLE_AUTH_FAILURE_REDIRECT` esta configurado, redirige a esa URL con `message`.

Para usar la UI de demo local, configurar:

```text
GOOGLE_AUTH_SUCCESS_REDIRECT=http://localhost:3000/demo/
GOOGLE_AUTH_FAILURE_REDIRECT=http://localhost:3000/demo/
```

## UI minima de demo

La UI vive en `public/demo` y se sirve desde el mismo backend en:

```text
http://localhost:3000/demo/
```

Flujo cubierto:

1. entrar a la pantalla de demo
2. iniciar sesion con Google usando `GET /api/auth/google`
3. ver datasets existentes
4. crear un dataset
5. abrir un dataset
6. registrar ventas diarias
7. ejecutar el analisis con `POST /api/anomalies/run/:datasetId`
8. ver anomalias detectadas

La UI guarda el token recibido del callback de Google en `localStorage` y lo envia como `Bearer token` en las llamadas protegidas.

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
- Plan de Sprint 4: [`docs/sprint-4-plan.md`](docs/sprint-4-plan.md)
- Evidencia de pruebas Sprint 4: [`docs/sprint-4-core-tests-evidence.md`](docs/sprint-4-core-tests-evidence.md)
- Plan breve de Sprint 5: [`docs/sprint-5-plan.md`](docs/sprint-5-plan.md)

## Entrega Sprint 4

- Evidencias del sprint: [`evidencias-sprint-3.html`](evidencias-sprint-3.html)
- Checklist de demo: [`docs/demo-checklist.md`](docs/demo-checklist.md)
- Planeacion de Sprint 4: [`docs/sprint-4-plan.md`](docs/sprint-4-plan.md)
- Evidencia de pruebas: [`docs/sprint-4-core-tests-evidence.md`](docs/sprint-4-core-tests-evidence.md)
- Rama base consolidada: `sprint4-base`

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
- `docs/sprint-4-plan.md`: objetivos del Sprint 4
- `docs/sprint-5-plan.md`: objetivos iniciales del Sprint 5
