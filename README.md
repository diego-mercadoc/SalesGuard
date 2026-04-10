# SalesGuard

Base tecnica inicial del backend para el Proyecto Integrador.

## Scripts

- `npm run dev`: ejecuta el servidor en desarrollo
- `npm run build`: compila TypeScript a `dist/`
- `npm run db:generate`: genera el cliente de Prisma
- `npm run db:migrate`: aplica migraciones en desarrollo
- `npm run db:studio`: abre Prisma Studio
- `npm start`: ejecuta el build compilado

## Base de datos local

1. Copiar `.env.example` a `.env`
2. Ejecutar `docker compose up -d`
3. Ejecutar `npm run db:generate`
4. Ejecutar `npm run db:migrate`

## Endpoints iniciales

- `GET /api`
- `GET /api/health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /docs`

## Endpoints de autenticacion

### `POST /api/auth/register`

Crea un usuario nuevo.

Body:

```json
{
  "email": "juan@example.com",
  "password": "123456"
}
```

Respuesta exitosa:

```json
{
  "message": "Usuario registrado correctamente",
  "token": "jwt-token",
  "user": {
    "id": 1,
    "email": "juan@example.com",
    "role": "user",
    "createdAt": "2026-04-10T00:00:00.000Z",
    "updatedAt": "2026-04-10T00:00:00.000Z"
  }
}
```

Validaciones basicas:

- email requerido
- password requerido
- password minimo de 6 caracteres
- email duplicado

### `POST /api/auth/login`

Inicia sesion con un usuario existente.

Body:

```json
{
  "email": "juan@example.com",
  "password": "123456"
}
```

Respuesta exitosa:

```json
{
  "message": "Login exitoso",
  "token": "jwt-token",
  "user": {
    "id": 1,
    "email": "juan@example.com",
    "role": "user",
    "createdAt": "2026-04-10T00:00:00.000Z",
    "updatedAt": "2026-04-10T00:00:00.000Z"
  }
}
```

Validaciones basicas:

- email requerido
- password requerido
- credenciales invalidas

### `GET /api/auth/me`

Regresa la informacion del usuario autenticado.

Header requerido:

```text
Authorization: Bearer tu-token
```

Respuesta exitosa:

```json
{
  "user": {
    "id": 1,
    "email": "juan@example.com",
    "role": "user",
    "createdAt": "2026-04-10T00:00:00.000Z",
    "updatedAt": "2026-04-10T00:00:00.000Z"
  }
}
```

Validaciones basicas:

- token faltante
- token invalido

## Estructura base

- `src/config/`: configuracion compartida del proyecto
- `src/controllers/`: controladores HTTP
- `src/middlewares/`: middlewares globales
- `src/app.ts`: configuracion principal de Express
- `src/server.ts`: arranque del servidor
- `src/routes/`: rutas iniciales del proyecto
- `src/routes/auth.routes.ts`: rutas de autenticacion
- `src/controllers/auth.controller.ts`: logica de register, login y me
- `src/middlewares/auth.middleware.ts`: validacion de JWT
- `docs/`: documentacion tecnica del proyecto

## Documentacion

- `docs/architecture-initial.md`: arquitectura inicial del backend
- `docs/database-design-initial.md`: diseno inicial de base de datos
- `docs/demo-checklist.md`: guia breve para presentar Sprint 1
- `docs/notion-board-alignment.md`: alineacion entre tablero de Notion y trabajo implementado
- `docs/sprint-2-plan.md`: objetivos propuestos para el siguiente sprint
