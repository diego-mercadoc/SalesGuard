# SalesGuard

SalesGuard es un proyecto integrador de backend construido con Node.js, Express, TypeScript, Prisma y PostgreSQL.

El sistema permite:

- registrar usuarios con JWT o con Google OAuth
- crear datasets de ventas diarias
- guardar ventas agregadas por fecha
- ejecutar un analisis simple de anomalias con z-score
- consultar resultados por API y por Swagger
- enviar una notificacion por email o dejarla en modo demo por consola

El proyecto se mantiene simple a proposito. La arquitectura base del backend sigue en:

- `src/config`
- `src/controllers`
- `src/routes`
- `src/middlewares`

## Stack y alcance

- Backend API: Express + TypeScript
- Base de datos: PostgreSQL + Prisma
- Autenticacion: JWT y Google OAuth
- Tests: Jest + Supertest
- Documentacion de endpoints: Swagger en `/docs`

Este repositorio no incluye un frontend dedicado. Si el equipo usa una UI minima en otro repo o proceso, esa UI se corre por separado y consume esta API.

## Requisitos

- Node.js 20 o superior
- npm
- PostgreSQL local o una instancia remota
- Docker opcional para levantar PostgreSQL local con `docker compose`

## Scripts

- `npm run dev`: inicia el backend en modo desarrollo
- `npm run build`: compila TypeScript a `dist/`
- `npm test`: ejecuta las pruebas con Jest y Supertest
- `npm run db:generate`: genera el cliente de Prisma
- `npm run db:migrate`: aplica migraciones en desarrollo
- `npm run db:deploy`: aplica migraciones para produccion
- `npm run db:studio`: abre Prisma Studio
- `npm start`: ejecuta la version compilada
- `npm run render:build`: genera Prisma y compila para Render
- `npm run render:start`: aplica migraciones y arranca la API en Render

## Variables de entorno

Copia `.env.example` a `.env` para trabajar localmente.

| Variable | Requerida | Uso |
| --- | --- | --- |
| `NODE_ENV` | si | entorno de ejecucion |
| `PORT` | si en local | puerto del backend; Render lo inyecta automaticamente |
| `API_PREFIX` | si | prefijo base de la API, por defecto `/api` |
| `DATABASE_URL` | si | conexion a PostgreSQL |
| `JWT_SECRET` | si | firma de tokens JWT |
| `GOOGLE_CLIENT_ID` | solo si usas Google login | client id de OAuth |
| `GOOGLE_CLIENT_SECRET` | solo si usas Google login | client secret de OAuth |
| `GOOGLE_REDIRECT_URI` | solo si usas Google login | callback del backend, por ejemplo `http://localhost:3000/api/auth/google/callback` en local |
| `GOOGLE_AUTH_SUCCESS_REDIRECT` | opcional | URL de la UI para redirigir con `token`, `userId` y `email` |
| `GOOGLE_AUTH_FAILURE_REDIRECT` | opcional | URL de la UI para redirigir errores de Google OAuth |
| `EMAIL_HOST` | opcional | host SMTP para notificaciones |
| `EMAIL_PORT` | opcional | puerto SMTP |
| `EMAIL_USER` | opcional | usuario SMTP |
| `EMAIL_PASS` | opcional | password SMTP |
| `EMAIL_FROM` | opcional | remitente del correo |

Notas utiles:

- Si `GOOGLE_AUTH_SUCCESS_REDIRECT` y `GOOGLE_AUTH_FAILURE_REDIRECT` quedan vacias, el callback de Google responde JSON y el backend se puede probar desde Swagger o Postman.
- Si `EMAIL_HOST` queda vacio, el analisis de anomalias sigue funcionando y el correo queda en modo demo con salida por consola.
- No subas secretos reales a Git. Los valores reales van en `.env` local o en las variables del servicio en Render.

## Como correrlo localmente

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables

```bash
cp .env.example .env
```

Configura al menos:

- `DATABASE_URL`
- `JWT_SECRET`
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` y `GOOGLE_REDIRECT_URI` si vas a probar Google login

### 3. Levantar PostgreSQL local

Si quieres usar Docker:

```bash
docker compose up -d
```

### 4. Preparar Prisma

```bash
npm run db:generate
npm run db:migrate
```

### 5. Arrancar el backend

```bash
npm run dev
```

La API queda disponible en:

- `http://localhost:3000/api`
- `http://localhost:3000/api/health`
- `http://localhost:3000/docs`

