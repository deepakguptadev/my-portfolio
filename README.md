# Deepak Gupta — Engineering Portfolio

An interactive engineering portfolio built as a small engineering system: typed content, a
token-driven design system, interactive architecture diagrams, and tests that guard
accessibility and performance.

**Stack:** Next.js 16 (App Router, fully static) · React 19 · TypeScript (strict) · Tailwind CSS v4
· Radix primitives · MDX · Zod · React Hook Form · Vitest · Playwright + axe

## Getting started

```bash
npm install
npm run dev            # http://localhost:3000
```

The dev-only style guide lives at `/design-system` (404 in production unless
`SHOW_DESIGN_SYSTEM=true`).

## Scripts

| Script                   | What it does                                                                      |
| ------------------------ | --------------------------------------------------------------------------------- |
| `npm run dev`            | Development server                                                                |
| `npm run build`          | Production build (every route is statically prerendered)                          |
| `npm run lint`           | ESLint                                                                            |
| `npm run typecheck`      | TypeScript, no emit                                                               |
| `npm test`               | Unit and component tests (Vitest): content schemas, contrast, graph logic         |
| `npm run test:e2e`       | Playwright: user journeys, axe in both themes, 320px overflow, performance budget |
| `npm run content:status` | Lists every fact still missing across the site                                    |
| `npm run format`         | Prettier (with Tailwind class sorting)                                            |

End-to-end tests use your installed Google Chrome locally; CI installs Playwright's Chromium.

## Editing content

All content is separate from UI and validated with Zod at build time — invalid content fails the
build with a readable error.

| What                                             | Where                         |
| ------------------------------------------------ | ----------------------------- |
| Name, intro, location, availability, About story | `content/profile.ts`          |
| Roles and timeline                               | `content/experience.ts`       |
| Skills by category                               | `content/skills.ts`           |
| Engineering DNA, Performance Lab, AI section     | `content/engineering.ts`      |
| Architecture Lab modules and tables              | `content/architecture.ts`     |
| Diagrams (nodes, edges, lenses, traces)          | `content/graphs/*.ts`         |
| Case studies                                     | `content/projects/<slug>.mdx` |
| Notes                                            | `content/notes/<slug>.mdx`    |

**Honesty rules.** Nothing is invented. Unknown facts go in a `pending` list and render as a visible
"Content required" marker. Performance numbers stay empty until really measured. A note only gets a
date, sitemap entry and Article markup once `status: "published"` with a real `publishedAt`. A
client is only named once `client.nameApproved` is `true`.

Run `npm run content:status` to see what's left.

## Configuration

Copy `.env.example` to `.env.local`. Everything optional degrades honestly:

| Variable                                                   | Effect when unset                                          |
| ---------------------------------------------------------- | ---------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`                                     | Canonical URLs, sitemap and OG point at localhost          |
| `NEXT_PUBLIC_RESUME_URL`                                   | Resume buttons open a pre-addressed email instead          |
| `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`, `RESEND_API_KEY` | Contact page shows "email me directly" instead of the form |
| `EMAIL_TRANSPORT=console`                                  | (Dev/tests) form "sends" by logging, no email              |
| `NEXT_PUBLIC_ANALYTICS=vercel`                             | Enables Vercel Analytics + Speed Insights                  |

## Architecture

```
app/          routes (static), metadata files (sitemap, robots, OG images), contact server action
components/   ui/ primitives · layout/ shell · viz/ SystemGraph engine · per-page sections
content/      typed content + MDX (no UI code)
lib/          schemas, content loaders, graph geometry, SEO/JSON-LD, email sender, tokens
styles/       tokens.css — the only place raw color values live (enforced by a test)
tests/e2e/    Playwright specs
```

Design tokens are defined once with CSS `light-dark()`; a test checks WCAG contrast for every
text/background pair in both themes and fails on raw hex values outside `styles/tokens.css`.

## Launch checklist

- [ ] Fill the items reported by `npm run content:status`
- [ ] Resume PDF → `public/resume/…` or `NEXT_PUBLIC_RESUME_URL`
- [ ] Domain + `NEXT_PUBLIC_SITE_URL`
- [ ] Resend: verify the sending domain (SPF/DKIM), set the three contact variables, send a real test
- [ ] Vercel: import the repo, set env vars, add a firewall rate-limit rule for the contact action
- [ ] Optional: `NEXT_PUBLIC_ANALYTICS=vercel`; Sentry once a DSN exists
- [ ] Check OG previews (LinkedIn Post Inspector), validate structured data, submit the sitemap
- [ ] Manual pass: VoiceOver/NVDA, keyboard only, 200% zoom, real phones
- [ ] After launch: record real Lighthouse results in `content/engineering.ts → performance.measurements`
