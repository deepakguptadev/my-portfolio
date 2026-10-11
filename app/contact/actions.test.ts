// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { ContactSheet } from "@/lib/contact-sheet";
import type { EmailConfig } from "@/lib/email/sender";

const { getContactSheet, getEmailConfig } = vi.hoisted(() => ({
  getContactSheet: vi.fn<() => ContactSheet | null>(),
  getEmailConfig: vi.fn<() => EmailConfig | null>(),
}));
vi.mock("@/lib/contact-sheet", () => ({ getContactSheet }));
vi.mock("@/lib/email/sender", () => ({ getEmailConfig }));

import { submitContact } from "./actions";

const input = () => ({
  name: "Ada Lovelace",
  email: "ada@example.test",
  company: "",
  projectType: "full-time",
  message: "We have a senior frontend role that looks like a great fit.",
  website: "",
  startedAt: Date.now() - 10_000,
});

function sheet(save: ContactSheet["save"] = async () => {}) {
  const store = { save: vi.fn(save) };
  getContactSheet.mockReturnValue(store);
  return store;
}

function email(send: EmailConfig["sender"]["send"] = async () => {}) {
  const sender = { send: vi.fn(send) };
  getEmailConfig.mockReturnValue({ sender, to: "me@example.test", from: "site@example.test" });
  return sender;
}

beforeEach(() => {
  getContactSheet.mockReturnValue(null);
  getEmailConfig.mockReturnValue(null);
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => vi.restoreAllMocks());

describe("submitContact", () => {
  it("reports that the form isn't set up when there's nowhere to deliver", async () => {
    expect(await submitContact(input())).toEqual({
      status: "error",
      message: "The contact form isn't set up yet.",
    });
  });

  it("saves the submission to the sheet with readable labels", async () => {
    const store = sheet();
    expect(
      await submitContact({
        ...input(),
        phone: "+91 98765 43210",
        projectType: "freelance",
        budget: "1k-5k",
        timeline: "within-1-month",
      }),
    ).toEqual({ status: "success" });
    expect(store.save).toHaveBeenCalledWith({
      name: "Ada Lovelace",
      email: "ada@example.test",
      phone: "+91 98765 43210",
      company: "",
      projectType: "Freelance",
      budget: "$1,000 – $5,000",
      timeline: "Within a month",
      message: "We have a senior frontend role that looks like a great fit.",
    });
  });

  it("drops a budget for project types the form doesn't ask it for", async () => {
    const store = sheet();
    await submitContact({ ...input(), projectType: "full-time", budget: "15k-plus" });
    expect(store.save).toHaveBeenCalledWith(
      expect.objectContaining({ projectType: "Full-Time Opportunity", budget: "" }),
    );
  });

  it("leaves unanswered optional fields blank", async () => {
    const store = sheet();
    await submitContact(input());
    expect(store.save).toHaveBeenCalledWith(
      expect.objectContaining({ phone: "", budget: "", timeline: "" }),
    );
  });

  it("succeeds when the sheet fails but the email goes out", async () => {
    sheet(async () => {
      throw new Error("Google Sheets responded 500");
    });
    const sender = email();
    expect(await submitContact(input())).toEqual({ status: "success" });
    expect(sender.send).toHaveBeenCalledOnce();
    expect(console.error).toHaveBeenCalledWith(
      "[contact] delivery failed",
      "Google Sheets responded 500",
    );
  });

  it("fails when every channel fails", async () => {
    sheet(async () => {
      throw new Error("Google Sheets responded 500");
    });
    email(async () => {
      throw new Error("Resend responded 503");
    });
    expect(await submitContact(input())).toEqual({
      status: "error",
      message: "Your message couldn't be sent.",
    });
  });

  it("doesn't store bot submissions", async () => {
    const store = sheet();
    expect(await submitContact({ ...input(), website: "https://spam.test" })).toEqual({
      status: "success",
    });
    expect(await submitContact({ ...input(), startedAt: Date.now() })).toEqual({
      status: "success",
    });
    expect(store.save).not.toHaveBeenCalled();
  });
});
