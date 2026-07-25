# Seguridad

Este proyecto sigue prácticas básicas de seguridad: sin secrets en el repo, dependencias
revisadas, CI ejecuta análisis estático si corresponde.

## Vulnerabilidades conocidas y aceptadas (npm audit)

Desde que se agregó `@astrojs/cloudflare@11.2.0` (2026-07-25, integración de Cloudflare
Workers para `aigis-cloud.com`), `npm audit` reporta **11 vulnerabilidades (7 high, 4
moderate)**, heredadas de las dependencias transitivas fijadas por ese paquete:

- **`astro@4.16.x`** — múltiples XSS/SSRF/auth-bypass conocidos (server islands, middleware,
  `define:vars`, view transitions, `X-Forwarded-Host`, error page SSRF, endpoint `/_image`
  del adapter de Cloudflare, entre otros).
- **`esbuild`, `vite`, `wrangler`, `miniflare`** — vulnerabilidades de tooling de build/dev
  (dev server, path traversal en deps optimizadas, etc.).
- **`sharp`** — CVEs heredados de `libvips`.
- **`undici`, `ws`** — DoS/smuggling/memory disclosure en el cliente HTTP/WebSocket que usa
  Wrangler internamente.

**Por qué se acepta por ahora:** son casi todas de tooling de build/dev, no de código que
corre en el sitio desplegado. De las vulnerabilidades reales de `astro` en runtime, ninguna
superficie afectada está en uso en este sitio: no hay server islands, no hay middleware, no
se usa `astro:assets`/`Image` (por lo tanto el endpoint `/_image` del adapter de Cloudflare
no está expuesto en la práctica), no hay `define:vars` con datos no confiables. El sitio es
100% prerenderizado (`output: "hybrid"`, sin ninguna página con `prerender = false`).

**Qué requeriría el fix real:** `@astrojs/cloudflare@11.2.0` fija `astro: ^4.10.3` como peer
dependency. La versión del adapter que sí trae las dependencias parcheadas
(`@astrojs/cloudflare@14.1.4`) exige `astro: ^7.0.0` — un salto de tres versiones mayores
(4→7), con breaking changes reales en el propio Astro. No es un `npm audit fix` seguro; es
una migración mayor que hay que planear aparte (ver TODO.md).

`npm audit fix` (sin `--force`) no resuelve nada de esto — las versiones están fijadas por
el peer dependency del adapter, no por rangos sueltos en `package.json`.

## Reportar una vulnerabilidad
Abrir un issue privado o contactar a cdario.a@gmail.com. No publicar detalles de
explotación en issues públicos.
