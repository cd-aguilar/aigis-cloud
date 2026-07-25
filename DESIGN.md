---
name: aigis-cloud
description: AI Engineer / Blue Team portfolio — an ops-console reading of a personal site
colors:
  void-ink: "#0b1120"
  signal-cyan: "#22d3ee"
  ops-violet: "#a78bfa"
  slate-200: "#e2e8f0"
  slate-300: "#cbd5e1"
  slate-400: "#94a3b8"
  slate-500: "#64748b"
  hairline: "rgba(255,255,255,0.10)"
  surface-1: "rgba(255,255,255,0.02)"
  surface-2: "rgba(255,255,255,0.04)"
typography:
  display:
    fontFamily: "Inter, system-ui, sans-serif"
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "JetBrains Mono, monospace"
    fontWeight: 500
    letterSpacing: "0.08em"
rounded:
  sm: "6px"
  md: "8px"
  full: "9999px"
spacing:
  section-y: "5rem"
  gutter: "1.5rem"
  container: "72rem"
components:
  button-primary:
    backgroundColor: "{colors.signal-cyan}"
    textColor: "{colors.void-ink}"
    rounded: "{rounded.md}"
    padding: "12px 20px"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "#ffffff"
    rounded: "{rounded.md}"
    padding: "12px 20px"
  card:
    backgroundColor: "{colors.surface-1}"
    rounded: "{rounded.md}"
    padding: "24px"
---

# Design System: aigis-cloud

## Overview

**Creative North Star: "The Ops Console"**

The site reads as an operations console for a person, not a landing-page template: a dark
working surface where information is dense, legible, and calm under pressure, and where the
one signal color that appears is load-bearing rather than decorative. It exists to let a
technical recruiter believe, within seconds, that the person behind it actually runs systems
like this for real — the UI itself behaves like the disciplined, blue-team-minded engineering
it describes.

The dark ground and cyan/violet accent pair are confirmed, durable brand commitments — they
are not being replaced. What changes is discipline: the accent is rare and meaningful instead
of ambient, depth comes from real tonal layering instead of decorative blur, and the terminal
motif in the hero is treated as a real artifact (specific commands, real status) rather than a
generic "hacker" prop.

**Key Characteristics:**
- Near-black ink ground, flat by default, depth via border + tonal fill, never shadow.
- One accent family (cyan primary, violet secondary) used only where it carries real signal.
- Inter for reading, JetBrains Mono reserved for genuinely technical content.
- Generous, consistent vertical rhythm; density comes from real content, not ornament.

## Colors

A near-black neutral ground carries almost the entire surface; cyan and violet exist to mark
what actually matters, not to decorate.

### Primary
- **Signal Cyan** (`#22d3ee`): the single color that means "this is the primary action or the
  thing that's true right now" — primary buttons, active nav/link state, live-status dots,
  focus rings. Used sparingly enough that its appearance is itself informative.

### Secondary
- **Ops Violet** (`#a78bfa`): secondary signal, used only paired with cyan (e.g. inside the one
  permitted gradient-text moment per page) or for a second, clearly distinct status/category
  marker. Never used alone as a primary CTA color.

### Neutral
- **Void Ink** (`#0b1120`): page background.
- **Slate 200/300/400/500** (`#e2e8f0` / `#cbd5e1` / `#94a3b8` / `#64748b`): text hierarchy —
  200 for primary body copy on dark, 300–400 for secondary copy, 500 for tertiary/meta text
  (timestamps, footnotes, mono labels).
- **Hairline** (`rgba(255,255,255,0.10)`): all borders and dividers.
- **Surface 1 / Surface 2** (`rgba(255,255,255,0.02)` / `rgba(255,255,255,0.04)`): tonal panel
  fills for cards, nav, footer, code blocks — the only way this system expresses elevation.

### Named Rules
**The One Voice Rule.** Cyan/violet appear only where they carry real signal: the primary CTA,
an active or "live" state, a genuinely emphasized term, or a status indicator. Everything else
is neutral. If removing the color wouldn't remove any information, it doesn't belong.

**The No-Ambient-Glow Rule.** No decorative blurred glow shapes, no gradient washes behind
content for atmosphere. Contrast and hairlines create focus; blur is not a substitute for
hierarchy.

## Typography

**Display / Body Font:** Inter (with `system-ui, sans-serif` fallback)
**Label / Mono Font:** JetBrains Mono (with `monospace` fallback)

**Character:** A workhorse grotesque carries all reading; the mono face is a tool, not a
decoration — it appears only where the content is genuinely technical (a command, a stack
name, a status string, a timestamp), never as a stylistic label on ordinary UI text.

