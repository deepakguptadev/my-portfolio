import { defineContent } from "@/lib/schemas/common";
import { experienceSchema } from "@/lib/schemas/content";

/**
 * Only the companies, titles and years from the brief's timeline are
 * recorded. Everything else is listed in `pending` until supplied.
 * Newest first.
 */
export const experience = defineContent("experience", experienceSchema, [
  {
    id: "senior-engineer",
    company: null,
    title: "Senior Engineer",
    period: { start: "2024", end: null },
    location: null,
    summary: null,
    responsibilities: [],
    technologies: [],
    focus: [],
    achievements: [],
    projects: [],
    pending: [
      "Employer for the 2024 Senior Engineer role",
      "Exact start month",
      "Responsibilities",
      "Technologies used",
      "Key achievements (no unverified numbers)",
      "Confirm whether the Quality Inspection Platform belongs to this role",
    ],
  },
  {
    id: "atcs-nagarro",
    company: "ATCS / Nagarro",
    title: "Engineer",
    period: { start: "2022", end: "2024" },
    location: null,
    summary: null,
    responsibilities: [],
    technologies: [],
    focus: [],
    achievements: [],
    projects: [],
    pending: [
      "Exact title and start/end months",
      "Responsibilities",
      "Technologies used",
      "Key achievements",
    ],
  },
  {
    id: "web-corporation",
    company: "Web Corporation",
    title: "Software Developer",
    period: { start: "2019", end: "2022" },
    location: null,
    summary: null,
    responsibilities: [],
    technologies: [],
    focus: [],
    achievements: [],
    projects: [],
    pending: [
      "Exact start/end months",
      "Responsibilities",
      "Technologies used",
      "Key achievements",
    ],
  },
]);
