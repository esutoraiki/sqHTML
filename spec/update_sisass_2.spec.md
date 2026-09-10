# Actualización y soporte de SISASS 2.0.2

## Estado

Completado.

## Historia de usuario

Como mantenedor de `sqhtml`, quiero corregir los problemas pendientes de la rama
`chore/update-deps-gulp` y actualizar SISASS a la versión `2.0.2`, para que la
instalación del paquete sea consistente, reporte correctamente los errores y genere
una plantilla SCSS compatible antes de integrar los cambios en `main`.

## Contexto

La versión `1.3.2` de `sqhtml` ya fue publicada desde la rama
`chore/update-deps-gulp`, mientras que `main` todavía no contiene esos cambios. La
rama implementa la copia de la plantilla y la inicialización automática de SISASS,
pero presenta inconsistencias en el lockfile, puede ocultar errores durante el
`postinstall` y declara un punto de entrada que no existe.

La corrección debe preparar la versión `1.3.3`, incorporar SISASS `2.0.2` y dejar la
rama lista para su integración en `main`. La publicación en npm se realizará en un
proceso posterior.

## Alcance

- Establecer la versión de `sqhtml` en `1.3.3` tanto en `package.json` como en el
  paquete raíz de `package-lock.json`.
- Actualizar la dependencia de SISASS de `1.1.27` a la versión exacta `2.0.2`.
- Regenerar `package-lock.json` para sincronizarlo con `package.json`.
- Adaptar los comandos, rutas, imports y configuración SCSS requeridos por SISASS
  `2.0.2`.
- Mantener la copia automática de la plantilla durante el `postinstall` sin
  sobrescribir archivos existentes en el proyecto consumidor.
- Mantener la conversión de `gitignore` a `.gitignore` sin sobrescribir un
  `.gitignore` existente.
- Mantener `SKIP_SISASS_INIT` como mecanismo para omitir explícitamente la
  inicialización de SISASS.
- Propagar mediante un código de salida distinto de cero los errores producidos al
  copiar la plantilla, gestionar `.gitignore` o inicializar SISASS.
- Eliminar el campo `main` de `package.json`, ya que `sqhtml` es una plantilla y no
  expone una API importable.
- Actualizar el README del proyecto para documentar el proceso final de instalación,
  SISASS `2.0.2` y `SKIP_SISASS_INIT`.
- Validar manualmente el paquete generado mediante una instalación limpia desde un
  tarball creado con `npm pack`.
- Integrar la rama corregida en `main` después de completar satisfactoriamente la
  validación manual.

## Fuera de alcance

- Crear pruebas automatizadas, scripts de prueba o infraestructura de testing.
- Mantener compatibilidad con versiones anteriores de SISASS.
- Publicar la versión `1.3.3` en npm.
- Modificar cambios locales ajenos a esta especificación, incluido el cambio
  existente en `files/config/serve.js`.
- Actualizar dependencias que no sean necesarias para soportar SISASS `2.0.2`.

## Reglas funcionales

1. SISASS debe instalarse exactamente en la versión `2.0.2`, sin rangos semánticos.
2. Una instalación normal debe inicializar SISASS automáticamente y sin solicitar
   interacción al usuario.
3. Si `SKIP_SISASS_INIT` está definido, la inicialización de SISASS debe omitirse y
   la instalación debe poder finalizar correctamente sin generar el núcleo SCSS.
4. La copia de la plantilla no debe sobrescribir archivos existentes en el proyecto
   consumidor.
5. Si el consumidor ya tiene `.gitignore`, este debe conservarse y el archivo
   duplicado `gitignore` debe eliminarse.
6. Si el consumidor no tiene `.gitignore`, el archivo `gitignore` copiado debe
   renombrarse a `.gitignore`.
7. Un fallo al copiar la plantilla, gestionar `.gitignore` o inicializar SISASS debe
   hacer que `npm install` termine con un código de salida distinto de cero.
8. Los mensajes de error deben identificar la etapa fallida y proporcionar una
   acción útil cuando la operación pueda ejecutarse manualmente.
9. Los archivos CSS o SVG compilados solo deben actualizarse cuando cambien como
   consecuencia directa del soporte de SISASS `2.0.2`.

## Criterios de aceptación

