# aigis-cloud

César Darío Aguilar's professional site — AI Engineer with a Cybersecurity Blue Team focus.
Portfolio, technical blog, AI/Blue Team labs, certifications, resume, and contact.

## Stack
- [Astro](https://astro.build) + [Tailwind CSS](https://tailwindcss.com)
- Markdown content collections (`src/content/projects`, `src/content/blog`)
- Hosting: Vercel (custom domain `aigis-cloud.com`)

## Development

```bash
npm install
npm run dev       # http://localhost:4321
npm run build      # generates dist/
npm run preview    # serves dist/ locally
```

## Structure
```
src/
  content/
    projects/    # one .md entry per portfolio project
    blog/        # blog posts
  layouts/Base.astro
  components/Nav.astro, Footer.astro
  pages/         # one route per file
public/
  favicon.svg
  resume.pdf     # TODO: upload updated resume
```

## Adding content
- **New project:** create `src/content/projects/<slug>.md` with the frontmatter defined in
  `src/content/config.ts` (title, summary, stack, role, repo, featured, order).
- **Blog post:** create `src/content/blog/<slug>.md` with (title, summary, date, tags).

## Deployment
Connected to Vercel. Every push to `main` deploys automatically. Domain `aigis-cloud.com`
is pointed from the Vercel dashboard.

## TODO
See `TODO.md`.
