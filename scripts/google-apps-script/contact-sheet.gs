/**
 * Portfolio contact form → this Google Sheet, plus an email to you for each message.
 * The site (lib/contact-sheet.ts) validates every submission before posting it here.
 *
 * Setup, once:
 * 1. In the Google Sheet: Extensions → Apps Script. Replace everything in Code.gs with this file.
 * 2. Project Settings (gear icon) → Script Properties → Add script property:
 *    CONTACT_SHEET_SECRET = the same value as CONTACT_SHEET_SECRET in the site's environment.
 * 3. Deploy → New deployment → Select type: Web app.
 *    Execute as: Me. Who has access: Anyone. Deploy, allow the permissions Google asks for,
 *    then copy the Web app URL (it ends in /exec) into CONTACT_SHEET_URL.
 *
 * After changing this file: Deploy → Manage deployments → Edit (pencil) → Version: New version,
 * so the same URL runs the new code.
 */

/** Set to false to stop the email you get for each message. */
const SEND_NOTIFICATION = true;

const SHEET_NAME = "Submissions";
const HEADERS = [
  "Received",
  "Name",
  "Email",
  "Phone",
  "Company",
  "Project type",
  "Budget",
  "Timeline",
  "Message",
];

// Mirrors lib/contact-schema.ts. The site validates first; these only cap what gets stored.
const LIMITS = {
  name: 80,
  email: 200,
  phone: 25,
  company: 120,
  projectType: 80,
  budget: 80,
  timeline: 80,
  message: 2000,
};

function doPost(e) {
  let body;
  try {
    body = JSON.parse(e.postData.contents);
  } catch {
    return reply({ ok: false, error: "invalid JSON" });
  }

  const secret = PropertiesService.getScriptProperties().getProperty("CONTACT_SHEET_SECRET");
  if (!secret)
    return reply({ ok: false, error: "CONTACT_SHEET_SECRET script property is not set" });
  if (body.secret !== secret) return reply({ ok: false, error: "unauthorized" });

  const submission = {
    name: oneLine(text(body.name, LIMITS.name)),
    email: oneLine(text(body.email, LIMITS.email)),
    phone: oneLine(text(body.phone, LIMITS.phone)),
    company: oneLine(text(body.company, LIMITS.company)),
    projectType: oneLine(text(body.projectType, LIMITS.projectType)),
    budget: oneLine(text(body.budget, LIMITS.budget)),
    timeline: oneLine(text(body.timeline, LIMITS.timeline)),
    message: text(body.message, LIMITS.message),
  };
  if (!submission.name || !submission.email || !submission.message) {
    return reply({ ok: false, error: "missing fields" });
  }

  submissionsSheet().appendRow([
    new Date(),
    asText(submission.name),
    asText(submission.email),
    asText(submission.phone),
    asText(submission.company),
    asText(submission.projectType),
    asText(submission.budget),
    asText(submission.timeline),
    asText(submission.message),
  ]);

  if (SEND_NOTIFICATION) notify(submission);
  return reply({ ok: true });
}

/** Opening the Web app URL in a browser shows this, to confirm the deployment works. */
function doGet() {
  return reply({ ok: true, service: "contact-sheet" });
}

function submissionsSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function notify(submission) {
  try {
    MailApp.sendEmail({
      to: Session.getEffectiveUser().getEmail(),
      replyTo: submission.email,
      subject: `Portfolio: ${submission.projectType} — ${submission.name}`,
      body: [
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
    });
  } catch (error) {
    // The row is already saved; a failed email (e.g. the daily quota) mustn't fail the message.
    console.error("Notification email failed", error);
  }
}

function text(value, max) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function oneLine(value) {
  return value.replace(/[\r\n]+/g, " ");
}

/** A leading apostrophe makes Sheets keep the value as typed: no formulas, dates or numbers. */
function asText(value) {
  return value ? `'${value}` : "";
}

function reply(result) {
  return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
