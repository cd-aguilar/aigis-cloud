# ADR-0002: Dominio raíz en Cloudflare Workers, `www` en Vercel

## Estado
Aceptada (2026-07-25)

## Contexto
El dominio `aigis-cloud.com` se configuró con seguridad reforzada a nivel DNS/edge en
Cloudflare (SSL Full Strict, HSTS, WAF, Bot Fight Mode) en una sesión aparte, centrada en
seguridad del dominio, no en el código del sitio. Como parte de esa configuración, el
dominio raíz (`aigis-cloud.com`) quedó sirviéndose desde **Cloudflare Workers** en vez de
apuntar a Vercel.

Cloudflare además había auto-detectado el repo (Git integration) y generado un PR
(`cloudflare/workers-autoconfig`, #2) proponiendo el adapter `@astrojs/cloudflare` y la
config de Workers necesaria para que el build funcione en su plataforma.

## Decisión
- **`aigis-cloud.com` (raíz)** → Cloudflare Workers. Deploy automático vía Git integration
  en cada push a `main`. Requiere `@astrojs/cloudflare` (adapter Astro), `output: "hybrid"`
  y `wrangler.jsonc` (ver PR #2, mergeado en este ADR).
- **`www.aigis-cloud.com`** → Vercel, sin cambios respecto a la decisión original (ver
  "Decisiones clave" en PROJECT.md).
- Ambos hosts construyen desde el mismo repo y la misma rama `main`, por lo que sirven el
  mismo contenido; no hay divergencia de código entre ellos.
- El sitio sigue siendo 100% prerenderizado (`output: "hybrid"` sin ninguna página con
  `prerender = false`) — el adapter de Cloudflare no introdujo SSR real, solo envuelve el
  HTML estático en un Worker.

## Alternativas consideradas
- **Solo Vercel** (estado anterior): más simple, un solo proveedor. Se descartó porque la
  configuración de seguridad de dominio (WAF, Bot Fight Mode, HSTS) se hizo directamente en
  Cloudflare y requería que el tráfico del dominio raíz pasara por su edge/Workers.
- **Migrar todo a Cloudflare** (abandonar Vercel): no evaluado a fondo en esta sesión: el
  dominio raíz ya está resuelto, y `www` sigue funcionando en Vercel sin motivo para
  tocarlo ahora.

## Consecuencias
- **Costo de mantenimiento:** dos plataformas de hosting en vez de una — hay que vigilar
  checks/CI de ambas (Vercel + "Workers Builds" en GitHub) en cada PR.
- **Dependencias nuevas:** `@astrojs/cloudflare@11.2.0` y `wrangler` como devDependency.
  Esto introdujo 11 vulnerabilidades conocidas (7 high) en el árbol de dependencias,
  heredadas de versiones fijadas por el adapter — documentado en detalle en `SECURITY.md`,
  aceptado por ahora porque son mayormente de tooling de build, no de superficie expuesta
  en runtime. El fix real requiere migrar Astro 4 → 7 (ver TODO.md).
- **`npm run preview` cambió de comportamiento:** ahora corre `wrangler dev` (simula el
  Worker real) en vez de `astro preview`.
- **Nada cambia para el contenido/diseño del sitio:** sigue siendo el mismo Astro estático;
  este ADR es puramente de infraestructura de hosting.
