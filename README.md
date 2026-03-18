# SalesGuard

Base tecnica inicial del backend para el Proyecto Integrador.

## Scripts

- `npm run dev`: ejecuta el servidor en desarrollo
- `npm run build`: compila TypeScript a `dist/`
- `npm start`: ejecuta el build compilado

## Endpoints iniciales

- `GET /api/health`
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