### Hierarchy
- **Display** (800, `clamp(2.25rem, 4vw + 1rem, 3.75rem)`, 1.05): hero H1 only.
- **Headline** (700–800, `1.5–2rem`, 1.15): section H2s.
- **Title** (600, `1.125–1.25rem`, 1.3): card and block headings (H3).
- **Body** (400, `1–1.125rem`, 1.6, max 65–75ch): paragraph copy.
- **Label** (500, `0.75rem`, tracking `0.08em`, uppercase, mono): kickers, nav-adjacent tags,
  timestamps — reserved for content that is actually data-like.

### Named Rules
**The Real-Data-Only Mono Rule.** JetBrains Mono renders commands, stack tokens, hashes, IOCs,
status strings, and timestamps. It does not render generic UI copy just for a "technical"
feel; that reads as costume, not evidence.

## Layout

Single centered container, `max-width: 72rem` (`max-w-6xl`), `1.5rem` (`px-6`) side gutter.
Sections stack vertically with a consistent `~5rem` (`py-20`) rhythm, tightened to `~3.5rem`
for dense/utility sections (feature strip, footer). Content groups tightly within a card or
block and separates generously between blocks — no visual middle ground. Responsive collapse
is single-column below `md`; multi-column grids (3-up feature strip, 3-up project cards)
resolve to 1-column on mobile, not a cramped 2-up.

## Elevation & Depth

Flat by default. Depth is tonal, not shadowed: a raised surface is a hairline border
(`rgba(255,255,255,0.10)`) plus a faint fill (`surface-1`/`surface-2`), never a `box-shadow`.
Hover states step up one tonal notch (border and/or fill brighten slightly) rather than lifting
with a shadow.

### Named Rules
**The Flat-By-Default Rule.** No box-shadows anywhere in the system. Interactive states
communicate through border/fill tone and color, never elevation.

## Shapes

Soft, restrained corners: `6px` on small controls, `8px` on cards and buttons, fully rounded
(`9999px`) on pills, badges, and status dots. Borders are always `1px` hairlines at 10% white.
No heavy corner radii, no sharp/brutalist zero-radius language.

## Components

### Buttons
- **Shape:** `8px` radius.
- **Primary:** solid `signal-cyan` fill, `void-ink` text, `12px 20px` padding, semibold. This
  is the one place a solid accent fill is always earned — it's the primary action.
- **Secondary:** transparent fill, `1px` white/15 border, white text; border brightens toward
  cyan on hover.
- **Hover / Focus:** primary brightens slightly (no gradient shimmer); secondary's border tints
  toward `signal-cyan`; visible focus ring in `signal-cyan` on both.

### Badges / Status
- **Style:** pill shape, `1px` cyan/30 border, cyan/10 fill, cyan text, mono label, small
  leading status dot in solid cyan.
- **Use:** exactly the "is this true right now" role (open to work, live status) — not a
  generic tag.

### Cards / Containers
- **Corner Style:** `8px`.
- **Background:** `surface-1`, stepping to `surface-2` plus a cyan-tinted border on hover for
  interactive/featured cards.
- **Shadow Strategy:** none — see Elevation & Depth.
- **Border:** `1px` hairline; featured/active cards use a cyan-tinted hairline instead of a
  shadow to read as "raised."
- **Internal Padding:** `24px` (`p-6`).

### Navigation
- Sticky header, `void-ink` at 80% opacity with backdrop-blur, hairline bottom border. Link
  default is `slate-300`; hover and active state move straight to `signal-cyan`, no underline
  animation. Mobile collapses to a disclosure panel using the same link treatment.

### Terminal Panel (signature component)
The hero's "session" panel is the system's signature artifact: a bordered `surface-1` panel
with a mono title bar (three inert dots + filename) and mono body content. It must always show
real, specific content (real stack, real current status) — never filler like generic Lorem-ish
command output — since this component is the system's one dramatization of "this person
actually operates like this."

## Do's and Don'ts

### Do:
- **Do** treat cyan as a signal, not a paint color — every use should be answerable with "why
  here."
- **Do** keep the terminal/mono panel factually specific and current.
- **Do** use tonal fill + hairline border for every raised surface.
- **Do** keep one consistent section rhythm (`~5rem`) down the whole page.

### Don't:
- **Don't** add blurred ambient glow shapes or tiled hairline/dot grid textures behind hero
  or section content — those read as a generic generated-UI signature, not this system's
  own vocabulary. Depth and interest come from real content and tonal layering, not
  decorative canvas/blueprint textures.
- **Don't** use `gradient-text` more than once per viewport.
- **Don't** introduce a new accent hue outside cyan/violet.
- **Don't** use `box-shadow` for elevation.
- **Don't** use JetBrains Mono for ordinary labels/headings that aren't genuinely data-like.
