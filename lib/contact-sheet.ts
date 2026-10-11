import "server-only";

/** One submission as it lands in the sheet: choices are human-readable labels, "" when blank. */
export type SheetSubmission = {
  name: string;
  email: string;
  phone: string;
  company: string;
  projectType: string;
  budget: string;
  timeline: string;
  message: string;
};

export interface ContactSheet {
  save(submission: SheetSubmission): Promise<void>;
}

/**
 * A Google Apps Script web app bound to the sheet (scripts/google-apps-script/contact-sheet.gs).
 * It appends the row and emails the owner, so no other service is involved.
 */
class AppsScriptSheet implements ContactSheet {
  constructor(
    private readonly url: string,
    private readonly secret: string,
  ) {}

  async save(submission: SheetSubmission) {
    // Apps Script can't read request headers, so the secret travels in the body.
    const response = await fetch(this.url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...submission, secret: this.secret }),
      signal: AbortSignal.timeout(15_000),
    });
    if (!response.ok) throw new Error(`Google Sheets responded ${response.status}`);

    // Apps Script answers 200 even on failure, so the outcome is in the body. An HTML
    // sign-in page here means the deployment isn't shared with "Anyone".
    const result = (await response.json().catch(() => null)) as {
      ok?: unknown;
      error?: unknown;
    } | null;
    if (result?.ok !== true) {
      const reason = typeof result?.error === "string" ? result.error : "unexpected response";
      throw new Error(`Google Sheets didn't save the row: ${reason}`);
    }
  }
}

/** null when the sheet isn't configured. */
export function getContactSheet(): ContactSheet | null {
  const url = process.env.CONTACT_SHEET_URL;
  const secret = process.env.CONTACT_SHEET_SECRET;
  if (!url || !secret) return null;
  return new AppsScriptSheet(url, secret);
}
