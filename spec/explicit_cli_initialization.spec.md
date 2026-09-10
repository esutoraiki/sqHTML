# Inicialización explícita mediante el CLI de sqhtml

## Estado

Completado.

## Historia de usuario

Como usuario de `sqhtml`, quiero instalar el paquete sin ejecutar acciones
automáticas y después inicializar la plantilla mediante un comando explícito, para
controlar cuándo y dónde se copian los archivos del proyecto y se configura SISASS.

## Flujo principal

```bash
npm install sqhtml
npx sqhtml init
```

La instalación mediante npm solo debe añadir el paquete y sus dependencias. La
creación de la plantilla debe comenzar exclusivamente cuando el usuario ejecute
`npx sqhtml init`.

## Requisitos

- Node.js 22 o superior.
- npm.
- Un proyecto consumidor con un archivo `package.json`.
- `sqhtml` instalado como dependencia del proyecto consumidor.

## Alcance

- Eliminar el script `postinstall` de `package.json`.
- Registrar un ejecutable de paquete llamado `sqhtml`.
- Incorporar el comando `sqhtml init`.
- Usar el directorio de trabajo actual como destino predeterminado.
- Permitir seleccionar otro destino mediante `--path`.
- Detectar y mostrar los archivos existentes que entren en conflicto con la
  plantilla.
- Solicitar confirmación solamente cuando existan conflictos y no se haya indicado
  `--force`.
- Copiar la plantilla sin sobrescribir archivos existentes de manera predeterminada.
- Incorporar `--force` para sobrescribir los archivos administrados por la
  plantilla, excepto un `.gitignore` existente.
- Gestionar la conversión del archivo `gitignore` de la plantilla a `.gitignore`.
- Inicializar SISASS `2.0.2` en modo SQHTML.
- Mantener `SKIP_SISASS_INIT` como mecanismo para omitir la inicialización de
  SISASS.
- Propagar los errores mediante un código de salida distinto de cero.
- Proporcionar ayuda y versión desde el CLI.
- Actualizar el README y los metadatos del paquete para documentar el nuevo flujo.
- Validar manualmente la instalación y la inicialización desde un tarball generado
  con `npm pack`.

## Fuera de alcance

- Crear pruebas automatizadas o infraestructura de testing.
- Añadir comandos distintos de `init`, `--help` y `--version`.
- Revertir automáticamente los archivos copiados antes de un fallo.
- Mantener la ejecución directa de `node node_modules/sqhtml/install.js` como una
  interfaz pública.
- Publicar una nueva versión en npm.
- Crear commits o integrar la rama en `main`.
- Modificar cambios locales ajenos a esta especificación.

## Comandos

### Inicialización predeterminada

```bash
npx sqhtml init
```

Inicializa la plantilla en el directorio de trabajo actual.

### Destino personalizado

```bash
npx sqhtml init --path ./example
```

Acepta rutas relativas al directorio de trabajo actual y rutas absolutas. El
destino debe existir y contener un archivo `package.json`.

### Sobrescritura explícita

```bash
npx sqhtml init --force
```

Sobrescribe los archivos administrados por la plantilla sin solicitar confirmación.
Un `.gitignore` existente siempre debe conservarse.

`--force` puede combinarse con `--path`:

```bash
npx sqhtml init --path ./example --force
```

### Ayuda y versión

```bash
npx sqhtml --help
npx sqhtml init --help
npx sqhtml --version
```

## Reglas funcionales

1. `npm install sqhtml` no debe copiar archivos, crear `.gitignore` ni inicializar
   SISASS.
2. El CLI debe resolver el destino antes de realizar cualquier escritura.
3. Sin `--path`, el destino debe ser el directorio de trabajo actual.
4. Con `--path`, las rutas relativas deben resolverse desde el directorio de trabajo
   actual.
5. La inicialización debe fallar antes de copiar archivos cuando el destino no
   existe, no es un directorio o no contiene `package.json`.
6. Cuando no existan conflictos, la inicialización debe comenzar sin solicitar
   confirmación.
7. Cuando existan conflictos y no se use `--force`, el CLI debe mostrar los archivos
   afectados y solicitar una única confirmación antes de continuar.
8. Si el usuario rechaza la confirmación, el comando debe finalizar sin modificar el
   destino y con código de salida `0`.
9. Si el usuario acepta la confirmación sin `--force`, los archivos existentes deben
   conservarse y la inicialización debe copiar únicamente los archivos faltantes.
10. Si no es posible solicitar la confirmación por no existir una terminal
    interactiva, el comando debe abortar sin modificar archivos, explicar el motivo
    y devolver un código de salida distinto de cero.
11. Con `--force`, el CLI debe sobrescribir los archivos de la plantilla sin
    solicitar confirmación.
12. `--force` nunca debe sobrescribir, vaciar ni eliminar un `.gitignore` existente.
13. Si el destino no tiene `.gitignore`, el archivo `gitignore` copiado debe
    renombrarse a `.gitignore`.
14. Si el destino ya tiene `.gitignore`, el archivo debe conservarse y no debe quedar
    un `gitignore` duplicado creado por la inicialización.
15. Después de copiar la plantilla, el CLI debe inicializar SISASS `2.0.2` mediante
    el modo SQHTML.
16. Cuando `SKIP_SISASS_INIT` esté definido, la plantilla debe copiarse, pero SISASS
    no debe ejecutarse.
