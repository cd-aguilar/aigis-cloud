# aigis-cloud — Estado del proyecto

_Última actualización: 9 ago 2026_

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
- **Pendiente de commit/push (9 ago 2026, sigue sin resolver):** este `STATUS.md`,
  `TODO.md` y `public/resume.pdf` v3 (regenerado con reportlab, 4KB vs. 52KB del v2 — es
  el tamaño esperado, no está corrupto: se verificó extrayendo el texto del PDF). Segundo
  intento de Cowork, mismo bloqueo que el 2 ago: `.git/index.lock` quedó huérfano en el
  mount y Cowork no tiene permiso para borrarlo (`Operation not permitted` al hacer
  `unlink`/`rm`), así que ningún comando `git` corre en la carpeta conectada. Arreglo manual
  (en una terminal con acceso real al filesystem, no vía Cowork):
  1. Borrar `C:\Users\dario\vaults\portfolio\aigis-cloud\.git\index.lock`
  2. `git add STATUS.md TODO.md public/resume.pdf && git commit -m "docs: update project status, LinkedIn/CV alignment" && git push`
  - **No incluir en ese commit:** los ~224 archivos bajo `.claude/skills/impeccable/` y
    `.github/skills/impeccable/` que aparecen "modified" — es ruido de normalización de
    line endings del mount de Cowork (mismo número de líneas insertadas/borradas), no
    cambios reales; conviene `git checkout -- .claude/skills .github/skills` para
    descartarlos antes de commitear. Tampoco `testfile.txt` (untracked, contenido "test",
    parece un archivo de prueba suelto — borrar si no tiene uso).

### Riesgo aceptado y documentado (`SECURITY.md`)

11 vulnerabilidades npm (7 high) en `@astrojs/cloudflare@11` → dependencias transitivas (`esbuild`, `sharp`, `undici`, `vite`, `wrangler`, `ws`, `astro@4.16`).

- Son mayormente vulnerabilidades de **tooling de build/dev**, no llegan al sitio estático desplegado.
- Las CVEs reales de `astro` (XSS/SSRF en server islands, middleware, `/_image`) no aplican: el sitio no usa esas features.
- Fix real requiere `@astrojs/cloudflare@14.x` → `astro@^7.0.0`, salto de 3 versiones mayores con breaking changes reales.
- **Decisión:** aceptar por ahora, migración a Astro 7 anotada en `TODO.md` como trabajo futuro, no urgente.

## Formulario de contacto (InsForge) — estado 1 ago 2026

- **Live en producción, deployado y confirmado.** Commit `4c41a0a` pusheado a `main`, build
  `success` en Cloudflare Workers Builds, y `POST https://aigis-cloud.com/api/contact`
  responde con la validación real del código nuevo (confirma que el fix de ruta ya está
  desplegado, no el código viejo). Código completo: `/contact` + `src/pages/api/contact.ts`
  (única ruta SSR del sitio, ver `docs/ADR/0003-insforge-contact-form.md`). Tabla
  `contact_submissions` creada en InsForge, `INSFORGE_SERVICE_KEY` cargado como Secret en el
  Worker de Cloudflare (`wrangler secret put`, cuenta `cda.admin@aigis-cloud.com`) y en
  `.dev.vars` local.
- **Probado end-to-end**, dos veces: automatizado (`POST /api/contact` → `200 {"ok":true}`
  contra InsForge real) y manual en el browser (`npm run preview` en `http://127.0.0.1:8787`,
  confirmado por Dario). Se detectó y corrigió un bug en el proceso: la ruta de InsForge usada
  en el código no existía (`/api/db/{table}` → 404); la correcta es
  `/api/database/records/{table}`.
- Se encontró y borró un secret mal nombrado en Cloudflare (`INSFORGE_SERVICE_KE`, sin la Y
  final) de un intento manual anterior.
- Digest diario de envíos (fase 2 del ADR-0003) sigue sin implementar — único pendiente real
  del formulario.

## Gestión de secrets — migración a Infisical

