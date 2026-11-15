import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';

// Hosting único: Vercel (ver docs/ADR/0005-single-hosting-vercel.md).
// El sitio es estático; la única ruta on-demand es /api/contact (prerender = false).
// Tailwind 4 se integra por el plugin de Vite, no por PostCSS: con PostCSS, Vite resuelve
// `@import 'tailwindcss'` como archivo y el build falla (ver ADR-0006).
export default defineConfig({
  site: 'https://www.aigis-cloud.com',
  adapter: vercel(),
  vite: {
    plugins: [tailwindcss()],
  },
});
