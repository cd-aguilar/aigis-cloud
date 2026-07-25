# TODO

## Pendiente
- [ ] Reemplazar bio/copy genérico de las páginas con contenido definitivo
- [ ] Autorizar conector de GitHub (OAuth) para sincronizar proyectos automáticamente
- [ ] Formulario de contacto real (Formspree o función serverless en Vercel) — debe
      entregar todos los campos enviados a César, como digest diario y no solo un envío
      puntual por submission; implica algo de storage/batching, que es una excepción real
      al "sin backend" y debe resolverse a propósito (ver PRODUCT.md)
- [ ] Agregar foto/logo propio (reemplazar favicon genérico en `public/`)
- [ ] Primeros writeups de HTB en `src/content/blog`
- [ ] Revisar copy de `/services` cuando arranque la consultora

## En progreso
- [ ]

## Finalizado
- [x] CV real subido a `public/resume.pdf` (v2, 2026-07-24) — la página `/resume` ya
      detecta el archivo en build y muestra el botón de descarga real
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
