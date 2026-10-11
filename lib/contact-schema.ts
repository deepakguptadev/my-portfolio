import { z } from "zod";

export const projectTypes = [
  { value: "full-time", label: "Full-Time Opportunity" },
  { value: "freelance", label: "Freelance" },
  { value: "consulting", label: "Consulting" },
  { value: "product-development", label: "Product Development" },
  { value: "technical-discussion", label: "Technical Discussion" },
  { value: "collaboration", label: "Collaboration" },
  { value: "other", label: "Other" },
] as const;

/** Budget only makes sense for paid project work, not for jobs or conversations. */
const budgetProjectTypes: readonly string[] = ["freelance", "consulting", "product-development"];

export const budgets = [
  { value: "under-1k", label: "Under $1,000" },
  { value: "1k-5k", label: "$1,000 – $5,000" },
  { value: "5k-15k", label: "$5,000 – $15,000" },
  { value: "15k-plus", label: "$15,000+" },
  { value: "not-sure", label: "Not sure yet" },
] as const;

export const timelines = [
  { value: "asap", label: "As soon as possible" },
  { value: "within-1-month", label: "Within a month" },
  { value: "1-3-months", label: "In 1–3 months" },
  { value: "flexible", label: "Flexible" },
] as const;

export const MESSAGE_MIN = 20;
export const MESSAGE_MAX = 2000;
/** Humans take longer than this to fill the form; most bots don't. */
export const MIN_FILL_MS = 3000;

type Option = { value: string; label: string };
const valuesOf = (options: readonly Option[]) =>
  options.map((option) => option.value) as [string, ...string[]];

/** Formats differ by country, so this only checks for a plausible number. */
function isPhoneNumber(value: string) {
  const digits = value.replace(/\D/g, "").length;
  return /^\+?[\d\s().-]+$/.test(value) && digits >= 7 && digits <= 15;
}

/** An optional dropdown: unanswered ("") or one of its options. */
const optionalChoice = (options: readonly Option[], message: string) =>
  z.enum(["", ...valuesOf(options)], message).optional();

/** Shared by the client form (instant feedback) and the server action (authority). */
export const contactSchema = z.object({
  name: z.string().trim().min(2, "Enter your name.").max(80, "Keep your name under 80 characters."),
  email: z.email("Enter a valid email address, like name@company.com.").max(200),
  phone: z
    .string()
    .trim()
    .max(25, "Keep the phone number under 25 characters.")
    .refine(
      (value) => value === "" || isPhoneNumber(value),
      "Enter a valid phone number, like +91 98765 43210.",
    )
    .optional(),
  company: z.string().trim().max(120, "Keep the company name under 120 characters.").optional(),
  projectType: z.enum(valuesOf(projectTypes), "Choose a project type."),
  budget: optionalChoice(budgets, "Choose a budget from the list."),
  timeline: optionalChoice(timelines, "Choose a timeline from the list."),
  message: z
    .string()
    .trim()
    .min(MESSAGE_MIN, `Write at least ${MESSAGE_MIN} characters so I have some context.`)
    .max(MESSAGE_MAX, `Keep the message under ${MESSAGE_MAX} characters.`),
  /** Honeypot: hidden from people, filled by naive bots. */
  website: z.string().max(0).optional(),
  /** Epoch ms when the form was rendered. */
  startedAt: z.number().int().positive(),
});

export type ContactInput = z.infer<typeof contactSchema>;

export function asksForBudget(projectType: string | undefined) {
  return projectType !== undefined && budgetProjectTypes.includes(projectType);
}

const labelOf = (options: readonly Option[], value = "") =>
  options.find((option) => option.value === value)?.label ?? value;

export const projectTypeLabel = (value: string) => labelOf(projectTypes, value);
export const budgetLabel = (value?: string) => labelOf(budgets, value);
export const timelineLabel = (value?: string) => labelOf(timelines, value);
