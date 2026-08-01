# ADR-0003: Formulario de contacto real vía InsForge (única excepción SSR del sitio)

## Estado
Aceptada (2026-07-28)

## Contexto
`PRODUCT.md` define el formulario de contacto como requisito no resuelto, con un detalle
concreto: no alcanza con un email por submission — tiene que entregar los campos como
**digest diario**, lo cual implica guardar los envíos en algún lado (storage/batching). Eso
es una excepción real a "sitio estático, sin backend" (ver `PROJECT.md` > Restricciones), y
`PRODUCT.md` pide que se resuelva a propósito, no por default.

Las dos opciones que estaban anotadas en `TODO.md` eran Formspree o una función serverless en
Vercel. Ninguna de las dos resuelve el batching por sí sola: Formspree no hace digests
nativamente, y una función serverless sola no tiene dónde persistir los envíos del día.

## Decisión
- Usar **InsForge** (backend-as-a-service, Postgres + REST API auto-generada) como storage de
  los envíos del formulario. Proyecto ya creado en InsForge (`aigis-cloud`, plan Free).
- Agregar **una sola página no prerenderizada** en todo el sitio: `src/pages/api/contact.ts`,
  con `export const prerender = false`. Corre como función SSR en el mismo Cloudflare Worker
  que ya sirve `aigis-cloud.com` (el adapter `@astrojs/cloudflare` ya estaba instalado desde
  ADR-0002 — no se agrega infraestructura nueva, solo se usa la que ya existe).
- El endpoint recibe el POST del form, valida los campos, y hace un insert server-to-server
  contra `POST {INSFORGE_BASE_URL}/api/database/records/contact_submissions` usando la
  **Service Key** de InsForge (nunca la Anon Key) vía header `Authorization: Bearer`. La
  Service Key no se expone nunca al browser — solo vive en el Worker (secret de Cloudflare)
  y en `.dev.vars` local. (Ruta corregida 2026-08-01: `/api/db/{table}` no existe en la API
  real de InsForge — devuelve 404 — la convención correcta es `/api/database/records/{table}`,
  verificado con `npm run preview` + InsForge real.)
- Tabla `contact_submissions` (Postgres, crear a mano en InsForge > Editor SQL):
  ```sql
  create table contact_submissions (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    email text not null,
    message text not null,
    created_at timestamptz not null default now(),
    digested_at timestamptz
  );
  ```
  `digested_at` queda preparado para el digest diario (fase 2, ver Pendientes).
- Anti-spam: campo honeypot oculto (`company`) en el form — si viene relleno, el endpoint
  responde 200 sin escribir nada, sin delatar al bot.

## Alternativas consideradas
- **Formspree**: más simple de integrar, pero no soporta digest diario nativo (solo alerta por
  submission); el free tier además limita a 50 envíos/mes. Descartado por no resolver el
  requisito real de `PRODUCT.md`.
- **Función serverless en Vercel + storage propio** (ej. Vercel KV/Postgres): técnicamente
  equivalente a esta decisión, pero el dominio raíz ya no vive en Vercel (ADR-0002) — hubiera
  significado depender de Vercel solo para esto, mientras que Cloudflare Workers ya está
  disponible y en uso para el dominio raíz.
- **Self-host de InsForge**: descartado por ahora — el free tier de InsForge Cloud alcanza
  sobrado para el volumen de un formulario de contacto personal; revisar si el proyecto pausa
  por inactividad (free tier pausa a la semana sin uso) y si eso llega a ser un problema real.

## Consecuencias
- **Primera y única excepción a "sitio estático"**: documentado explícitamente acá y en
  `PROJECT.md`, tal como pide `PRODUCT.md` ("say so explicitly when it happens").
- **Dependencia nueva**: ninguna a nivel npm (se usa `fetch` nativo, disponible en el runtime
  de Cloudflare Workers) — solo una cuenta/proyecto externo (InsForge) y sus credenciales.
- **Secretos a gestionar**: `INSFORGE_SERVICE_KEY` debe cargarse como secret en Cloudflare
  (dashboard o `wrangler secret put`), nunca en `wrangler.jsonc` ni committeado.
  `INSFORGE_BASE_URL` no es secreto y sí vive en `wrangler.jsonc` (`vars`).
- **Pendiente (fase 2, fuera de este ADR)**: el digest diario en sí (cron + envío de email)
  todavía no está implementado — hoy los envíos solo quedan guardados en InsForge. Requiere
  decidir servicio de envío de email (ej. Resend) y un Cloudflare Cron Trigger o función
  programada de InsForge. Ver `TODO.md`.
- **Manual, no automatizable desde acá**: crear la tabla (SQL de arriba) y cargar las env vars
  reales en Cloudflare — son acciones en cuentas externas del usuario, no algo que un agente
  deba hacer por él.
