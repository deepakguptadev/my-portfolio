"use server";

import {
  asksForBudget,
  budgetLabel,
  contactSchema,
  MIN_FILL_MS,
  projectTypeLabel,
  timelineLabel,
  type ContactInput,
} from "@/lib/contact-schema";
import { getContactSheet, type SheetSubmission } from "@/lib/contact-sheet";
import { getEmailConfig } from "@/lib/email/sender";

export type ContactResult =
  | { status: "success" }
  | { status: "invalid"; fieldErrors: Partial<Record<keyof ContactInput, string>> }
  | { status: "error"; message: string };

const oneLine = (value: string) => value.replace(/[\r\n]+/g, " ").trim();

export async function submitContact(input: ContactInput): Promise<ContactResult> {
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Partial<Record<keyof ContactInput, string>> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof ContactInput;
      fieldErrors[key] ??= issue.message;
    }
    // A filled honeypot looks like success to the bot, but nothing is sent.
    if (fieldErrors.website) return { status: "success" };
    return { status: "invalid", fieldErrors };
  }

  const data = parsed.data;
  if (Date.now() - data.startedAt < MIN_FILL_MS) return { status: "success" };

  const sheet = getContactSheet();
  const email = getEmailConfig();
  if (!sheet && !email) {
    return { status: "error", message: "The contact form isn't set up yet." };
  }

  // Readable labels, and a budget only where the form asked for one.
  const submission: SheetSubmission = {
    name: data.name,
    email: data.email,
    phone: data.phone ?? "",
    company: data.company ?? "",
    projectType: projectTypeLabel(data.projectType),
    budget: asksForBudget(data.projectType) ? budgetLabel(data.budget) : "",
    timeline: timelineLabel(data.timeline),
    message: data.message,
  };

  const deliveries: Promise<void>[] = [];
  if (sheet) deliveries.push(sheet.save(submission));
  if (email) {
    deliveries.push(
      email.sender.send({
        to: email.to,
        from: email.from,
        replyTo: submission.email,
        subject: oneLine(`Portfolio: ${submission.projectType} — ${submission.name}`),
        text: [
          `Name: ${submission.name}`,
          `Email: ${submission.email}`,
          `Phone: ${submission.phone || "—"}`,
          `Company: ${submission.company || "—"}`,
          `Project type: ${submission.projectType}`,
          `Budget: ${submission.budget || "—"}`,
          `Timeline: ${submission.timeline || "—"}`,
          "",
          submission.message,
        ].join("\n"),
      }),
    );
  }

  // The message has arrived if any channel took it; the others' failures are only logged.
  const results = await Promise.allSettled(deliveries);
  for (const result of results) {
    if (result.status === "rejected") {
      const reason: unknown = result.reason;
      console.error("[contact] delivery failed", reason instanceof Error ? reason.message : reason);
    }
  }
  if (results.some((result) => result.status === "fulfilled")) return { status: "success" };
  return { status: "error", message: "Your message couldn't be sent." };
}