1. `package.json` declara `sqhtml` en la versión `1.3.3` y `sisass` exactamente en
   la versión `2.0.2`.
2. `package-lock.json` existe, utiliza un formato compatible con la versión actual de
   npm del proyecto y coincide con las dependencias y la versión raíz declaradas en
   `package.json`.
3. `package.json` no contiene el campo `main` ni anuncia otro punto de entrada
   inexistente.
4. Al instalar en un directorio temporal el tarball generado con `npm pack`, la
   plantilla se copia correctamente sin sobrescribir archivos preexistentes.
5. En una instalación normal, SISASS `2.0.2` se inicializa y genera los archivos
   SCSS requeridos por el proyecto.
6. Los imports, rutas y configuraciones SCSS utilizados por `sqhtml` no dependen de
   elementos eliminados o modificados de forma incompatible en SISASS `2.0.2`.
7. Las tareas `scss`, `scsssvg` y `process_svg` finalizan correctamente después de
   una instalación limpia.
8. El CSS recompilado y los SVG procesados coinciden con los artefactos versionados;
   si existen diferencias necesarias, los artefactos afectados se actualizan en el
   mismo cambio.
9. Cuando falla la copia de la plantilla, el `postinstall` muestra el error y termina
   con un código de salida distinto de cero.
10. Cuando falla el manejo requerido de `.gitignore`, el `postinstall` muestra el
    error y termina con un código de salida distinto de cero.
11. Cuando falla la inicialización de SISASS, el `postinstall` muestra un mensaje
    accionable y termina con un código de salida distinto de cero.
12. Cuando `SKIP_SISASS_INIT` está definido, SISASS no se ejecuta y la instalación
    finaliza correctamente si las demás operaciones tienen éxito.
13. Un `.gitignore` preexistente permanece intacto después de la instalación.
14. El README explica la instalación con SISASS `2.0.2`, el comportamiento del
    `postinstall`, el tratamiento de `.gitignore` y el uso de `SKIP_SISASS_INIT`.
15. La validación manual queda registrada antes de integrar la rama en `main`,
    indicando los comandos ejecutados y su resultado.
16. La rama solo se considera completada cuando todos los criterios anteriores se
    cumplen y puede integrarse en `main` sin incluir cambios locales ajenos.

## Validación requerida

La validación debe realizarse en un directorio temporal y cubrir, como mínimo, los
siguientes escenarios:

1. Empaquetado de `sqhtml` mediante `npm pack`.
2. Instalación limpia del tarball sin `SKIP_SISASS_INIT`.
3. Confirmación de la copia de la plantilla, creación de `.gitignore` y generación
   del núcleo SCSS.
4. Ejecución satisfactoria de las tareas `scss`, `scsssvg` y `process_svg`.
5. Comparación de los artefactos compilados con los archivos versionados.
6. Instalación con un `.gitignore` preexistente y confirmación de que se conserva.
7. Instalación con `SKIP_SISASS_INIT` y confirmación de que SISASS no se ejecuta.
8. Simulación separada de fallos en la copia, el manejo de `.gitignore` y la
   inicialización de SISASS, comprobando que cada caso produce un código de salida
   distinto de cero.

## Resultado de validación

Validación completada el 9 de septiembre de 2026 con Node.js y npm `12.0.1`:

- Se generó el tarball `sqhtml-1.3.3.tgz` mediante `npm pack`.
- Se instaló el tarball en un directorio temporal y se confirmó la generación de
  `assets/scss/core/` mediante SISASS `2.0.2`.
- Las tareas `scss`, `scsssvg` y `process_svg` finalizaron correctamente.
- Los CSS generados se copiaron a los artefactos versionados del paquete.
- Una instalación con `.gitignore` e `index.html` preexistentes conservó ambos
  archivos y eliminó únicamente el `gitignore` duplicado que copió el instalador.
- Una instalación con `SKIP_SISASS_INIT=1` finalizó correctamente sin generar
  `assets/scss/core/`.
- Los fallos simulados de copia, manejo de `.gitignore` e inicialización de SISASS
  finalizaron con código de salida `1`.
- npm `12.0.1` requirió aprobar explícitamente el script de dependencia con
  `npm install-scripts approve sqhtml` antes de ejecutar `npm rebuild sqhtml`; esta
  condición del consumidor quedó documentada en el README.
