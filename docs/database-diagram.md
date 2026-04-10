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

| Campo | Tipo | Reglas |
|-------|------|--------|
| id | SERIAL | Primary key |
| email | TEXT | Unico, requerido |
| password_hash | TEXT | Requerido |
| role | TEXT | Default `user` |
| created_at | TIMESTAMP | Default fecha actual |
| updated_at | TIMESTAMP | Se actualiza con Prisma |

## Siguientes tablas planeadas

En los siguientes sprints se agregaran las tablas:

- `datasets`
- `daily_sales`
- `anomalies`

La relacion planeada sigue siendo:

```text
users -> datasets -> daily_sales
datasets -> anomalies
```
