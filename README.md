# Álbum Matemático Virtual con Google Sheets

Este paquete trae la interfaz del álbum y el backend para sincronizar con Google Sheets usando Google Apps Script.

## Estructura
- `index.html`
- `styles.css`
- `app.js`
- `README.md`
- carpeta `images/`
- archivo backend para Apps Script: `Code.gs` (está incluido en este README para copiarlo)

---

## 1) Preparar Google Sheets

Crea una hoja de cálculo de Google y luego una pestaña llamada:

**Progress**

Encabezados en la fila 1:

| username | fullName | unlockedByPageJSON | usedCodesByPageJSON | validatedByPageJSON | unlockedAtJSON | notesByPageJSON | achievementsJSON | updatedAt |
|---|---|---|---|---|---|---|---|---|

No hace falta crear más columnas.

---

## 2) Crear el backend en Apps Script

En tu Google Sheet:

**Extensiones → Apps Script**

Crea un archivo `Code.gs` y pega el contenido que está en el archivo `Code.gs` de este paquete.

Luego guarda.

---

## 3) Desplegar como aplicación web

En Apps Script:

**Implementar → Nueva implementación → Aplicación web**

Configura:
- **Ejecutar como:** tú
- **Quién tiene acceso:** Cualquiera con el enlace

Guarda y copia la URL que termina en `/exec`.

Esa URL se pega en `app.js` en esta línea:

```js
const API_URL = "PEGA_AQUI_LA_URL_DE_TU_APPS_SCRIPT";
```

### Codigo de administrador
El panel docente valida el codigo desde Apps Script. Por defecto usa `ADMIN2024`.
Para cambiarlo sin tocar el front-end:

1. En Apps Script abre **Configuracion del proyecto**.
2. Agrega una propiedad de script llamada `ADMIN_CODE`.
3. Escribe el codigo nuevo como valor.

### Codigos de laminas en Google Sheets
El backend crea automaticamente una pestaña llamada `Codes` cuando se genera o valida un codigo.
Columnas:

| code | pageKey | cardIndex | type | active | usedBy | usedAt | createdAt | note |
|---|---|---:|---|---|---|---|---|---|

- `type` puede ser `unlock` para laminas o `teacher` para validacion docente.
- `cardIndex` empieza en `0`: la primera lamina es `0`, la segunda es `1`, y asi sucesivamente.
- Los codigos `unlock` se marcan con `usedBy` y `usedAt` cuando un estudiante los usa.
- Los codigos `teacher` se pueden crear manualmente en esa hoja o desde Apps Script si se agrega un generador especifico.

---

## 4) Cómo cargar el front-end

No abras `index.html` con doble clic si quieres usar Google Sheets, porque desde `file://` el navegador puede bloquear peticiones.

Usa una de estas opciones:

- **VS Code + Live Server**
- **GitHub Pages**
- **Netlify**
- **Vercel**

La forma más sencilla para probar es **Live Server**.

---

## 5) Cómo poner las imágenes

La app usa esta convención:

```text
images/<clave_de_pagina>/<numero_de_lamina>.png
```

### Ejemplo para la página `mixtos`
Crea esta carpeta:

```text
images/mixtos/
```

Y dentro coloca:

```text
images/mixtos/1.png
images/mixtos/2.png
images/mixtos/3.png
images/mixtos/4.png
images/mixtos/5.png
images/mixtos/6.png
```

### Ejemplo para la página `enteros`
```text
images/enteros/1.png
images/enteros/2.png
images/enteros/3.png
images/enteros/4.png
images/enteros/5.png
images/enteros/6.png
```

Puedes usar:
- `.png`
- `.jpg`
- `.jpeg`
- `.webp`

Si una imagen no existe, la tarjeta muestra un aviso visual y la app sigue funcionando.

---

## 6) Cómo agregar nuevas páginas

En `app.js`, busca el arreglo `PAGES`.

Cada página debe tener:

- `key`: nombre de la carpeta en `images`
- `title`: nombre visible
- `description`: texto corto
- `teacherValidationCode`: código para validar con docente
- `cards`: arreglo de 6 láminas

Cada lámina debe tener:
- `title`
- `image`
- `unlockCodes`

### Ejemplo
```js
{
  key: "geometria",
  title: "Página 3 · Geometría básica",
  description: "Tema nuevo",
  teacherValidationCode: "VAL-GEO-03",
  cards: [
    { title: "Ángulos", image: "images/geometria/1.png", unlockCodes: ["GEO-A1"] },
    ...
  ]
}
```

---

## 7) Cómo funciona el guardado en la nube

- El estudiante entra con su `username`
- La app consulta Google Sheets
- Carga el progreso si ya existe
- Cada vez que desbloquea una lámina, se guarda automáticamente
- Cuando completas la página y validas con el docente, también se guarda

---

## 8) Qué hace el código de desbloqueo

Un código:
- desbloquea **una sola lámina**
- en **una sola página**
- y queda marcado como usado en esa página para ese estudiante

Si el mismo código se intenta reutilizar dentro de la misma página y para el mismo estudiante, la app lanza error.

---

## 9) Qué hace la validación docente

Cuando el estudiante completa la página:
1. aparece el botón de validación
2. tú pides la sustentación
3. ingresas el código de validación de la página
4. queda marcada como evaluada en la nube

---

## 10) Paso a paso mínimo para probar

1. Pega `Code.gs` en Apps Script
2. Despliega el Web App
3. Copia la URL en `app.js`
4. Abre el front-end con Live Server
5. Entra con un usuario válido
6. Ingresa un código de la página
7. Verifica que el progreso se guarde en Sheets

---

## 11) Importante sobre seguridad

Este sistema está pensado para uso escolar y práctico.  
La validación real sigue dependiendo de tu revisión docente y no solo del código.

---

## 12) Archivos de este paquete

- `index.html`
- `styles.css`
- `app.js`
- `Code.gs`  ← contenido del backend
