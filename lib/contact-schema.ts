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

export const MESSAGE_MIN = 20;
export const MESSAGE_MAX = 2000;
/** Humans take longer than this to fill the form; most bots don't. */
export const MIN_FILL_MS = 3000;

const projectTypeValues = projectTypes.map((t) => t.value) as [string, ...string[]];

/** Shared by the client form (instant feedback) and the server action (authority). */
export const contactSchema = z.object({
  name: z.string().trim().min(2, "Enter your name.").max(80, "Keep your name under 80 characters."),
  email: z.email("Enter a valid email address, like name@company.com.").max(200),
  company: z.string().trim().max(120, "Keep the company name under 120 characters.").optional(),
  projectType: z.enum(projectTypeValues, "Choose a project type."),
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

export function projectTypeLabel(value: string) {
  return projectTypes.find((t) => t.value === value)?.label ?? value;
}
