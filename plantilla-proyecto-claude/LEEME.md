# Plantilla de Proyecto Claude — Dario

Estructura reutilizable para tus proyectos de Claude Desktop / Cowork (IA, Cloud, Ciberseguridad, automatización). Diseñada para ahorrar tiempo, evitar repetir contexto y gastar menos tokens.

## Cómo usarla

1. Copiá esta carpeta completa y renombrala con el nombre del proyecto (ej: `rag-obsidian-local`, `htb-cdsa-prep`, `terraform-aws-lab`).
2. Creá un Proyecto nuevo en Claude Desktop.
3. Pegá el contenido de `00-INSTRUCCIONES-PROYECTO.md` en "Custom instructions" del proyecto.
4. Subí como archivos de conocimiento: todo `01-contexto/` y `02-proyecto-activo/`. NO subas `03-sesiones/` completo de entrada (ver abajo por qué).
5. Empezá a trabajar.

## Por qué esta estructura ahorra tokens y trabajo

- **Separa lo estable de lo que cambia.** `01-contexto/` casi no cambia (tu perfil, objetivos). `02-proyecto-activo/` se actualiza poco. `03-sesiones/` es lo único que crece — y ahí guardás *resúmenes*, no transcripciones completas.
- **Nunca repitas contexto a mano.** En vez de volver a explicarle a Claude qué estás haciendo, actualizás `01-contexto/estado-actual.md` (5 líneas) al final de cada sesión. Esa es tu única fuente de verdad de "dónde quedé".
- **Decisiones documentadas una sola vez.** `decisiones-tecnicas.md` evita que vuelvas a debatir lo mismo (ej: "¿por qué elegí ChromaDB y no Pinecone") en cada charla nueva.
- **Los documentos largos no van pineados.** PDFs, papers, specs largas van en `04-recursos-y-docs/` y solo los subís/mencionás cuando realmente los necesitás en esa conversación puntual, no como conocimiento base del proyecto.
- **Checklist de herramientas antes de codear.** `entorno-y-herramientas.md` te obliga a decidir en 30 segundos si el proyecto necesita Docker, Compose, Terraform, etc. — antes de escribir una línea de código, evitando retrabajo.

## Estructura

```
plantilla-proyecto-claude/
├── 00-INSTRUCCIONES-PROYECTO.md      → pegar en Custom Instructions
├── 01-contexto/
│   ├── perfil-y-objetivos.md         → resumen corto de quién sos y a dónde vas
│   └── estado-actual.md              → "dónde quedé" (se reescribe, no se acumula)
├── 02-proyecto-activo/
│   ├── especificacion.md             → qué construye ESTE proyecto puntual
│   ├── decisiones-tecnicas.md        → ADR-lite: decisión + por qué + alternativas descartadas
│   └── entorno-y-herramientas.md     → checklist: ¿necesito Docker/K8s/Terraform acá?
├── 03-sesiones/
│   └── plantilla-nota-sesion.md      → resumen de 10 líneas por sesión de trabajo
├── 04-recursos-y-docs/
│   └── LEEME.md                      → dónde van docs largas (NO pinear al proyecto)
└── 05-portafolio/
    └── checklist-publicacion.md      → antes de subir el proyecto a GitHub/LinkedIn/web
```
