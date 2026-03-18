# SalesGuard - Diseno inicial de base de datos

## Entidades principales

### User

| Campo | Tipo sugerido | Descripcion |
|-------|---------------|-------------|
| id | serial / int | Identificador primario |
| email | varchar unique | Correo del usuario |
| password_hash | varchar | Hash de contrasena |
| role | varchar | Rol del usuario |
| created_at | timestamp | Fecha de creacion |

### Dataset

| Campo | Tipo sugerido | Descripcion |
|-------|---------------|-------------|
| id | serial / int | Identificador primario |
| name | varchar | Nombre del dataset |
| user_id | int | Usuario propietario |
| created_at | timestamp | Fecha de creacion |

### DailySales

| Campo | Tipo sugerido | Descripcion |
|-------|---------------|-------------|
| id | serial / int | Identificador primario |
| dataset_id | int | Dataset asociado |
| date | date | Fecha de ventas agregadas |
| daily_sales | numeric | Total de ventas del dia |

### Anomaly

| Campo | Tipo sugerido | Descripcion |
|-------|---------------|-------------|
| id | serial / int | Identificador primario |
| dataset_id | int | Dataset analizado |
| date | date | Fecha detectada como anomala |
| score | numeric | Resultado del z-score |
| severity | varchar | Nivel de severidad |
| created_at | timestamp | Fecha de deteccion |

## Relaciones

- Un `User` puede tener muchos `Dataset`
- Un `Dataset` puede tener muchos `DailySales`
- Un `Dataset` puede generar muchas `Anomaly`

## Notas de implementacion

- La persistencia se implementara con PostgreSQL
- El ORM se decidira entre Prisma y Sequelize
- `DailySales` debe validar unicidad por `dataset_id + date`
- `Anomaly` se genera a partir de los registros persistidos del dataset