## Backend y UI si van separados

En este repo solo vive el backend.

- Para desarrollo normal, basta con correr `npm run dev`.
- Si existe una UI minima externa, debes correrla en su propio repo o proceso.
- Esa UI debe consumir la API en `http://localhost:3000/api` o en la URL de Render.
- Para el flujo de Google login con UI, configura `GOOGLE_AUTH_SUCCESS_REDIRECT` y `GOOGLE_AUTH_FAILURE_REDIRECT` con URLs de esa UI.
- Si no hay UI disponible, el flujo se puede demostrar desde Swagger/Postman porque el callback de Google puede responder JSON.

## Login con Google

Flujo basico:

1. Configurar `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` y `GOOGLE_REDIRECT_URI`.
2. Abrir `GET /api/auth/google`.
3. Google redirige a `GET /api/auth/google/callback`.
4. SalesGuard obtiene el email, busca o crea el usuario local y genera el JWT.

Para local, el callback esperado es:

```text
http://localhost:3000/api/auth/google/callback
```

Para produccion en Render, el callback debe apuntar a:

```text
https://TU-SERVICIO.onrender.com/api/auth/google/callback
```

Ese callback de produccion tambien debe registrarse en Google Cloud Console.

## Flujo principal del sistema

1. Crear un usuario con `POST /api/auth/register` o iniciar sesion con `POST /api/auth/login`.
2. Crear un dataset con `POST /api/datasets`.
3. Registrar ventas diarias con `POST /api/daily-sales`.
4. Ejecutar el analisis con `POST /api/anomalies/run/:datasetId`.
5. Consultar el resultado con `GET /api/anomalies`.
6. Revisar Swagger en `GET /docs`.

## Tests y validacion

```bash
npm test
npm run build -- --noEmit
```

`npm test` valida endpoints con Jest y Supertest. `npm run build -- --noEmit` comprueba que TypeScript siga compilando sin emitir archivos.

## Deploy basico en Render

Tipo de servicio recomendado:

- Web Service de Node/Express

Comandos:

- Build Command: `npm install && npm run render:build`
- Start Command: `npm run render:start`

Variables minimas para Render:

- `DATABASE_URL`
- `JWT_SECRET`

Variables adicionales segun el demo:

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

Notas de deploy:

- `PORT` no necesita configurarse manualmente en Render; la plataforma la inyecta.
- `NODE_ENV=production` lo asigna Render en runtime; puedes dejarlo explicito si quieres, pero no es obligatorio para este proyecto.
- Health Check Path recomendado: `/api/health`.
- Este repo usa `npm run db:deploy` dentro de `npm run render:start` para mantener el deploy simple en entornos estudiantiles. Si usas un plan de Render con Pre-Deploy Command, puedes mover ahi las migraciones.
- Si vas a mostrar Google login en produccion, actualiza `GOOGLE_REDIRECT_URI` a la URL publica del servicio y registra la misma URL en Google Cloud Console.
- Si vas a mostrar una UI externa, usa sus URLs publicas en `GOOGLE_AUTH_SUCCESS_REDIRECT` y `GOOGLE_AUTH_FAILURE_REDIRECT`.

## Endpoints principales

Publicos:

- `GET /api`
- `GET /api/health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/google`
- `GET /api/auth/google/callback`
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

Rutas de usuarios:

- `GET /api/users`
- `GET /api/users/:id`
- `POST /api/users`
- `PUT /api/users/:id`
- `DELETE /api/users/:id`

## Estructura base

- `src/config/`: configuracion compartida
- `src/controllers/`: controladores HTTP
- `src/routes/`: rutas de la API
- `src/middlewares/`: middlewares globales
- `prisma/`: schema y migraciones
- `tests/`: pruebas automatizadas
- `docs/`: documentacion de apoyo

## Documentacion adicional

- `docs/demo-checklist.md`: guia breve de deploy y demo final
- `docs/database-diagram.md`: diagrama de base de datos
- `docs/architecture-initial.md`: arquitectura inicial
- `docs/database-design-initial.md`: diseno inicial de base de datos
- `docs/sprint-3-plan.md`: objetivos del Sprint 3
- `docs/sprint-4-plan.md`: objetivos del Sprint 4
- `docs/sprint-4-core-tests-evidence.md`: evidencia de pruebas del Sprint 4
- `docs/sprint-5-plan.md`: plan breve del Sprint 5
