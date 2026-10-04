import { describe, expect, it } from "vitest";
import { architecture } from "./architecture";
import { engineering } from "./engineering";
import { experience } from "./experience";
import { graphs } from "./graphs";
import { profile } from "./profile";
import { skills } from "./skills";

// Importing a content module runs its schema validation; these tests
// additionally pin the honesty rules from the plan.
describe("content", () => {
  it("loads and validates every structured content module", () => {
    expect(profile.name).toBe("Deepak Gupta");
    expect(experience.length).toBeGreaterThan(0);
    expect(skills.length).toBe(9);
    expect(Object.keys(graphs)).toHaveLength(9);
    expect(architecture.modules.map((m) => m.id)).toEqual([
      "react",
      "nextjs",
      "micro-frontends",
      "api",
      "delivery",
    ]);
  });

  it("never invents performance measurements", () => {
    expect(engineering.performance.measurements).toEqual([]);
  });

  it("backs every percentage highlight with a recorded achievement", () => {
    const achievements = experience.flatMap((role) => role.achievements).join(" ");
    for (const { value } of profile.highlights.filter((h) => h.value.includes("%"))) {
      expect(achievements).toContain(value.replace(/^~/, ""));
    }
  });

  it("flags every role that is missing facts", () => {
    for (const role of experience) {
      const incomplete = !role.company || role.responsibilities.length === 0;
      if (incomplete) expect(role.pending.length).toBeGreaterThan(0);
    }
  });

  it("keeps the DNA graph connected to every principle", () => {
    const principleIds = engineering.principles.map((p) => p.id);
    const fromCenter = graphs.dna.edges.filter((e) => e.from === "deepak").map((e) => e.to);
    expect(fromCenter.sort()).toEqual([...principleIds].sort());
  });

  it("keeps rendering matrix rows aligned with columns", () => {
    const { columns, rows } = architecture.renderingMatrix;
    for (const row of rows) expect(row.values).toHaveLength(columns.length);
  });
});