- Infisical adoptado como fuente de verdad de secrets del proyecto (reemplaza guardarlos solo
  en `.dev.vars`/Cloudflare directo). Cloudflare Workers no lee Infisical directamente, así que
  cada secret se sigue replicando a mano en Cloudflare (secret) y `.dev.vars` local.
- CLI instalado (`winget install Infisical.infisical`, v0.43.116), logueado (`infisical login`,
  cuenta con org "Personal Org"), y repo linkeado (`infisical init` → `.infisical.json` con
  `workspaceId`, sin secrets, seguro de commitear).
- **Incidente de seguridad (1 ago 2026):** un `infisical secrets --env=dev` sin filtrar
  imprimió las 10 secrets del workspace "Personal" en texto plano en una terminal (quedaron en
  un archivo temporal y en el historial de una sesión de Claude Code) — no solo
  `INSFORGE_SERVICE_KEY`, sino también las API keys de Claude, OpenAI, Gemini, Groq/Grok,
  DeepSeek, LangSmith, el token de Pushover y el bearer de Obsidian. **Dario las está rotando
  por su cuenta** (revocar en cada dashboard de proveedor + actualizar en Infisical). Lección:
  usar `infisical secrets get <NOMBRE> --plain` o `infisical run -- <cmd>` para no volcar todo
  el vault a la terminal.

## LinkedIn + CV — alineación de marca personal (2 ago 2026)

- **Perfil de LinkedIn actualizado** (`linkedin.com/in/cesar-dario-aguilar-ai`):
  - "About": reescrito para describir forma de trabajar/valores en primera persona, sin
    mencionar stack técnico ni años de experiencia (ese espacio queda para la parte humana;
    el stack ya está en el headline y en Top skills).
  - Top skills: agregado **FastAPI** (Machine Learning, n8n, Python, FastAPI — 4/5).
  - Servicios: agregado **Custom Software Development** (junto a Web Design existente),
    publicado. Se probó agregar "AI Engineer" como servicio y **no existe** como categoría
    en la taxonomía fija de LinkedIn Services — no es un buscador libre, son ~16 categorías
    predefinidas (Finance, Operations, IT, Software Development, etc.), ninguna cubre
    títulos de rol de IA. Custom Software Development es lo más cercano disponible.
  - Experiencia "Radiation Safety Officer" (antes "Radiation Protection Supervisor" en el
    CV, desalineado): fecha de fin corregida de "Present" a **enero 2023** para no
    superponerse con "Artificial Intelligence Engineer" (feb 2023–presente). Se sacó la
    línea "Concurrent with the AI Engineer role above." de la descripción, que había
    quedado vieja tras el cambio de fechas.
  - **Límite verificado de LinkedIn:** no existe una visibilidad "solo reclutadores" para
    Top Skills (sí existe para "Open to work", que Dario ya tiene activo). Se revisó el
    menú de opciones de Skills (Reorder / Endorsement settings) para confirmarlo.
- **CV (`public/resume.pdf`) alineado con LinkedIn**, v3: corregido título de rol
  ("Radiation Safety Officer") y nombre de organización ("Nuclear Medicine and Radioterapy
  Center") para que coincidan exactamente con el perfil. Fechas y stack ya coincidían.
  Archivo regenerado con reportlab manteniendo el diseño original (mismo layout, tipografía
  y color navy). El "About me" del CV mantiene años de experiencia y menciones técnicas a
  propósito — es lo esperado en un currículum, a diferencia del About de LinkedIn.

## Próximos pasos sugeridos (no urgentes)

1. Migración Astro 4→7 (cuando haya tiempo dedicado, no mezclar con otros cambios).
2. Evaluar si conviene mover también `www.aigis-cloud.com` a Cloudflare (hoy sigue en Vercel) para tener un solo pipeline de deploy, o dejarlo dual a propósito como redundancia.
3. SEO: schema.org (`Person`, `Organization`, `Article` en blog), `sitemap.xml`/`robots.txt`, considerar `llms.txt`.
4. Activar `includeSubdomains` en HSTS una vez confirmado que todos los subdominios sirven bien por HTTPS.
