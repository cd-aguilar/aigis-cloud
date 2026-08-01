import type { APIRoute } from 'astro';

// Única página no prerenderizada del sitio (ver docs/ADR/0003-insforge-contact-form.md).
// Corre como función SSR en el Worker de Cloudflare (adapter @astrojs/cloudflare).
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

export const POST: APIRoute = async (context) => {
  const { request, locals } = context;

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

  // En producción (Cloudflare Worker) las env vars/secrets llegan vía locals.runtime.env.
  // En `astro dev` local no existe ese runtime, así que caemos a import.meta.env (.env local).
  const runtimeEnv = (locals as { runtime?: { env?: Record<string, string> } }).runtime?.env;
  const INSFORGE_BASE_URL = runtimeEnv?.INSFORGE_BASE_URL ?? import.meta.env.INSFORGE_BASE_URL;
  const INSFORGE_SERVICE_KEY = runtimeEnv?.INSFORGE_SERVICE_KEY ?? import.meta.env.INSFORGE_SERVICE_KEY;

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
