# SalesGuard - Plan de Sprint 3

## Objetivo general

Pasar de la base de autenticacion y usuarios al flujo principal del producto: cargar datasets de ventas y prepararlos para analisis posterior.

## Objetivos tecnicos

1. Crear modelo `Dataset` para registrar cargas por usuario
2. Crear modelo `DailySales` para almacenar filas del CSV
3. Agregar migraciones para las nuevas tablas
4. Implementar endpoint inicial para registrar o subir datasets
5. Validar la estructura minima del archivo CSV
6. Preparar la base para deteccion de anomalias en el siguiente sprint

## Entregables esperados

- Tablas `datasets` y `daily_sales`
- Endpoint inicial de datasets documentado en Swagger
- Validaciones basicas para archivos y columnas
- README actualizado con flujo de carga local

## Dependencias previas

- Mantener estable la autenticacion JWT del Sprint 2
- Reusar el modelo `User` como relacion duena de cada dataset
- Confirmar el formato de ventas diarias antes de cerrar `DailySales`
