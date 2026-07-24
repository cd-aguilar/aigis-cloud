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
Sitio estático generado con Astro. Contenido de proyectos y posts en Markdown mediante
content collections (`src/content/config.ts`), sin backend ni base de datos. Ver
`docs/architecture/` para diagramas si se agregan a futuro.

## Decisiones clave
- **Astro + Tailwind CSS**, output estático — elegido por velocidad de build, cero JS por
  defecto, curva de aprendizaje baja y encaje natural con contenido en Markdown (reutilizable
  desde el "segundo cerebro" en Obsidian).
- **Hosting: Vercel** (conector MCP ya disponible en Cowork para desplegar y gestionar
  dominio/analytics) — free tier suficiente para un sitio estático.
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
- [ ] Contenido real: CV en PDF (`public/cv.pdf`), bio definitiva, foto/logo
- [ ] Conectar dominio `aigis-cloud.com` en Vercel y desplegar
- [ ] Autorizar conector de GitHub (OAuth pendiente) para automatizar sync de proyectos
- [ ] Formulario de contacto real (Formspree o función serverless en Vercel)
- [ ] Integrar con GitHub/LinkedIn para reforzar la marca profesional (ver TODO.md)

## Pendientes
Ver TODO.md

## Tecnologías
Astro 4, Tailwind CSS 3, TypeScript (strict), Markdown content collections, Vercel (hosting).

## Reglas del proyecto
- Estilo de código: componentes `.astro`, Tailwind utility classes, TypeScript strict.
- Convenciones de commits: Conventional Commits (feat:, fix:, docs:, chore:)
- CI corre en cada push/PR (ver .github/workflows/ci.yml: `npm install && npm run build`) —
  no romper el pipeline.
- Qué no tocar sin preguntar: no publicar el sitio en producción sin revisión de contenido
  (CV, datos de contacto).
