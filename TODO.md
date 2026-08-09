# TODO

## Pendiente
- [ ] Commitear y pushear a GitHub: normalización CRLF→LF, `STATUS.md` y
      `public/resume.pdf` v3 — Cowork no pudo hacerlo desde la carpeta conectada (falla al
      liberar `.git/index.lock`, sin credenciales para push). Correr a mano:
      `git add -u && git commit -m "..." && git push`.
- [ ] Migración mayor: Astro 4 → 7, para poder actualizar `@astrojs/cloudflare` de 11.2.0 a
      14.1.4 y resolver las 11 vulnerabilidades (7 high) que trae el adapter de Cloudflare
      actual (detalle completo en SECURITY.md). Es un salto de tres versiones mayores —
      planear aparte, no es un `npm audit fix` simple.
- [ ] Case study de `blue-team-detection-lab` — el repo en GitHub está vacío (sin README,
      sin código), así que no se pudo escribir un case study grounded como el de los otros
      tres. Falta cargar contenido real al repo, o pasarme el material como con
      agent-orchestrator-soc.
- [ ] Unificar `cdario.a@gmail.com` → `cda.admin@aigis-cloud.com` en README.md/SECURITY.md
      si corresponde (quedó pendiente de confirmar)
- [ ] Reemplazar bio/copy genérico de las páginas con contenido definitivo
- [ ] Autorizar conector de GitHub (OAuth) para sincronizar proyectos automáticamente
- [ ] Digest diario de `contact_submissions` (fase 2 de ADR-0003) — falta: elegir servicio
      de envío de email (candidato: Resend), y un Cloudflare Cron Trigger o función
      programada que junte los envíos con `digested_at is null`, mande el digest, y marque
      `digested_at`. Sin esto, los envíos quedan guardados pero nadie los lee todavía.
- [ ] Agregar foto/logo propio (reemplazar favicon genérico en `public/`)
- [ ] Primeros writeups de HTB en `src/content/blog`
- [ ] Revisar copy de `/services` cuando arranque la consultora

## En progreso
- [ ]

## Finalizado
- [x] Reordenados "Featured projects" (home + `/portfolio`) por peso para un reclutador AI
      Engineer: `agent-orchestrator-soc` (order 1) → `rag-api-cloud` (order 2) →
      `local-rag-second-brain` (order 3). Case study de `agent-orchestrator-soc` estaba
      desactualizada (decía que el eval y el gate de aprobación humana eran "próximos
      pasos" cuando ya estaban implementados) — reescrito summary/tags/Result y agregada
      línea de Architecture decisions sobre el gate (`interrupt()` + `MemorySaver`); sumado
      link a demo en vivo (`soc-api.aigis-cloud.com/docs`, campo `demo` del content
      collection). `rag-api-cloud` no necesitó reescritura, solo bajó de orden.
- [x] Formulario de contacto real (`/contact` + `src/pages/api/contact.ts`), guarda los
      envíos en InsForge (Postgres). Única página SSR del sitio (ver ADR-0003). **Live en
      producción desde 2026-08-01**: tabla creada, `INSFORGE_SERVICE_KEY` cargado en
      Cloudflare (`wrangler secret put`) y en `.dev.vars` local, probado end-to-end. De paso
      se corrigió un bug (ruta real de InsForge es `/api/database/records/{table}`, no
      `/api/db/{table}`) y se limpió un secret mal nombrado en Cloudflare. Pendiente: digest
      diario (fase 2, ver arriba).
- [x] Mini case study por proyecto (Problem / Architecture decisions / Result) para
      agent-orchestrator-soc, rag-api-cloud y local-rag-second-brain, con página de
      detalle nueva (`/portfolio/[slug]`) enlazada desde home y portfolio. Contenido de
      rag-api-cloud y local-rag-second-brain sacado de sus READMEs reales en GitHub, no
      inventado. De paso se arregló `.markdown-body`: la página de blog usaba clases
      `prose`/`prose-invert` de un plugin de Tailwind que nunca estuvo instalado, así que
      el contenido se renderizaba sin estilo.
- [x] CV real subido a `public/resume.pdf` (v2, 2026-07-24) — la página `/resume` ya
      detecta el archivo en build y muestra el botón de descarga real
- [x] CV alineado con LinkedIn (v3, 2026-08-02): corregido título de rol a "Radiation
      Safety Officer" y organización a "Nuclear Medicine and Radioterapy Center" para que
      coincida exactamente con el perfil actualizado
- [x] Perfil de LinkedIn actualizado (2026-08-02): About reescrito (sin stack/años), Top
      skills +FastAPI, servicio "Custom Software Development" agregado y publicado, fecha
      de fin de "Radiation Safety Officer" corregida a ene 2023 (ya no se superpone con el
      rol actual)
- [x] Email de contacto unificado a `cda.admin@aigis-cloud.com` en `/contact` (coincide
      con el CV; README.md/SECURITY.md siguen con `cdario.a@gmail.com`, sin tocar por
      ahora — avisar si también hay que unificarlos)
- [x] Template de proyecto instalado (.claude/, CI, docs de contexto)
- [x] Stack elegido: Astro + Tailwind CSS, estático
- [x] Scaffold del sitio (9 páginas) con content collections para proyectos y blog
- [x] Build verificado sin errores (`npm run build`)
- [x] Contenido inicial de portafolio cargado con los 4 repos de `cd-aguilar`
- [x] Dominio conectado: aigis-cloud.com en Vercel, DNS en Hostinger, SSL activo
- [x] Sitio traducido a inglés (rutas, nav, contenido, README) — "HTB Lab" renombrado a "Blue Team Lab"
