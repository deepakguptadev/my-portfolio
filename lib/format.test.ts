import { describe, expect, it } from "vitest";
import { formatPartialDate, formatPeriod } from "./format";

describe("format", () => {
  it("formats year-only and year-month values without inventing detail", () => {
    expect(formatPartialDate("2019")).toBe("2019");
    expect(formatPartialDate("2024-11")).toBe("Nov 2024");
  });

  it("formats open and closed periods", () => {
    expect(formatPeriod({ start: "2024-11", end: "2025-03" })).toBe("Nov 2024 – Mar 2025");
    expect(formatPeriod({ start: "2024", end: null })).toBe("2024 – Present");
  });
});