17. Ejecutar `init` varias veces debe ser seguro y no debe duplicar ni corromper la
    estructura del proyecto.
18. Un fallo de copia, gestión de `.gitignore` o inicialización de SISASS debe mostrar
    la etapa que falló y finalizar con un código de salida distinto de cero.
19. Si ocurre un fallo después de una escritura parcial, los archivos ya copiados
    deben conservarse y el mensaje debe indicar que no se realizó una reversión.
20. Un comando u opción desconocidos deben mostrar un error, presentar la ayuda
    correspondiente y devolver un código de salida distinto de cero.

## Criterios de aceptación

1. `package.json` no contiene un script `postinstall`.
2. `package.json` registra un ejecutable llamado `sqhtml` que npm incluye en el
   tarball.
3. `package.json` declara compatibilidad con Node.js 22 o superior.
4. Una instalación limpia mediante `npm install` desde el tarball no crea fuera de
   `node_modules` ningún archivo perteneciente a la plantilla.
5. Después de la instalación, `npx sqhtml --version` muestra la misma versión
   declarada por el paquete y termina correctamente.
6. `npx sqhtml --help` y `npx sqhtml init --help` describen los comandos y opciones
   disponibles y terminan correctamente.
7. `npx sqhtml init` ejecutado en un proyecto sin conflictos copia la plantilla sin
   solicitar confirmación.
8. La inicialización predeterminada crea `.gitignore`, elimina el nombre provisional
   `gitignore` e inicializa SISASS `2.0.2`.
9. `npx sqhtml init --path <destino>` inicializa el proyecto en el destino indicado y
   no escribe la plantilla en el directorio desde el cual se invocó el comando.
10. Cuando existen conflictos, el CLI los muestra y solicita una única confirmación.
11. Al rechazar la confirmación, ningún archivo del destino cambia.
12. Al aceptar la confirmación, los archivos existentes se conservan y se copian los
    faltantes.
13. Con `--force`, los archivos de plantilla existentes se reemplazan sin solicitar
    confirmación y un `.gitignore` existente permanece intacto.
14. Con `SKIP_SISASS_INIT=1`, la inicialización termina correctamente sin generar
    `assets/scss/core/`.
15. Sin `SKIP_SISASS_INIT`, SISASS genera correctamente `assets/scss/core/`.
16. Después de una inicialización completa, las tareas `scss`, `scsssvg` y
    `process_svg` finalizan correctamente.
17. Los fallos simulados de copia, `.gitignore` y SISASS devuelven un código de salida
    distinto de cero y presentan mensajes accionables.
18. Una segunda ejecución de `npx sqhtml init` conserva un proyecto válido y aplica
    las mismas reglas de conflictos.
19. Un destino inválido o sin `package.json` no recibe escrituras y produce un código
    de salida distinto de cero.
20. El README documenta el flujo `npm install sqhtml` seguido de `npx sqhtml init`,
    además de `--path`, `--force`, `SKIP_SISASS_INIT`, ayuda, versión y requisitos.
21. `package-lock.json` permanece sincronizado con `package.json`.
22. La versión objetivo continúa siendo `1.3.3` mientras esa versión no haya sido
    publicada.

## Validación requerida

La validación debe realizarse desde un tarball creado con `npm pack` y cubrir, como
mínimo:

1. Instalación limpia sin ejecución automática del inicializador.
2. Ayuda y versión del CLI.
3. Inicialización sin conflictos en el directorio actual.
4. Inicialización en un destino proporcionado mediante `--path`.
5. Aceptación y rechazo de la confirmación ante conflictos.
6. Inicialización con `--force`, comprobando la preservación de `.gitignore`.
7. Inicialización con `SKIP_SISASS_INIT=1`.
8. Segunda ejecución sobre un proyecto ya inicializado.
9. Ejecución de `scss`, `scsssvg` y `process_svg`.
10. Simulación separada de fallos de copia, `.gitignore` y SISASS.
11. Ejecución con destino inexistente, destino que no sea un directorio y destino sin
    `package.json`.
12. Ejecución de comandos y opciones desconocidos.

## Validación ejecutada

Validado el 2026-09-09 desde el tarball `/tmp/sqhtml-1.3.3.tgz`.

- `npm install /tmp/sqhtml-1.3.3.tgz` no creó archivos de plantilla fuera de
  `node_modules`.
- `npx sqhtml --version`, `npx sqhtml --help` y `npx sqhtml init --help`
  finalizaron correctamente.
- `npx sqhtml init` copió la plantilla, creó `.gitignore`, no dejó `gitignore` e
  inicializó SISASS `2.0.2`.
- `npx sqhtml init --path <destino>` inicializó el destino indicado sin escribir la
  plantilla en el directorio invocador.
- La aceptación interactiva ante conflictos conservó archivos existentes y copió los
  faltantes.
- El rechazo interactivo ante conflictos finalizó con código `0` sin modificar el
  destino.
- El caso no interactivo con conflictos abortó con código distinto de cero.
- `npx sqhtml init --force` reemplazó archivos administrados por la plantilla y
  conservó `.gitignore`.
- `SKIP_SISASS_INIT=1 npx sqhtml init` copió la plantilla sin generar
  `assets/scss/core/`.
- Las tareas `npx gulp scss`, `npx gulp scsssvg` y `npx gulp process_svg`
  finalizaron correctamente tras una inicialización completa.
- Los destinos inválidos sin `package.json` y los comandos desconocidos devolvieron
  código distinto de cero.
