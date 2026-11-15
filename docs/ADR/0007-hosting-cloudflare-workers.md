# ADR-0007: Hosting único en Cloudflare Workers (reemplaza ADR-0005)

## Estado
Propuesta (2026-11-15). Reemplaza a ADR-0005, del mismo día.

## Contexto
ADR-0005 movió el hosting a Vercel para arreglar `/api/contact`, que devolvía 404 porque el
dominio lo servía Vercel en modo estático mientras el endpoint estaba compilado para el
Worker de Cloudflare. Eso se resolvió. Después aparecieron dos datos nuevos:

1. **El proyecto está en el plan Hobby de Vercel, que no admite uso comercial.** Las Fair Use
   Guidelines de Vercel restringen Hobby a uso personal no comercial, y un sitio que
   promociona los servicios de una consultora cae del lado comercial. Quedar en regla cuesta
   USD 20/mes (Pro).
2. **El DNS vuelve a Cloudflare** (decisión del 2026-11-15), para recuperar WAF y Bot Fight
   Mode delante del sitio.

Además, el motivo técnico por el que ADR-0005 se alejó de Cloudflare ya no existe: las 19
vulnerabilidades (1 crítica, 14 altas) no venían del adapter en sí, sino de que
`@astrojs/cloudflare@11.2.0` clavaba `astro ^4.10.3` como peer dependency. Con Astro 7, la
versión actual del adapter (`@astrojs/cloudflare@14.4.8`, que pide `astro ^7.4.0`) da
**0 vulnerabilidades** en `npm audit`. Verificado en un árbol limpio antes de decidir.

## Decisión
- Hosting único en **Cloudflare Workers**, con `@astrojs/cloudflare`. `/api/contact` corre
  como función del Worker.
- **Las variables se leen con `import { env } from 'cloudflare:workers'`.** `locals.runtime.env`,
  que es lo que usaba este repo cuando estaba en Astro 4 con el adapter 11, **fue eliminado en
  Astro 6**: con el adapter v14 lanza `Astro.locals.runtime.env has been removed in Astro v6` y
  el endpoint devuelve 500. Se detectó probando el endpoint en el runtime del Worker; de no
  hacerlo, el formulario habría quedado roto en producción otra vez.
- En desarrollo local las variables salen de **`.dev.vars`** (convención de Wrangler), no de
  `.env`.
- **Rate limiting propio del Worker en `/api/contact`:** binding `CONTACT_RATE_LIMITER`
  (Rate Limiting API de Workers), 5 envíos por minuto y por IP, aplicado antes de tocar
  InsForge. Sin costo y sin servicios extra. Verificado en local: el sexto envío del minuto
  devuelve 429 con `Retry-After`.
- Se mantiene todo lo demás de ADR-0005: Astro 7, la migración de content collections, el
  widget con SRI, `security.txt`, `robots.txt` y la validación de origen del endpoint.
- Las cabeceras de seguridad pasan de `vercel.json` a `public/_headers`, que Workers Static
  Assets sirve. La CSP sigue en `Report-Only`.
- `INSFORGE_BASE_URL` vuelve a `wrangler.jsonc` (no es secreto).
  `INSFORGE_SERVICE_KEY` se carga con `wrangler secret put` o por el dashboard.

## Alternativas consideradas
- **Pagar Vercel Pro** (USD 240/año): deja todo como está y queda en regla, pero es el costo
  recurrente más alto de la infraestructura del proyecto, por un sitio estático con un solo
  endpoint.
- **Seguir en Hobby**: sin costo, pero fuera de los términos del proveedor. Para una
  consultora de seguridad es una incoherencia difícil de defender.

## Consecuencias
- `npm audit`: 0 vulnerabilidades.
- El proyecto de Vercel queda sin uso: borrarlo (o dejarlo sin dominio) después del cutover,
  y revocar sus tokens.
- `wrangler.jsonc` para el adapter v14 **no** lleva `main` ni `assets`: los inyecta el plugin
  de Vite. Declararlos hace fallar el build antes de que exista `dist/`.
- El orden del cutover importa, para no cortar el sitio ni el correo:
  1. Agregar el dominio a Cloudflare e importar la zona actual de Hostinger (MX incluidos).
  2. Cambiar los nameservers en Hostinger. El sitio lo sigue sirviendo Vercel por los
     registros importados; el correo no se entera.
  3. Verificar sitio y correo.
  4. Recién ahí, desplegar el Worker y apuntarle el dominio.
  5. Cargar `INSFORGE_SERVICE_KEY` como secret del Worker y probar el formulario.
- El rate limit de `/api/contact` queda resuelto en el propio Worker. Si hiciera falta algo más
  fuerte (bloqueo por país, challenge), se suma encima una regla de WAF.
- Hay que crear `.dev.vars` local (a partir de `.dev.vars.example`) para levantar el sitio en
  desarrollo con el formulario funcionando.
