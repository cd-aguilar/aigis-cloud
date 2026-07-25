# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: recruiters and hiring managers evaluating César Darío Aguilar for AI Engineering
roles. They arrive to judge credibility and depth quickly — skimming the portfolio, GitHub
activity, and CV before or during a hiring process.

Secondary (not yet active): freelance/consulting clients, once the `/services` section
launches (see Roadmap in PROJECT.md). Do not design for this audience as a current priority.

## Product Purpose

Personal brand and portfolio site for César Darío Aguilar. Showcases projects, a technical
blog, Blue Team/HTB labs, certifications, CV, and contact. Success means a recruiter or
hiring manager judges the work credible and takes a next step (contact, interview, follow).

## Positioning

AI applied to security operations — César builds AI/RAG/agent systems specifically for SOC,
detection, and blue-team workflows, not generic AI applications shown alongside unrelated
security credentials. This is the claim a plain "AI engineer" or "security analyst" portfolio
could not truthfully make.

## Operating Context

- GitHub (`cd-aguilar`) as the source of truth for real projects; portfolio entries link out
  to repos rather than embedding demos.
- Project and blog content lives in Markdown via Astro content collections
  (`src/content/projects`, `src/content/blog`).
- LinkedIn is a linked professional identity.
- HTB/Blue Team lab writeups are a planned content stream (not yet published).
- Contact happens through a form (see Capabilities and Constraints — currently unresolved
  implementation).

## Capabilities and Constraints

- Static site (Astro + Tailwind), no backend or database, Node 20+.
- CI runs `npm install && npm run build` on every push/PR; must not break the pipeline.
- **Contact form (required, not yet built):** must actually deliver submissions to César, not
  just collect them. He wants every submitted field forwarded to him, delivered as a daily
  digest rather than only a one-off per-submission send. Implementation open — Formspree vs. a
  Vercel serverless function (see TODO.md); a daily-digest delivery implies some form of
  storage or batching, which is a real exception to "no backend" and should be resolved
  deliberately, not by default.
- CV PDF, final bio copy, and a personal photo/logo do not exist yet — treat as open, not as
  placeholders to design around permanently.

## Brand Commitments

- Name: César Darío Aguilar. Domain: aigis-cloud.com. GitHub: `cd-aguilar`. LinkedIn linked.
- Site content is already in English (routes, nav, copy); "HTB Lab" was deliberately renamed
  to "Blue Team Lab".

## Evidence on Hand

Four real project repos are already loaded into the portfolio: `rag-api-cloud`,
`local-rag-second-brain`, `agent-orchestrator-soc`, `blue-team-detection-lab`. No CV PDF yet
(`public/resume.pdf` missing), no final bio copy, no personal photo/logo. Future work must not
fabricate a CV, testimonials, client case studies, or metrics that don't exist.

## Product Principles

- The AI + security-operations intersection is the credibility signal — don't dilute it into
  two generic, unrelated tracks.
- Every project shown must be real and traceable to a GitHub repo; no fabricated evidence.
- Stay static and dependency-light; only add server-side pieces (like the contact form) when a
  capability genuinely requires it, and say so explicitly when it happens.
- Content should read as credible to a technical recruiter, not as marketing copy.
