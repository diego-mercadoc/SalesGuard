# SalesGuard - Alineacion con tablero de Notion

## Referencia del tablero

Tablero compartido:

- `https://www.notion.so/3155b0ab2a4880e9ad03dea2d60f7d9c?v=3155b0ab2a48817e81f2000cab1b640c`

Este documento resume la asignacion visible en el tablero y la compara con lo implementado en el repo durante Sprint 1.

## Asignacion por responsable segun Notion

### Juan Pablo

- Semana 1: Inicializar proyecto Node + TypeScript
- Semana 1: Configurar Express y ruta `/health`
- Semana 2: Implementar endpoint registro
- Semana 2: Implementar endpoint login
- Semana 2: Middleware autenticacion
- Semana 3: Endpoint crear dataset
- Semana 3: Implementar carga CSV
- Semana 4: Endpoint ejecutar analisis
- Semana 6: Endpoint listado con filtros
- Semana 6: Manejo global de errores
- Semana 7: Test login
- Semana 7: Test carga dataset
- Semana 8: Deploy backend

### Diego

- Semana 1: Configurar PostgreSQL y conexion
- Semana 1: Configurar ORM y primera migracion
- Semana 2: Crear modelo Usuario
- Semana 3: Crear modelo Dataset
- Semana 3: Crear modelo DailySales
- Semana 4: Funcion promedio y desviacion
- Semana 4: Implementar z-score
- Semana 4: Crear modelo Anomaly
- Semana 6: Historial de ejecuciones
- Semana 7: Unit test analisis
- Semana 8: Configurar DB produccion

### Carlos

- Semana 1: Configurar Swagger
- Semana 3: Manejo de errores CSV
- Semana 5: Vista login
- Semana 5: Vista carga dataset
- Semana 5: Vista resultados
- Semana 7: Configurar GitHub Actions
- Semana 8: Deploy frontend
- Semana 8: Documentacion final README

## Revision de Sprint 1 frente al tablero

### Lo asignado a Diego en Sprint 1 segun Notion

- Configurar PostgreSQL y conexion
- Configurar ORM y primera migracion

### Lo que realmente quedo implementado en este repo en Sprint 1

- Inicializacion del proyecto con Node + TypeScript
- Configuracion de Express
- Ruta de salud y estructura base de API
- Configuracion centralizada de entorno
- Middlewares globales base
- Swagger en `/docs`
- Documentacion inicial de arquitectura
- Documentacion inicial de base de datos
- Checklist de demo y plan de Sprint 2

## Conclusion de alineacion

Con base en el tablero de Notion, el trabajo implementado en Sprint 1 **no se limito solo a las tareas asignadas a Diego**.

En la practica, el repo actual ya cubre trabajo que en Notion aparecia repartido entre:

- Diego
- Juan Pablo
- Carlos

## Impacto para el equipo

Esto significa que, para mantener consistencia con la planeacion del tablero:

1. Juan Pablo y Carlos deben tomar desde el siguiente sprint tareas nuevas segun el backlog.
2. Si quieren mantener trazabilidad academica, conviene aclarar en la presentacion que Sprint 1 cerro con apoyo concentrado en una sola persona en la parte tecnica base.
3. Si el equipo quiere reflejar el avance real, el tablero de Notion deberia actualizar estatus y notas de implementacion.

## Estado de integracion con Notion

- El tablero de Notion ya queda **referenciado** en la documentacion del proyecto.
- No existe en este entorno una integracion API activa con Notion ni credenciales configuradas para sincronizacion automatica.
- La alineacion actual se documento manualmente a partir del tablero compartido y la evidencia del repo.
