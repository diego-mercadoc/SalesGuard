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
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/health`
- `GET /api/users`
- `GET /api/users/:id`
- `PATCH /api/users/:id`
- `DELETE /api/users/:id`
- `GET /docs`

## Estructura base

- `src/config/`: configuracion compartida del proyecto
- `src/controllers/`: controladores HTTP
- `src/middlewares/`: middlewares globales
- `src/app.ts`: configuracion principal de Express
- `src/server.ts`: arranque del servidor
- `src/routes/`: rutas iniciales del proyecto
- `docs/`: documentacion tecnica del proyecto

## Documentacion

- `docs/architecture-initial.md`: arquitectura inicial del backend
- `docs/database-design-initial.md`: diseno inicial de base de datos
- `docs/demo-checklist.md`: guia breve para presentar Sprint 1
- `docs/notion-board-alignment.md`: alineacion entre tablero de Notion y trabajo implementado
- `docs/sprint-2-plan.md`: objetivos propuestos para el siguiente sprint
