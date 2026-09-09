# ADR-0004: Blog vía GitOps en Fase 2 del AI Content Engine (InsForge, no Supabase)

## Estado
Aceptada (2026-08-24) — reemplaza la versión inicial de este ADR (que proponía Supabase),
tras consolidar la arquitectura completa con otra IA. Decisión de arquitectura tomada,
implementación pendiente y **explícitamente fuera del MVP** (ver
`aigis-content-engine/CLAUDE.md`).

## Contexto
El proyecto `aigis-content-engine` (en `05-Automatizacion-n8n/`) se reencuadró como un
**AI Content Intelligence & Publishing Pipeline**: un sistema de operaciones editoriales
asistido por IA, con el **Content Asset** como abstracción central (no el post de una
plataforma puntual), que se distribuye a distintos "publishers" (LinkedIn, Blog, Postiz). El
MVP incluye un único publisher (LinkedIn); el blog es una capacidad de Fase 2, no del MVP. Ver
`aigis-content-engine/docs/arquitectura-content-engine.md` para el diseño completo.

El blog de este sitio hoy es Markdown puro vía content collections de Astro
(`src/content/blog`). `PROJECT.md` restringe el sitio a "estático, sin backend — excepto el
endpoint del formulario de contacto" (ver ADR-0003). Cualquier automatización del blog en
Fase 2 necesita respetar esa restricción.

## Decisión
- **Backend del pipeline editorial: extender InsForge** (ya en producción en este repo para
  el formulario de contacto, ver ADR-0003), no sumar Supabase. InsForge funciona como
  *Content State / Repository / Control State* del pipeline — nunca como backend runtime del
  sitio Astro. Se revierte la decisión inicial de este ADR (Supabase), tomada antes de
  consolidar la arquitectura completa.
- **El blog queda en Fase 2**, no en el MVP. Cuando se implemente, el flujo es:
  `Content Asset aprobado → Blog Adapter → Markdown/MDX → Git branch → Pull Request → CI
  validation → human approval → Merge → Astro build → producción`. Nunca push directo a
  `main` (que ya dispara deploy automático). El sitio Astro sigue **100% estático** — Fase 2
  no agrega SSR ni lee InsForge en runtime, solo en el paso de build/CI.
- LinkedIn (MVP) y Postiz (Fase 2, multicanal) no tocan este repo — corren enteramente del
  lado de n8n.

## Alternativas consideradas
- **Supabase** (decisión original de este ADR): nodo n8n nativo + Vector Store (pgvector) para
  un eventual chat RAG. Descartado por ahora — mantener un solo backend (InsForge) reduce
  complejidad operacional y credenciales a gestionar, y no hay necesidad real de pgvector
  todavía. Si en el futuro se justifica un chat RAG sobre el portfolio, se reevalúa en un ADR
  aparte.
- **Blog dinámico vía SSR** (Astro lee InsForge en runtime): descartado — el contenido no
  cambia por request, agregar una segunda excepción SSR no tiene justificación real.
- **Push directo del agente a `main`**: descartado — sin revisión humana antes de un deploy a
  producción real. GitOps (branch → PR → CI → aprobación → merge) agrega la capa de
  gobernanza que el proyecto pide explícitamente ("credibilidad > volumen").

## Consecuencias
- **Segundo backend externo en el proyecto** (InsForge para contacto y para el pipeline
  editorial) — se evita sumar un tercero (Supabase); las credenciales de InsForge ya
  gestionadas en Infisical se reutilizan/extienden, no se duplican.
- **Nuevo paso en CI** cuando se implemente Fase 2: validar el PR del blog (frontmatter,
  Markdown/MDX, slugs, enlaces, imágenes, metadata, duplicados, build de Astro) antes de
  permitir merge a `main` — extensión de `.github/workflows/ci.yml` (avisar explícitamente
  antes de tocarlo, por regla del proyecto).
- **Explícitamente fuera de alcance por ahora**: esquema de tablas en InsForge para el
  pipeline (`content`, `content_sources`, `publications`), el Blog Adapter, y el workflow de
  CI para el PR del blog. El MVP de `aigis-content-engine` se prototipa primero
  (Topic → Research Agent → Content Agent → QA/Evaluation Agent → InsForge → Human Approval →
  LinkedIn), en una rama aparte (`feature/blog-automation-db` o la que se use para el
  prototipo), no en `main`. Fase 2 (este ADR) se retoma recién cuando el MVP esté validado.
