import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import tailwindcss from '@tailwindcss/vite';

// Hosting único: Cloudflare Workers (ver docs/ADR/0007-hosting-cloudflare-workers.md).
// El sitio es estático; la única ruta on-demand es /api/contact (prerender = false).
// Tailwind 4 se integra por el plugin de Vite, no por PostCSS (ver ADR-0006).
export default defineConfig({
  site: 'https://www.aigis-cloud.com',
  adapter: cloudflare(),
  vite: {
    plugins: [tailwindcss()],
  },
});
