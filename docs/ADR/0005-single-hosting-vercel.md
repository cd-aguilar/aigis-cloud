# ADR-0005: Hosting único en Vercel (reemplaza ADR-0002)

## Estado
Propuesta (2026-11-15). Reemplaza a ADR-0002.

## Contexto
ADR-0002 dejó el dominio raíz en Cloudflare Workers y `www` en Vercel. Al 2026-11-15 la
realidad en producción es otra:

- Los nameservers del dominio son `ns1/ns2.dns-parking.com` (Hostinger), no Cloudflare. La
  zona de Cloudflare no recibe tráfico: ni el Worker ni el WAF están en el camino.
- `aigis-cloud.com` responde 308 hacia `www.aigis-cloud.com`, y `www` lo sirve Vercel.
- Vercel publica el build como sitio estático. `/api/contact` (función SSR pensada para el
  Worker) devuelve 404: **el formulario de contacto no funciona en producción**.
- El adapter de Cloudflare fijaba Astro 4 y arrastraba 19 vulnerabilidades en `npm audit`
  (1 crítica, 14 altas).

## Decisión
- Un solo hosting: **Vercel**, con `@astrojs/vercel`. `/api/contact` corre como Vercel
  Function; el resto del sitio sigue prerenderizado.
- Astro 4 → 7. Content collections migradas a la API de loaders (`src/content.config.ts`).
  Tailwind 3 pasa a cargarse por PostCSS (`@astrojs/tailwind` no soporta Astro 7).
- Se eliminan `wrangler.jsonc`, `.dev.vars.example` y la dependencia `wrangler`.
- Headers de seguridad en `vercel.json`. La CSP arranca en modo `Report-Only`.
- `INSFORGE_BASE_URL` e `INSFORGE_SERVICE_KEY` se cargan en Vercel (Project Settings →
  Environment Variables). En local, `.env`.

## Alternativas consideradas
- **Volver a Cloudflare** (mover los nameservers otra vez): recupera WAF y Bot Fight Mode,
  pero mantiene dos pipelines o exige migrar `www`. Se puede reevaluar más adelante poniendo
  Cloudflare como proxy delante de Vercel; no cambia esta decisión de build.
- **Dejar todo como está**: descartado, el formulario está caído.

## Consecuencias
- `npm audit`: 0 vulnerabilidades (antes 19). Incluye un `overrides` de `path-to-regexp`
  a 6.3.0 para `@vercel/routing-utils`; quitarlo cuando el adapter lo actualice.
- Node >= 22.23.4 (requisito de Astro 7). CI y Vercel deben usar Node 22.
- Pendiente manual después del merge: desconectar la Git integration de Cloudflare
  ("Workers Builds"), borrar el Worker `aigis-cloud` y su secret, y rotar
  `INSFORGE_SERVICE_KEY` al cargarla en Vercel.
- El digest diario de `contact_submissions` (fase 2 de ADR-0003) pasa a ser un Vercel Cron
  en vez de un Cloudflare Cron Trigger.
