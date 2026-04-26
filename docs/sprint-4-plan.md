# SalesGuard - Plan de Sprint 4

## Objetivo general

Pulir el codigo actual de SalesGuard y verificar su funcionamiento correcto mediante pruebas automatizadas, manteniendo el sistema estable y bien documentado para la entrega final.

## Objetivos tecnicos

1. Agregar unit testing para funciones y flujos clave del backend.
2. Implementar pruebas de endpoints para autenticacion, datasets, ventas diarias y anomalias.
3. Revisar y corregir posibles errores detectados durante las pruebas.
4. Hacer mejoras puntuales en estructura y legibilidad sin cambiar la arquitectura actual.
5. Optimizar respuestas, validaciones o consultas solo donde sea realmente necesario.
6. Completar la documentacion tecnica de la API y el flujo de pruebas.

## Entregables esperados

- Demo de pruebas automatizadas funcionando
- Reporte simple de cobertura o resumen de pruebas realizadas
- Revision completa del sistema y de los endpoints principales
- Swagger y README actualizados con el estado final del backend
- Evidencia consolidada del proyecto para la presentacion final
- Planeacion de Sprint 5

## Dependencias previas

- Mantener estable la autenticacion JWT ya implementada
- Reusar `Dataset`, `DailySales` y `Anomaly` sin cambiar la arquitectura actual
- Conservar el enfoque simple del proyecto para que siga siendo entendible para estudiantes
- Elegir herramientas de testing simples para Node.js + Express + TypeScript
