/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        ink: '#0b1120',
        accent: '#22d3ee',
        accent2: '#a78bfa',
      },
      backgroundImage: {
        'accent-gradient': 'linear-gradient(90deg, #22d3ee, #a78bfa)',
      },
    },
  },
  plugins: [],
};
