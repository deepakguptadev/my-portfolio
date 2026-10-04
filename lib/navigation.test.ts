import { describe, expect, it } from "vitest";
import { isActivePath } from "./navigation";

describe("isActivePath", () => {
  it("matches the module and its detail pages", () => {
    expect(isActivePath("/projects", "/projects")).toBe(true);
    expect(isActivePath("/projects/quality-inspection-platform", "/projects")).toBe(true);
  });

  it("does not match sibling prefixes", () => {
    expect(isActivePath("/notes-archive", "/notes")).toBe(false);
  });

  it("treats home as exact-only", () => {
    expect(isActivePath("/", "/")).toBe(true);
    expect(isActivePath("/about", "/")).toBe(false);
  });
});
