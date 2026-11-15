import type { APIRoute } from 'astro';
// Astro 7 + @astrojs/cloudflare v14: `locals.runtime.env` fue eliminado; las vars, los secrets
// y los bindings del Worker se leen por aquí. En local los provee `.dev.vars`.
import { env as workerEnv } from 'cloudflare:workers';

// Única página no prerenderizada del sitio (ver docs/ADR/0003-insforge-contact-form.md).
// Corre como función del Worker de Cloudflare (adapter @astrojs/cloudflare).
// Ver docs/ADR/0007-hosting-cloudflare-workers.md.
export const prerender = false;

interface ContactPayload {
  name: string;
  email: string;
  message: string;
  // Honeypot: los bots suelen rellenar todos los inputs, incluidos los ocultos.
  // Un humano nunca debería completar este campo.
  company?: string;
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isAllowedOrigin(origin: string, requestHost: string): boolean {
  try {
    const host = new URL(origin).host;
    // Mismo host que la request (cubre producción, previews y localhost).
    return host === requestHost || host === 'aigis-cloud.com' || host === 'www.aigis-cloud.com';
  } catch {
    return false;
  }
}

// Rate Limiting API de Workers (binding `CONTACT_RATE_LIMITER` en wrangler.jsonc).
interface RateLimiter {
  limit(options: { key: string }): Promise<{ success: boolean }>;
}

interface RuntimeEnv {
  INSFORGE_BASE_URL?: string;
  INSFORGE_SERVICE_KEY?: string;
  CONTACT_RATE_LIMITER?: RateLimiter;
}

const env = workerEnv as unknown as RuntimeEnv;

export const POST: APIRoute = async (context) => {
  const { request } = context;

  // Solo aceptamos envíos hechos desde el propio sitio (corta el abuso trivial del endpoint
  // desde otros orígenes; no reemplaza un rate limit, ver SECURITY.md).
  const origin = request.headers.get('origin');
  if (origin && !isAllowedOrigin(origin, new URL(request.url).host)) {
    return new Response(JSON.stringify({ error: 'Origin not allowed' }), { status: 403 });
  }
  if (!(request.headers.get('content-type') ?? '').includes('application/json')) {
    return new Response(JSON.stringify({ error: 'Content-Type must be application/json' }), { status: 415 });
  }

  // Rate limit por IP antes de tocar el backend: 5 envíos por minuto.
  const limiter = env.CONTACT_RATE_LIMITER;
  if (limiter) {
    const ip = request.headers.get('CF-Connecting-IP') ?? 'unknown';
    const { success } = await limiter.limit({ key: `contact:${ip}` });
    if (!success) {
      return new Response(JSON.stringify({ error: 'Demasiados envíos. Probá de nuevo en un minuto.' }), {
        status: 429,
        headers: { 'Retry-After': '60' },
      });
    }
  }

  let body: ContactPayload;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), { status: 400 });
  }

  const name = (body.name ?? '').trim();
  const email = (body.email ?? '').trim();
  const message = (body.message ?? '').trim();

  // Honeypot: si viene relleno, respondemos 200 "falso" sin escribir nada (no delatar al bot).
  if (body.company) {
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  }

  if (!name || !email || !message) {
    return new Response(JSON.stringify({ error: 'name, email y message son requeridos' }), { status: 400 });
  }
  if (name.length > 200 || email.length > 200 || message.length > 5000) {
    return new Response(JSON.stringify({ error: 'Campo demasiado largo' }), { status: 400 });
  }
  if (!isValidEmail(email)) {
    return new Response(JSON.stringify({ error: 'Email inválido' }), { status: 400 });
  }

  const INSFORGE_BASE_URL = env.INSFORGE_BASE_URL;
  const INSFORGE_SERVICE_KEY = env.INSFORGE_SERVICE_KEY;

  if (!INSFORGE_BASE_URL || !INSFORGE_SERVICE_KEY) {
    console.error('Faltan INSFORGE_BASE_URL / INSFORGE_SERVICE_KEY en el entorno');
    return new Response(JSON.stringify({ error: 'Contact form is temporarily unavailable' }), { status: 500 });
  }

  try {
    const res = await fetch(`${INSFORGE_BASE_URL}/api/database/records/contact_submissions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${INSFORGE_SERVICE_KEY}`,
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({ name, email, message }),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => '');
      console.error('InsForge insert failed', res.status, detail);
      return new Response(JSON.stringify({ error: 'No se pudo guardar el mensaje' }), { status: 502 });
    }

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err) {
    console.error('InsForge request error', err);
    return new Response(JSON.stringify({ error: 'No se pudo contactar el backend' }), { status: 502 });
  }
};
