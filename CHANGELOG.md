# Changelog

## [Unreleased]
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
