# Seguridad

Este proyecto sigue prácticas básicas de seguridad: sin secrets en el repo, dependencias
revisadas, CI ejecuta análisis estático si corresponde.

## Estado de dependencias (npm audit)

`npm audit` reporta **0 vulnerabilidades** desde la migración a Astro 7 + `@astrojs/vercel`
(2026-11-15, ver `docs/ADR/0005-single-hosting-vercel.md`). El CI falla si aparece alguna de
severidad alta o crítica (`npm audit --audit-level=high`) y Dependabot abre PRs semanales
para npm y GitHub Actions.

`package.json` tiene un `overrides` de `path-to-regexp` a 6.3.0 (ReDoS en la versión que fija
`@vercel/routing-utils`, usada solo en build). Quitarlo cuando el adapter la actualice.

## Superficie expuesta

- Sitio prerenderizado. La única ruta on-demand es `POST /api/contact`.
- `/api/contact` valida origen, `Content-Type`, longitudes y formato de email, y tiene un
  honeypot. **No tiene rate limit**: configurarlo en Vercel (Firewall → Rate Limiting sobre
  `/api/contact`).
- El endpoint usa la Service Key de InsForge, que tiene más permisos que los necesarios.
  Pendiente: reemplazarla por una clave limitada a `INSERT` en `contact_submissions`.
- Headers de seguridad en `vercel.json`. La CSP está en `Report-Only`; pasarla a
  `Content-Security-Policy` después de revisar la consola del navegador en producción.
- El widget de ElevenLabs se carga desde unpkg con versión fija y SRI. Para actualizarlo:
  `npm pack @elevenlabs/convai-widget-embed@<versión>`, extraer `dist/index.js` y calcular
  `openssl dgst -sha384 -binary dist/index.js | openssl base64 -A`.

## Reportar una vulnerabilidad
Abrir un issue privado o contactar a cdario.a@gmail.com. No publicar detalles de
explotación en issues públicos.
