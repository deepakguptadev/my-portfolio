// @vitest-environment node
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { describe, expect, it } from "vitest";

const source = readFileSync(new URL("contact-sheet.gs", import.meta.url), "utf8");

/** Runs the script against fake Apps Script services and records what it does. */
function loadScript({
  secret = "s3cret" as string | null,
  sheetExists = true,
  mailFails = false,
} = {}) {
  const rows: unknown[][] = [];
  const emails: Record<string, unknown>[] = [];
  let frozenRows = 0;
  const sheet = {
    appendRow: (row: unknown[]) => rows.push([...row]),
    setFrozenRows: (count: number) => (frozenRows = count),
  };
  const context: Record<string, unknown> = {
    console: { error: () => {} },
    SpreadsheetApp: {
      getActiveSpreadsheet: () => ({
        getSheetByName: () => (sheetExists ? sheet : null),
        insertSheet: () => sheet,
      }),
    },
    PropertiesService: {
      getScriptProperties: () => ({
        getProperty: (key: string) => (key === "CONTACT_SHEET_SECRET" ? secret : null),
      }),
    },
    MailApp: {
      sendEmail: (message: Record<string, unknown>) => {
        if (mailFails) throw new Error("Service invoked too many times for one day: email.");
        emails.push({ ...message });
      },
    },
    Session: { getEffectiveUser: () => ({ getEmail: () => "owner@example.test" }) },
    ContentService: {
      MimeType: { JSON: "JSON" },
      createTextOutput: (text: string) => ({ text, setMimeType: () => ({ text }) }),
    },
  };
  runInNewContext(source, context);

  const doPost = context.doPost as (e: unknown) => { text: string };
  const postRaw = (contents: string) => JSON.parse(doPost({ postData: { contents } }).text);
  const post = (body: Record<string, unknown>) => postRaw(JSON.stringify(body));
  return { post, postRaw, rows, emails, frozenRows: () => frozenRows };
}

const submission = {
  secret: "s3cret",
  name: "Ada Lovelace",
  email: "ada@example.test",
  phone: "+44 20 7946 0000",
  company: "",
  projectType: "Freelance",
  budget: "$1,000 – $5,000",
  timeline: "Within a month",
  message: "I'd like to talk about a reporting dashboard.",
};

describe("contact-sheet.gs", () => {
  it("appends the submission as a row and emails the owner", () => {
    const script = loadScript();
    expect(script.post(submission)).toEqual({ ok: true });

    expect(script.rows).toHaveLength(1);
    expect(script.rows[0].slice(1)).toEqual([
      "'Ada Lovelace",
      "'ada@example.test",
      "'+44 20 7946 0000",
      "",
      "'Freelance",
      "'$1,000 – $5,000",
      "'Within a month",
      "'I'd like to talk about a reporting dashboard.",
    ]);
    expect(script.emails).toEqual([
      expect.objectContaining({
        to: "owner@example.test",
        replyTo: "ada@example.test",
        subject: "Portfolio: Freelance — Ada Lovelace",
      }),
    ]);
    expect(script.emails[0].body).toContain("Phone: +44 20 7946 0000\nCompany: —");
    expect(script.emails[0].body).toContain("Budget: $1,000 – $5,000\nTimeline: Within a month");
  });

  it("stores formula-like input as plain text", () => {
    const script = loadScript();
    script.post({ ...submission, name: '=HYPERLINK("http://evil.test","x")' });
    expect(script.rows[0][1]).toBe(`'=HYPERLINK("http://evil.test","x")`);
  });

  it("keeps single-line fields on one line", () => {
    const script = loadScript();
    script.post({ ...submission, name: "Ada\r\nBcc: someone@example.test" });
    expect(script.emails[0].subject).toBe("Portfolio: Freelance — Ada Bcc: someone@example.test");
  });

  it("rejects a wrong secret without touching the sheet", () => {
    const script = loadScript();
    expect(script.post({ ...submission, secret: "guess" })).toEqual({
      ok: false,
      error: "unauthorized",
    });
    expect(script.rows).toEqual([]);
    expect(script.emails).toEqual([]);
  });

  it("rejects everything until the secret property is set", () => {
    const script = loadScript({ secret: null });
    expect(script.post({ ...submission, secret: undefined }).ok).toBe(false);
    expect(script.rows).toEqual([]);
  });

  it("rejects malformed bodies and missing fields", () => {
    const script = loadScript();
    expect(script.postRaw("not json")).toEqual({ ok: false, error: "invalid JSON" });
    expect(script.post({ ...submission, message: "   " })).toEqual({
      ok: false,
      error: "missing fields",
    });
    expect(script.rows).toEqual([]);
  });

  it("creates the Submissions sheet with a frozen header row on first use", () => {
    const script = loadScript({ sheetExists: false });
    script.post(submission);
    expect(script.rows[0]).toEqual([
      "Received",
      "Name",
      "Email",
      "Phone",
      "Company",
      "Project type",
      "Budget",
      "Timeline",
      "Message",
    ]);
    expect(script.rows).toHaveLength(2);
    expect(script.frozenRows()).toBe(1);
  });

  it("still saves the row when the notification email fails", () => {
    const script = loadScript({ mailFails: true });
    expect(script.post(submission)).toEqual({ ok: true });
    expect(script.rows).toHaveLength(1);
  });
});
