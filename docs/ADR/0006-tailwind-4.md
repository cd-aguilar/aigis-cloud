# ADR-0006: Migración a Tailwind CSS 4

## Estado
Propuesta (2026-11-15).

## Contexto
Dependabot abrió el PR #6 (tailwindcss 3.4.19 → 4.3.5) y el CI falló: el bump de versión por
sí solo no alcanza. Tailwind 4 cambia la configuración de JS a CSS, renombra utilidades y
mueve el plugin de PostCSS a un paquete aparte.

## Decisión
Migrar a Tailwind 4 con el codemod oficial (`npx @tailwindcss/upgrade`), que aplicó:

- `@tailwind base/components/utilities` → `@import 'tailwindcss'`.
- `tailwind.config.mjs` eliminado; los colores (`ink`, `accent`, `accent2`) y el gradiente
  pasan a un bloque `@theme` en `src/styles/global.css` como custom properties.
- `@layer components { .card { … } }` → `@utility card { … }`, con selectores anidados (`& p`).
- Renombres en las plantillas: `bg-white/[0.02]` → `bg-white/2`, `backdrop-blur` →
  `backdrop-blur-sm`, `outline-none` → `outline-hidden`, `focus-visible:outline` →
  `outline-solid`, y el modificador importante pasa de prefijo a sufijo (`!bg-white/5` →
  `bg-white/5!`).
- Capa de compatibilidad para el color de borde por defecto, que en v4 pasa a `currentcolor`.

**Integración por Vite, no por PostCSS.** El codemod configura `@tailwindcss/postcss`, pero
con Astro el build falla: Vite resuelve `@import 'tailwindcss'` como ruta de archivo antes de
que corra el plugin (`ENOENT: open '<proyecto>/tailwindcss'`). La integración soportada es
`@tailwindcss/vite` declarado en `vite.plugins` de `astro.config.mjs`. Se eliminan
`postcss.config.mjs`, `postcss` y `autoprefixer` (v4 ya incluye el prefijado).

## Alternativas consideradas
- **Quedarse en 3.x** e ignorar los majors de Tailwind: menos trabajo, pero 3.x deja de
  recibir features y el salto se hace más caro con el tiempo.
- **Mergear el PR #6 tal cual**: no compila.

## Consecuencias
- El CSS generado crece de ~16 KB a ~37 KB: v4 emite las custom properties de todo el tema
  por defecto. Se puede recortar con un reset de namespace (`--color-*: initial`) si molesta.
- Requiere revisión visual antes de mergear: los renombres de utilidades y el cambio de
  opacidades (`/[0.02]` → `/2`) son equivalentes en teoría, pero conviene comparar el preview
  de Vercel contra producción.
- `npm audit`: 0 vulnerabilidades.
