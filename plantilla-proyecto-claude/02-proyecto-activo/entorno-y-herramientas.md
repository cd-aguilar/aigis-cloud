# Checklist de entorno y herramientas

Completar ANTES de escribir código. Objetivo: no descubrir a mitad de camino que faltaba containerizar o versionar infraestructura.

## 1. ¿El proyecto corre algún servicio con estado o más de un proceso?

(API, base de datos, ChromaDB, Ollama, n8n, un scraper + una cola, etc.)

- [ ] Sí → usar **Docker Compose** desde el día 1. Un `docker-compose.yml` por proyecto, un servicio por bloque funcional.
- [ ] No, es un script/notebook único → Docker opcional; evaluar solo si se va a publicar en GitHub como demo reproducible.

## 2. ¿Se va a publicar en GitHub como parte del portafolio?

- [ ] Sí → agregar `Dockerfile` + `docker-compose.yml` + instrucciones de "cómo correrlo en 3 comandos" en el README. Esto es lo que un reclutador técnico realmente valora: reproducibilidad, no solo el código.
- [ ] No, es solo para aprender → Docker opcional, priorizar entender el concepto antes que empaquetarlo.

## 3. ¿Involucra más de un contenedor con necesidad real de orquestación, escalado o self-healing?

- [ ] Sí y el objetivo es aprender/certificar Kubernetes → usar **Kubernetes** (minikube/kind local).
- [ ] No → quedarse en Docker Compose. Kubernetes en un proyecto que no lo necesita es sobre-ingeniería y consume tiempo sin ROI.

## 4. ¿Provisiona infraestructura cloud (AWS/GCP)?

- [ ] Sí → **Terraform** desde el inicio, nunca clicks manuales en la consola (no demuestra nada en el portafolio y no es reproducible).
- [ ] No aplica.

## 5. ¿Conecta o automatiza múltiples herramientas/pasos?

- [ ] Sí → **n8n** (ya en tu stack) en vez de un script ad-hoc, si el objetivo incluye mostrar automatización.
- [ ] No, es lógica interna de una sola app → mantenerlo simple, no forzar n8n.

## 6. Gestión de secretos y entorno

- [ ] Variables sensibles en `.env` (nunca hardcodeadas) + `.env.example` versionado.
- [ ] `.gitignore` incluye `.env`, `__pycache__`, `node_modules`, modelos/datasets pesados.

## Resultado de esta checklist para este proyecto

**Herramientas decididas:**

**Por qué (1 línea):**
