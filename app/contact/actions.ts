"use server";

import {
  contactSchema,
  MIN_FILL_MS,
  projectTypeLabel,
  type ContactInput,
} from "@/lib/contact-schema";
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

  const config = getEmailConfig();
  if (!config) {
    return { status: "error", message: "The contact form isn't set up yet." };
  }

  try {
    await config.sender.send({
      to: config.to,
      from: config.from,
      replyTo: data.email,
      subject: oneLine(`Portfolio: ${projectTypeLabel(data.projectType)} — ${data.name}`),
      text: [
        `Name: ${data.name}`,
        `Email: ${data.email}`,
        `Company: ${data.company || "—"}`,
        `Project type: ${projectTypeLabel(data.projectType)}`,
        "",
        data.message,
      ].join("\n"),
    });
    return { status: "success" };
  } catch (error) {
    console.error("[contact] send failed", error instanceof Error ? error.message : error);
    return { status: "error", message: "Your message couldn't be sent." };
  }
}
