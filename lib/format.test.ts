import { describe, expect, it } from "vitest";
import { formatDuration, formatPartialDate, formatPeriod } from "./format";

describe("format", () => {
  it("formats year-only and year-month values without inventing detail", () => {
    expect(formatPartialDate("2019")).toBe("2019");
    expect(formatPartialDate("2024-11")).toBe("Nov 2024");
  });

  it("formats open and closed periods", () => {
    expect(formatPeriod({ start: "2024-11", end: "2025-03" })).toBe("Nov 2024 – Mar 2025");
    expect(formatPeriod({ start: "2024", end: null })).toBe("2024 – Present");
  });

  it("counts durations inclusively and only when exact", () => {
    expect(formatDuration({ start: "2024-07", end: "2026-03" })).toBe("1 yr 9 mos");
    expect(formatDuration({ start: "2022-04", end: "2026-03" })).toBe("4 yrs");
    expect(formatDuration({ start: "2026-06", end: "2026-07" })).toBe("2 mos");
    expect(formatDuration({ start: "2026-06", end: "2026-06" })).toBe("1 mo");
    expect(formatDuration({ start: "2015", end: "2019" })).toBeNull();
    expect(formatDuration({ start: "2024-07", end: null })).toBeNull();
  });
});
