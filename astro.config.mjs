import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

// Hosting único: Vercel (ver docs/ADR/0005-single-hosting-vercel.md).
// El sitio es estático; la única ruta on-demand es /api/contact (prerender = false).
export default defineConfig({
  site: 'https://www.aigis-cloud.com',
  adapter: vercel(),
});
