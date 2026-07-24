import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://aigis-cloud.com',
  integrations: [tailwind()],
});
