# SalesGuard - Diagrama de base de datos Sprint 2

## Diagrama actual

```text
+----------------+
| users          |
+----------------+
| id             |
| email          |
| password_hash  |
| role           |
| created_at     |
| updated_at     |
+----------------+
```

## Tabla `users`

La tabla actual del Sprint 2 corresponde al modelo `User` definido en Prisma.

| Campo | Tipo | Reglas |
|-------|------|--------|
| id | SERIAL | Primary key |
| email | TEXT | Unico, requerido |
| password_hash | TEXT | Requerido |
| role | TEXT | Default `user` |
| created_at | TIMESTAMP | Default fecha actual |
| updated_at | TIMESTAMP | Se actualiza automaticamente en cada update |

## Relacion con la API

- `POST /api/auth/register` crea registros en `users`
- `POST /api/auth/login` valida `email` y `password_hash`
- `GET /api/auth/me` consulta el usuario autenticado

## Siguiente paso sugerido

En el siguiente sprint se pueden agregar tablas relacionadas a la carga de datasets y ventas diarias:

- `datasets`
- `daily_sales`
- `anomalies`
