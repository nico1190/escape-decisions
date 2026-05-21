# Compartir el juego con otra persona

Escape Decisions es una app web estática — un solo `index.html` + JS + CSS. Sin
backend, sin base de datos. Tu progreso vive en el `localStorage` del navegador
de cada jugador. Hay 3 formas de compartirlo, de más simple a más completa:

---

## Opción 1 — Netlify Drop (la más rápida, sin cuenta)

**5 minutos. No necesitás GitHub, ni saber comandos avanzados.**

1. En la carpeta del proyecto corré:

   ```bash
   npm install
   npm run build
   ```

   Esto genera la carpeta `dist/`.

2. Abrí <https://app.netlify.com/drop> en el navegador.

3. **Arrastrá la carpeta `dist/`** entera adentro de la zona de drop.

4. Netlify te devuelve una URL pública tipo
   `https://nombre-aleatorio-12345.netlify.app`.

5. Mandale ese link a la persona — abre el juego al instante.

**Pros**: gratis, instantáneo, no requiere cuenta.
**Contras**: si cambiás el juego, tenés que volver a buildear y re-arrastrar
(genera una URL nueva cada vez salvo que crees cuenta).

---

## Opción 2 — GitHub Pages (gratis, URL estable)

**~15 minutos. Tu progreso queda asociado a un repo público.**

1. Cargá el proyecto en GitHub (si no está):

   ```bash
   cd escape-decisions
   git init
   git add .
   git commit -m "escape decisions inicial"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/escape-decisions.git
   git push -u origin main
   ```

2. En `vite.config.ts`, agregá `base` con el nombre del repo:

   ```ts
   export default defineConfig({
     base: '/escape-decisions/',
     plugins: [react()],
     // …resto igual
   })
   ```

3. Buildeá y publicá la carpeta `dist/` en la rama `gh-pages`:

   ```bash
   npm run build
   npx gh-pages -d dist
   ```

   (Si nunca usaste `gh-pages` antes, te lo instala automáticamente.)

4. En GitHub → repo → Settings → Pages → Source: **gh-pages branch**.

5. La URL queda fija: `https://TU_USUARIO.github.io/escape-decisions/`.

**Pros**: URL estable, podés actualizar con `npm run build && npx gh-pages -d dist`.
**Contras**: requiere cuenta de GitHub.

---

## Opción 3 — Vercel (la más completa)

**~10 minutos. Deploys automáticos cuando empujás cambios.**

1. Cargá el proyecto a GitHub (igual que arriba).

2. Andá a <https://vercel.com/new>, conectá tu cuenta de GitHub.

3. Importá el repo. Vercel detecta Vite solo y te da una URL tipo
   `https://escape-decisions.vercel.app`.

4. Cada `git push` re-despliega automáticamente.

**Pros**: deploys automáticos, dominio bonito, gratis para uso personal.
**Contras**: requiere cuenta de Vercel + GitHub.

---

## Compartir localmente sin internet

Si solo querés que alguien en tu red local lo juegue:

```bash
npm run dev -- --host
```

Te muestra dos URLs:
- `Local:    http://localhost:5173/`
- `Network:  http://192.168.x.x:5173/`

La segunda funciona desde cualquier dispositivo en la misma red Wi-Fi
mientras tu compu esté prendida.

---

## Notas sobre el progreso del jugador

- El progreso (niveles completados, audio mute, etc.) se guarda en
  `localStorage` del navegador del jugador.
- Cada navegador / dispositivo tiene su propio progreso — no hay cuenta ni
  sync entre dispositivos.
- Borrar el localStorage o usar modo incógnito reinicia el juego desde cero.
- El botón "Borrar progreso" en la pantalla de Seleccionar Nivel limpia todo.

## Recomendación

- Para **mostrarlo rápido a un amigo**: Opción 1 (Netlify Drop).
- Para **dejarlo online de forma permanente**: Opción 2 (GitHub Pages) u
  Opción 3 (Vercel).
