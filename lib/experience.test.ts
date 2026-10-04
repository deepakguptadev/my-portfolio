import { describe, expect, it } from "vitest";
import { groupRolesByCompany } from "./experience";
import type { Role } from "./schemas/content";

const role = (id: string, company: string | null, start: string, end: string | null): Role => ({
  id,
  company,
  title: id,
  period: { start, end },
  location: null,
  summary: null,
  responsibilities: [],
  technologies: [],
  focus: [],
  achievements: [],
  projects: [],
  pending: [],
});

describe("groupRolesByCompany", () => {
  it("folds consecutive roles at one employer into a single tenure", () => {
    const groups = groupRolesByCompany([
      role("senior", "Acme", "2024-07", "2026-03"),
      role("engineer", "Acme", "2022-04", "2024-07"),
      role("developer", "Other", "2019-05", "2022-03"),
    ]);
    expect(groups.map((g) => g.roles.map((r) => r.id))).toEqual([
      ["senior", "engineer"],
      ["developer"],
    ]);
    expect(groups[0].period).toEqual({ start: "2022-04", end: "2026-03" });
  });

  it("never merges roles whose employer is unconfirmed", () => {
    const groups = groupRolesByCompany([
      role("a", null, "2024", null),
      role("b", null, "2022", "2024"),
    ]);
    expect(groups).toHaveLength(2);
  });
});
