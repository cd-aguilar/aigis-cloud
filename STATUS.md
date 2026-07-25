# aigis-cloud — Estado del proyecto

_Última actualización: 25 jul 2026_

Este documento resume el estado real de infraestructura, seguridad y repo para que cualquier sesión (Cowork, Claude Code, o vos) arranque con contexto completo sin tener que re-derivarlo. Subilo al knowledge del proyecto "Aigis-Cloud" en claude.ai para que quede disponible automáticamente.

## Arquitectura de hosting (dual-host, intencional)

| Dominio | Hosting | Deploy |
|---|---|---|
| `aigis-cloud.com` (raíz) | **Cloudflare Workers** (proyecto `aigis-cloud`) | Automático vía Git integration, push a `main` en `cd-aguilar/aigis-cloud` |
| `www.aigis-cloud.com` | **Vercel** (sin cambios) | Automático vía integración Vercel-GitHub existente |

Ambos se construyen desde el mismo repo/rama `main`, por eso muestran el mismo contenido. Es una arquitectura dual intencional, no un error — documentada en `PROJECT.md` y `ADR-0002` del repo.

**Motivo del cambio a Cloudflare Workers en la raíz:** proteger el dominio con seguridad de nivel Cloudflare (ver abajo). Registrador: **Hostinger**. Nameservers: `nile.ns.cloudflare.com` / `rafe.ns.cloudflare.com`.

## Seguridad Cloudflare (zona `aigis-cloud.com`) — todo activo

- SSL/TLS: **Full (Strict)**
- Always Use HTTPS: **ON**
- HSTS: **ON** — max-age 6 meses, sin includeSubdomains ni preload (por ahora, a propósito — activar más adelante una vez confirmado que `www` también anda 100% bien en HTTPS)
- Bot Fight Mode: **ON**
- Cloudflare Managed Ruleset (WAF): **activo** (incluido en plan Free, "Always active")
- Certificado SSL: cubre `aigis-cloud.com` y `*.aigis-cloud.com`, vence 2026-10-22 (auto-renovable)
- Email (MX, SPF, DMARC, autoconfig/autodiscover de Hostinger): intacto, sin tocar

**Pendiente opcional:** Turnstile en el formulario de contacto si existe uno.

## Repo GitHub `cd-aguilar/aigis-cloud`

- Rama activa: `main`, al día, build en verde.
- PR #2 ("Add Cloudflare Workers configuration") — **mergeado**. Comitea `wrangler.jsonc` de forma permanente, evita regenerarlo en cada build.
- PR #4 (fix `node:fs` en `resume.astro`) — **mergeado**. `src/pages/resume.astro` ya no importa `node:fs` directo; usa `src/generated/resume-status.ts`, generado por `scripts/check-resume.mjs` en el hook `prebuild` (proceso Node aparte, nunca pasa por el bundler de Vite/Cloudflare).
- Ramas remotas obsoletas: borradas (`redesign/visual-refresh`, `redesign/ops-console-style`, `fix/cloudflare-fs-bundle`, `cloudflare/workers-autoconfig`).
- Documentación al día: `PROJECT.md` (arquitectura dual-host), `ADR-0002`, `SECURITY.md`, `TODO.md`.

### Riesgo aceptado y documentado (`SECURITY.md`)

11 vulnerabilidades npm (7 high) en `@astrojs/cloudflare@11` → dependencias transitivas (`esbuild`, `sharp`, `undici`, `vite`, `wrangler`, `ws`, `astro@4.16`).

- Son mayormente vulnerabilidades de **tooling de build/dev**, no llegan al sitio estático desplegado.
- Las CVEs reales de `astro` (XSS/SSRF en server islands, middleware, `/_image`) no aplican: el sitio no usa esas features.
- Fix real requiere `@astrojs/cloudflare@14.x` → `astro@^7.0.0`, salto de 3 versiones mayores con breaking changes reales.
- **Decisión:** aceptar por ahora, migración a Astro 7 anotada en `TODO.md` como trabajo futuro, no urgente.

## Próximos pasos sugeridos (no urgentes)

1. Migración Astro 4→7 (cuando haya tiempo dedicado, no mezclar con otros cambios).
2. Evaluar si conviene mover también `www.aigis-cloud.com` a Cloudflare (hoy sigue en Vercel) para tener un solo pipeline de deploy, o dejarlo dual a propósito como redundancia.
3. SEO: schema.org (`Person`, `Organization`, `Article` en blog), `sitemap.xml`/`robots.txt`, considerar `llms.txt`.
4. Activar `includeSubdomains` en HSTS una vez confirmado que todos los subdominios sirven bien por HTTPS.
