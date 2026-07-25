# PROJECT.md — Contexto para IA

> Leer este archivo primero, completo, antes de proponer cambios o explorar el repo.
> Si existe `AI/GlobalContext.md` en el workspace raíz (perfil, objetivos de carrera,
> stack general, convenciones), leerlo también — no lo repitas acá, solo referencialo.
> Cómo correr y testear el proyecto está en `package.json` (scripts npm) — no lo derives del código.

## Objetivo
Sitio profesional en `aigis-cloud.com`: marca personal de César Darío Aguilar como AI
Engineer con orientación a Cybersecurity Blue Team. Portafolio, blog técnico, laboratorios
de IA/HTB, certificaciones, CV y contacto. Integrado con GitHub (`cd-aguilar`) y LinkedIn.

## Alcance
Home, Portafolio (proyectos desde `src/content/proyectos`), Blog técnico (`src/content/blog`),
Laboratorio de IA, Laboratorio HTB, Servicios (futura consultora), Certificaciones, CV, Contacto.

## Arquitectura
Sitio Astro (`output: "hybrid"`, 100% prerenderizado — ninguna página usa
`prerender = false`, así que en la práctica sigue siendo estático) con contenido de
proyectos y posts en Markdown mediante content collections (`src/content/config.ts`), sin
backend ni base de datos propia. Desde 2026-07-25 se construye y despliega en **dos
hosts** desde el mismo repo/rama `main` (ver ADR-0002):
- **`aigis-cloud.com`** (raíz) → Cloudflare Workers, vía adapter `@astrojs/cloudflare` +
  `wrangler.jsonc`. Deploy automático por Git integration en cada push.
- **`www.aigis-cloud.com`** → Vercel, sin cambios respecto a la config original.

Ver `docs/architecture/` para diagramas si se agregan a futuro.

## Decisiones clave
- **Astro + Tailwind CSS** — elegido por velocidad de build, cero JS por defecto, curva de
  aprendizaje baja y encaje natural con contenido en Markdown (reutilizable desde el
  "segundo cerebro" en Obsidian).
- **Hosting dual: Cloudflare Workers (raíz) + Vercel (`www`)** — el dominio raíz se movió a
  Cloudflare Workers el 2026-07-25 al configurar seguridad del dominio (SSL Full Strict,
  HSTS, WAF, Bot Fight Mode) en una sesión aparte; `www` se dejó en Vercel sin motivo para
  migrarlo. Detalle completo, alternativas consideradas y consecuencias en
  `docs/ADR/0002-dual-hosting-cloudflare-vercel.md`.
- Se descartó Next.js para esta primera versión: no hay necesidad de backend/API routes
  todavía: los demos de IA/RAG viven en sus propios repos (`rag-api-cloud`,
  `local-rag-second-brain`) y se enlazan desde el portafolio en vez de embeberse.
- Se removió la integración `@astrojs/sitemap` (rompía el build en esta versión); reintentar
  más adelante si aporta valor SEO real.
- Ver `docs/ADR/` para decisiones mayores futuras.

## Restricciones
- Técnicas: sitio estático, sin backend. Node 20+.
- De tiempo: proyecto secundario, no bloquea objetivos de certificación/empleo.
- De presupuesto: free/open source — Astro, Tailwind y Vercel free tier; dominio ya comprado.

## Roadmap
- [x] Elegir stack (Astro + Tailwind, estático) y estructura de secciones
- [x] Scaffold funcional con build verificado (`npm run build`)
- [x] Dominio `aigis-cloud.com` conectado en Vercel (DNS en Hostinger, SSL activo)
- [x] Sitio traducido a inglés (rutas, nav, contenido, README)
- [ ] Contenido real: CV en PDF (`public/resume.pdf`), bio definitiva, foto/logo
- [ ] Autorizar conector de GitHub (OAuth pendiente) para automatizar sync de proyectos
- [ ] Formulario de contacto real (Formspree o función serverless en Vercel)
- [ ] Integrar con GitHub/LinkedIn para reforzar la marca profesional (ver TODO.md)

## Pendientes
Ver TODO.md

## Tecnologías
Astro 4, Tailwind CSS 3, TypeScript (strict), Markdown content collections. Hosting:
Cloudflare Workers (`@astrojs/cloudflare`, `wrangler`) para el dominio raíz, Vercel para
`www`.

## Reglas del proyecto
- Estilo de código: componentes `.astro`, Tailwind utility classes, TypeScript strict.
- Convenciones de commits: Conventional Commits (feat:, fix:, docs:, chore:)
- CI corre en cada push/PR (ver .github/workflows/ci.yml: `npm install && npm run build`) —
  no romper el pipeline.
- Qué no tocar sin preguntar: no publicar el sitio en producción sin revisión de contenido
  (CV, datos de contacto).
