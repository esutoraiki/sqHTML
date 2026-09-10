# Registro de especificaciones

Este archivo registra las especificaciones del proyecto y su estado de
implementación.

Estados admitidos:

- `Sin implementar`: la implementación todavía no cumple todos los criterios de
  aceptación.
- `Completado`: la implementación y su validación satisfacen todos los criterios de
  aceptación.

| Spec | Descripción | Estatus |
| --- | --- | --- |
| [Actualización y soporte de SISASS 2.0.2](./update_sisass_2.spec.md) | Corrige el instalador, sincroniza los metadatos del paquete y añade soporte completo para SISASS 2.0.2. | Completado |
| [Inicialización explícita mediante el CLI de sqhtml](./explicit_cli_initialization.spec.md) | Sustituye el `postinstall` por el flujo explícito `npm install sqhtml` y `npx sqhtml init`. | Completado |
