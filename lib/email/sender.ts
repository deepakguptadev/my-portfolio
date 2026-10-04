import "server-only";

export type EmailMessage = {
  to: string;
  from: string;
  replyTo: string;
  subject: string;
  text: string;
};

export interface EmailSender {
  send(message: EmailMessage): Promise<void>;
}

/** Resend's REST API via fetch — no SDK dependency. */
class ResendSender implements EmailSender {
  constructor(private readonly apiKey: string) {}

  async send(message: EmailMessage) {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${this.apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: message.from,
        to: [message.to],
        reply_to: message.replyTo,
        subject: message.subject,
        text: message.text,
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) throw new Error(`Resend responded ${response.status}`);
  }
}

/** For local development and e2e tests: logs instead of sending. */
class ConsoleSender implements EmailSender {
  async send(message: EmailMessage) {
    console.info("[contact] email (console transport)", {
      to: message.to,
      subject: message.subject,
    });
  }
}

export type EmailConfig = { sender: EmailSender; to: string; from: string };

/** null when email isn't configured — the contact page then offers mailto only. */
export function getEmailConfig(): EmailConfig | null {
  const to = process.env.CONTACT_TO_EMAIL;
  if (!to) return null;

  if (process.env.EMAIL_TRANSPORT === "console") {
    return { sender: new ConsoleSender(), to, from: "console@localhost" };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!apiKey || !from) return null;
  return { sender: new ResendSender(apiKey), to, from };
}
