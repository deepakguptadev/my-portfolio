import { z } from "zod";
import { moduleRef, pending, period, slug } from "./common";

// ── Profile ──────────────────────────────────────────────────────────
export const profileSchema = z.object({
  name: z.string(),
  title: z.string(),
  subtitle: z.string(),
  experienceYears: z.string(),
  headline: z.string(),
  intro: z.string(),
  location: z.string(),
  availability: z.string(),
  workModes: z.array(z.string()).min(1),
  timezone: z.string(),
  primaryStack: z.array(z.string()).min(1),
  secondaryStack: z.array(z.string()),
  backendStack: z.array(z.string()),
  focusAreas: z.array(z.string()),
  heroBadges: z.array(z.string()),
  /** Headline results for the resume overview, taken verbatim from the resume. */
  highlights: z.array(z.object({ value: z.string(), label: z.string() })).default([]),
  education: z.object({
    degree: z.string(),
    field: z.string(),
    period,
    institution: z.string().nullable(),
  }),
  /** Structured "About" story; draft text is flagged until approved. */
  story: z.array(
    z.object({
      id: slug,
      title: z.string(),
      body: z.string(),
      draft: z.boolean().default(false),
    }),
  ),
  pending,
});

// ── Experience ───────────────────────────────────────────────────────
export const roleSchema = z.object({
  id: slug,
  /** null when the employer hasn't been confirmed. */
  company: z.string().nullable(),
  title: z.string(),
  period,
  location: z.string().nullable(),
  summary: z.string().nullable(),
  responsibilities: z.array(z.string()),
  technologies: z.array(z.string()),
  focus: z.array(z.string()),
  achievements: z.array(z.string()),
  projects: z.array(slug),
  pending,
});

export const experienceSchema = z.array(roleSchema).min(1);

// ── Skills ───────────────────────────────────────────────────────────
export const skillCategorySchema = z.object({
  id: slug,
  label: z.string(),
  skills: z.array(z.string()).min(1),
});

export const skillsSchema = z.array(skillCategorySchema).min(1);

// ── Projects (MDX metadata export) ───────────────────────────────────
export const projectMetaSchema = z.object({
  title: z.string(),
  shortTitle: z.string(),
  summary: z.string().max(200),
  industry: z.string(),
  client: z.object({
    name: z.string(),
    /** Public label used until naming the client is confirmed. */
    anonymized: z.string(),
    /** Only true once Deepak confirms the client may be named. */
    nameApproved: z.boolean(),
  }),
  period: period.nullable(),
  role: z.string().nullable(),
  featured: z.boolean().default(false),
  order: z.number().int(),
  problem: z.string(),
  solution: z.string(),
  stack: z.object({
    frontend: z.array(z.string()),
    backend: z.array(z.string()),
    infrastructure: z.array(z.string()),
  }),
  features: z.array(z.object({ group: z.string(), items: z.array(z.string()).min(1) })),
  workflow: z.array(z.string()).min(2),
  /** Id of a system graph in content/graphs. */
  architectureGraph: z.string().nullable(),
  related: z.array(moduleRef).default([]),
  pending,
});

// ── Notes (MDX metadata export) ──────────────────────────────────────
export const noteStatus = z.enum(["published", "draft", "sample"]);

export const noteMetaSchema = z
  .object({
    title: z.string(),
    summary: z.string().max(200),
    tags: z.array(z.string()).min(1),
    status: noteStatus,
    /** Only set for real publications; never invented. */
    publishedAt: z.iso.date().nullable().default(null),
    related: z.array(moduleRef).default([]),
  })
  .refine((note) => note.status !== "published" || note.publishedAt !== null, {
    message: "Published notes need a real publishedAt date",
  });

// ── Engineering ──────────────────────────────────────────────────────
export const principleSchema = z.object({
  id: slug,
  label: z.string(),
  summary: z.string(),
  practices: z.array(z.string()).min(1),
  related: z.array(slug),
  draft: z.boolean().default(false),
});

export const engineeringSchema = z.object({
  principles: z.array(principleSchema).min(1),
  performance: z.object({
    philosophy: z.string(),
    process: z.array(
      z.object({ id: slug, label: z.string(), question: z.string(), tools: z.array(z.string()) }),
    ),
    topics: z.array(
      z.object({
        id: slug,
        label: z.string(),
        category: z.string(),
        technique: z.string(),
        whenToUse: z.string(),
        pitfall: z.string(),
      }),
    ),
    /** Real measurements of this site only; empty until measured. */
    measurements: z.array(
      z.object({
        metric: z.string(),
        value: z.string(),
        page: z.string(),
        tool: z.string(),
        measuredAt: z.iso.date(),
      }),
    ),
  }),
  ai: z.object({
    positioning: z.string(),
    tools: z.array(z.string()).min(1),
    useCases: z.array(z.object({ label: z.string(), humanCheckpoint: z.string() })),
  }),
  quality: z.object({
    layers: z.array(
      z.object({ label: z.string(), tools: z.array(z.string()), purpose: z.string() }),
    ),
  }),
});

export type Profile = z.infer<typeof profileSchema>;
export type Role = z.infer<typeof roleSchema>;
export type SkillCategory = z.infer<typeof skillCategorySchema>;
export type ProjectMeta = z.infer<typeof projectMetaSchema>;
export type NoteMeta = z.infer<typeof noteMetaSchema>;
export type NoteStatus = z.infer<typeof noteStatus>;
export type Principle = z.infer<typeof principleSchema>;
export type Engineering = z.infer<typeof engineeringSchema>;
