import { describe, expect, it } from "vitest";
import { asksForBudget, contactSchema } from "./contact-schema";

const valid = {
  name: "Ada Lovelace",
  email: "ada@example.test",
  projectType: "freelance",
  message: "I'd like to talk about a reporting dashboard.",
  startedAt: 1,
};

const errorFor = (field: string, value: unknown) =>
  contactSchema
    .safeParse({ ...valid, [field]: value })
    .error?.issues.find((issue) => issue.path[0] === field)?.message;

describe("contactSchema", () => {
  it("accepts a message with every optional field left blank", () => {
    expect(
      contactSchema.safeParse({ ...valid, phone: "", company: "", budget: "", timeline: "" })
        .success,
    ).toBe(true);
  });

  it.each(["+91 98765 43210", "(020) 7946-0000", "555.123.4567", "  +1 555 123 4567  "])(
    "accepts the phone number %s",
    (phone) => expect(errorFor("phone", phone)).toBeUndefined(),
  );

  it.each(["call me", "12345", "+1 555 123 4567 890 123", `1${" ".repeat(30)}234567`])(
    "rejects the phone number %j",
    (phone) => expect(errorFor("phone", phone)).toBeDefined(),
  );

  it("only accepts budgets and timelines from the lists", () => {
    expect(errorFor("budget", "5k-15k")).toBeUndefined();
    expect(errorFor("budget", "a million")).toBe("Choose a budget from the list.");
    expect(errorFor("timeline", "asap")).toBeUndefined();
    expect(errorFor("timeline", "yesterday")).toBe("Choose a timeline from the list.");
  });
});

describe("asksForBudget", () => {
  it("asks for paid project work only", () => {
    expect(asksForBudget("freelance")).toBe(true);
    expect(asksForBudget("consulting")).toBe(true);
    expect(asksForBudget("product-development")).toBe(true);
    expect(asksForBudget("full-time")).toBe(false);
    expect(asksForBudget("technical-discussion")).toBe(false);
    expect(asksForBudget(undefined)).toBe(false);
  });
});
