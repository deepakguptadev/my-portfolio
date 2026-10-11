// @vitest-environment node
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { getContactSheet } from "./contact-sheet";

const submission = {
  name: "Ada Lovelace",
  email: "ada@example.test",
  phone: "+44 20 7946 0000",
  company: "",
  projectType: "Freelance",
  budget: "$1,000 – $5,000",
  timeline: "Within a month",
  message: "I'd like to talk about a reporting dashboard.",
};

function configure() {
  vi.stubEnv("CONTACT_SHEET_URL", "https://script.google.com/macros/s/abc/exec");
  vi.stubEnv("CONTACT_SHEET_SECRET", "s3cret");
}

function respondWith(body: string, status = 200) {
  const fetchMock = vi.fn(async () => new Response(body, { status }));
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("getContactSheet", () => {
  it("is null unless both the URL and the secret are set", () => {
    vi.stubEnv("CONTACT_SHEET_URL", "https://script.google.com/macros/s/abc/exec");
    vi.stubEnv("CONTACT_SHEET_SECRET", "");
    expect(getContactSheet()).toBeNull();

    vi.stubEnv("CONTACT_SHEET_URL", "");
    vi.stubEnv("CONTACT_SHEET_SECRET", "s3cret");
    expect(getContactSheet()).toBeNull();
  });

  it("posts the submission with the secret to the web app", async () => {
    configure();
    const fetchMock = respondWith(JSON.stringify({ ok: true }));

    await getContactSheet()!.save(submission);

    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("https://script.google.com/macros/s/abc/exec");
    expect(init.method).toBe("POST");
    expect(JSON.parse(init.body as string)).toEqual({ ...submission, secret: "s3cret" });
  });

  it("fails on an HTTP error", async () => {
    configure();
    respondWith("Server error", 500);
    await expect(getContactSheet()!.save(submission)).rejects.toThrow(
      "Google Sheets responded 500",
    );
  });

  it("fails when the script reports an error", async () => {
    configure();
    respondWith(JSON.stringify({ ok: false, error: "unauthorized" }));
    await expect(getContactSheet()!.save(submission)).rejects.toThrow(
      "Google Sheets didn't save the row: unauthorized",
    );
  });

  it("fails when Google answers with a sign-in page instead of JSON", async () => {
    configure();
    respondWith("<!doctype html><title>Sign in</title>");
    await expect(getContactSheet()!.save(submission)).rejects.toThrow("unexpected response");
  });
});
