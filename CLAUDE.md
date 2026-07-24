# Instrucciones para Claude Code

Antes de cualquier tarea:
1. Leer PROJECT.md completo — no explorar el repo a ciegas si PROJECT.md ya responde.
2. Leer TODO.md para saber qué está pendiente.
3. Si existe `../AI/GlobalContext.md`, leerlo (contexto permanente del usuario). No lo dupliques acá.
4. Para saber cómo correr/testear el proyecto, leer los scripts en `package.json` (`npm run dev|build|preview`) — no lo redescubras cada sesión.

## Reglas de este proyecto
- Nunca commitear `.env` real, ni credenciales, ni tokens. Solo `.env.example`.
- Todo cambio de arquitectura relevante se documenta en PROJECT.md ("Decisiones clave")
  o en un ADR nuevo dentro de docs/ADR/ si es una decisión mayor.
- Al terminar una tarea: actualizar TODO.md y CHANGELOG.md antes de cerrar la sesión.
- No instalar dependencias nuevas sin justificarlo en PROJECT.md.
- No modificar .github/workflows/ci.yml sin avisar explícitamente en la respuesta.

## Convenciones
- Commits: Conventional Commits (feat:, fix:, docs:, chore:).
- Idioma de código/comentarios: inglés. Idioma de documentación: español.
- Antes de un `git push`: correr `npm run build` (falla si hay errores de tipo/contenido).
