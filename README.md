# aigis-cloud

Live site: https://aigis-cloud.com

Personal portfolio and technical blog for Cesar Dario Aguilar — Chemical Engineer transitioning into AI Engineering with a Cybersecurity Blue Team focus.

Built with Astro, Tailwind CSS and TypeScript. Deployed on Vercel.

## What's on the site

- Projects — AI/RAG systems, cloud security automation, and agent-based tooling
- Blog — technical writing on AI, Cloud, and Cybersecurity
- Labs — Blue Team / Hack The Box write-ups (MITRE ATT&CK, threat detection, DFIR)
- Certifications — Cloud (AWS/GCP) and security credentials
- Resume and contact

## Stack

- Astro + Tailwind CSS + TypeScript
- Markdown content collections (`src/content/projects`, `src/content/blog`)
- Hosting: Vercel (custom domain `aigis-cloud.com`)

## Development

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # generates dist/
npm run preview  # serves dist/ locally
```

## Structure

```
src/
  content/
    projects/   # one .md entry per portfolio project
    blog/       # blog posts
  layouts/      Base.astro
  components/   Nav.astro, Footer.astro
  pages/        # one route per file
public/
  favicon.svg
  resume.pdf
```

## Adding content

- New project: create `src/content/projects/<slug>.md` with the frontmatter defined in `src/content/config.ts` (title, summary, stack, role, repo, featured, order).
- Blog post: create `src/content/blog/<slug>.md` with (title, summary, date, tags).

## Deployment

Connected to Vercel. Every push to `main` deploys automatically. Domain `aigis-cloud.com` is pointed from the Vercel dashboard.

## Connect

- LinkedIn: [in/cesar-dario-aguilar-a0324b15](https://www.linkedin.com/in/cesar-dario-aguilar-a0324b15)
- Email: cdario.a@gmail.com
