# Changelog

## [Unreleased]
- **Retiradas las páginas "AI Lab" y "Blue Team Lab"** (`/ai-lab`, `/blue-team-lab`) del
  sitio — contenido genérico sin writeups reales, ya no encajaba con el reposicionamiento
  a "AI & Cloud Security Engineer". Borradas las páginas y sus links en nav y footer; la
  columna "Labs" del footer (que quedaba solo con "Services") se renombró a "More".
- **Formulario de contacto en producción.** `/contact` + `src/pages/api/contact.ts`, única
  página SSR del sitio — guarda los envíos en InsForge (Postgres), ver
  `docs/ADR/0003-insforge-contact-form.md`. `INSFORGE_SERVICE_KEY` cargado en Cloudflare
  (`wrangler secret put`) y en `.dev.vars` local; probado end-to-end (automatizado y en
  browser). Bug encontrado y corregido durante la prueba: el código apuntaba a
  `{INSFORGE_BASE_URL}/api/db/{table}` (404, ruta inexistente); la ruta real de la API de
  InsForge es `/api/database/records/{table}`. También se limpió un secret mal nombrado en
  Cloudflare (`INSFORGE_SERVICE_KE`, sin la Y final) de un intento manual previo. Pendiente:
  digest diario (fase 2 del ADR-0003).
- Secrets del proyecto migrados a **Infisical** como fuente de verdad (antes solo vivían en
  `.dev.vars`/Cloudflare directo). Cloudflare Workers no lee Infisical, así que cada secret
  se sigue replicando a mano en Cloudflare (secret) y `.dev.vars` local — ver TODO.md. CLI
  instalado, logueado, y repo linkeado (`.infisical.json`). **Incidente:** un comando sin
  filtrar (`infisical secrets --env=dev`) volcó las 10 secrets del workspace en texto plano a
  una terminal/sesión — en rotación por Dario.
- Dominio raíz `aigis-cloud.com` migrado a Cloudflare Workers (`www` sigue en Vercel sin
  cambios) — decisión tomada al configurar seguridad del dominio (SSL Full Strict, HSTS,
  WAF, Bot Fight Mode). Mergeado el PR auto-generado por Cloudflare con el adapter
  `@astrojs/cloudflare` + `wrangler.jsonc`. Ver `docs/ADR/0002-dual-hosting-cloudflare-vercel.md`.
  Introduce 11 vulnerabilidades npm conocidas (7 high) heredadas del adapter, aceptadas y
  documentadas en SECURITY.md — el fix real requiere migrar Astro 4→7 (ver TODO.md).
- Actualizado el link de LinkedIn a `cesar-dario-aguilar-ai` (Nav, Footer, contact, resume,
  README) — reemplaza `cesar-dario-aguilar-a0324b15` en todo el sitio.
- Agregada página de detalle por proyecto (`/portfolio/[slug]`) con mini case study
  (Problem / Architecture decisions / Result) para `agent-orchestrator-soc`,
  `rag-api-cloud` y `local-rag-second-brain` — home y `/portfolio` ahora enlazan ahí en
  vez de ir directo al repo externo. `blue-team-detection-lab` quedó pendiente: el repo
  está vacío en GitHub. De paso se corrigió `.markdown-body` en `global.css`, reemplazando
  clases `prose`/`prose-invert` de un plugin de Tailwind que nunca se instaló (el body del
  blog se renderizaba sin estilo).
- Subido CV real a `public/resume.pdf` (v2) y unificado el email de contacto en
  `/contact` a `cda.admin@aigis-cloud.com` (coincide con el CV).
- Agregado `DESIGN.md` (impeccable document) y pase de estilo "Ops Console" en las 9
  páginas: acento cian/violeta restringido a señal real (se retiró el glow ambiental del
  hero y el uso decorativo de `gradient-text` en logo/nav/footer), botón primario pasó de
  gradiente a cian sólido, listas de features (ai-lab, blue-team-lab, services) migraron
  de cards repetidas a filas tipo consola, kickers ahora muestran la ruta real (`~/blog`,
  etc.), y contacto/resume ya no muestran notas "TODO" visibles al público (resume detecta
  en build si `public/resume.pdf` existe y muestra "coming soon" en vez de un link roto).
- Agregado `PRODUCT.md` (impeccable init): contexto de producto durable — audiencia
  (recruiters/hiring managers de AI Engineering), posicionamiento (AI aplicada a
  operaciones de seguridad), y requisito confirmado de formulario de contacto con
  entrega diaria (digest) al owner, aún sin implementar.
- Pendiente: CV real (`public/resume.pdf`), contenido/copy definitivo, foto/logo.
- Se removieron `context/` y `plantilla-proyecto-claude/` del repo: eran scaffolding
  genérico sin llenar, redundante con PROJECT.md/CLAUDE.md/TODO.md y ausente en el resto
  de los repos de portfolio. La plantilla reutilizable de proyecto ya vive en el vault
  (`segundo-cerebro/_templates/proyecto/`), no debía commitearse en un repo público.

## [0.2.1] - 2026-07-24
### Fixed
- Corregida inconsistencia: PROJECT.md marcaba "conectar dominio" como pendiente cuando
  ya estaba hecho (ver TODO.md/README.md).

## [0.2.0] - 2026-07-24
### Added
- Scaffold del sitio con Astro + Tailwind CSS (estático).
- 9 páginas: home, portafolio, blog (index + slug), laboratorio-ia, laboratorio-htb,
  servicios, certificaciones, cv, contacto.
- Content collections (`proyectos`, `blog`) con las 4 entradas de portafolio de `cd-aguilar`.
- CI actualizado a Node/Astro (`npm install && npm run build`).

## [0.1.0] - 2026-07-24
### Added
- Estructura inicial del proyecto (template genérico .claude/docs/contexto).
