# SalesGuard - Diagrama de base de datos

## Diagrama actual

```text
+----------------+       +----------------+       +----------------+
| users          |       | datasets       |       | daily_sales    |
+----------------+       +----------------+       +----------------+
| id             |<------| user_id        |       | id             |
| email          |       | id             |<------| dataset_id     |
| password_hash  |       | name           |       | date           |
| role           |       | description    |       | daily_sales    |
| created_at     |       | created_at     |       | created_at     |
| updated_at     |       | updated_at     |       | updated_at     |
+----------------+       +----------------+       +----------------+
                              ^
                              |
                       +----------------+
                       | anomalies      |
                       +----------------+
                       | id             |
                       | dataset_id     |
                       | date           |
                       | value          |
                       | score          |
                       | severity       |
                       | created_at     |
                       +----------------+
```

## Tabla `users`

Corresponde al modelo `User` definido en Prisma.

| Campo | Tipo | Reglas |
|-------|------|--------|
| id | SERIAL | Primary key |
| email | TEXT | Unico, requerido |
| password_hash | TEXT | Requerido |
| role | TEXT | Default `user` |
| created_at | TIMESTAMP | Default fecha actual |
| updated_at | TIMESTAMP | Se actualiza automaticamente en cada update |

## Tabla `datasets`

Corresponde al modelo `Dataset` definido en Prisma.

| Campo | Tipo | Reglas |
|-------|------|--------|
| id | SERIAL | Primary key |
| name | TEXT | Requerido |
| description | TEXT | Opcional |
| user_id | INTEGER | Foreign key a `users.id` |
| created_at | TIMESTAMP | Default fecha actual |
| updated_at | TIMESTAMP | Se actualiza automaticamente en cada update |

## Tabla `daily_sales`

Corresponde al modelo `DailySales` definido en Prisma.

| Campo | Tipo | Reglas |
|-------|------|--------|
| id | SERIAL | Primary key |
| dataset_id | INTEGER | Foreign key a `datasets.id` |
| date | DATE | Requerido |
| daily_sales | DECIMAL(12, 2) | Requerido |
| created_at | TIMESTAMP | Default fecha actual |
| updated_at | TIMESTAMP | Se actualiza automaticamente en cada update |

Regla adicional:

- `dataset_id` y `date` son unicos en conjunto.

## Tabla `anomalies`

Corresponde al modelo `Anomaly` definido en Prisma.

| Campo | Tipo | Reglas |
|-------|------|--------|
| id | SERIAL | Primary key |
| dataset_id | INTEGER | Foreign key a `datasets.id` |
| date | DATE | Requerido |
| value | DECIMAL(12, 2) | Valor de venta detectado como anomalia |
| score | DECIMAL(8, 4) | Score estadistico calculado |
| severity | TEXT | Severidad de la anomalia |
| created_at | TIMESTAMP | Default fecha actual |

## Relacion con la API

- `POST /api/auth/register` crea registros en `users`
- `POST /api/auth/login` valida `email` y `password_hash`
- `GET /api/auth/me` consulta el usuario autenticado
- `POST /api/datasets` crea datasets asociados a usuarios
- `GET /api/datasets` consulta datasets
- `POST /api/daily-sales` registra ventas diarias agregadas
- `GET /api/daily-sales` consulta ventas diarias
- `POST /api/anomalies/run/:datasetId` ejecuta el analisis de anomalias
- `GET /api/anomalies` consulta anomalias guardadas

## Relaciones principales

- Un usuario puede tener muchos datasets.
- Un dataset pertenece a un usuario.
- Un dataset puede tener muchas ventas diarias.
- Un dataset puede tener muchas anomalias.
