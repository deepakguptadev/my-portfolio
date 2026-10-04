import { describe, expect, it } from "vitest";
import { commandGroups, commands, commandsByGroup } from "./commands";
import { primaryNav, secondaryNav } from "./navigation";

describe("command registry", () => {
  it("has unique ids", () => {
    const ids = commands.map((command) => command.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("reaches every navigation module", () => {
    const hrefs = commands.flatMap((c) => (c.action.type === "navigate" ? [c.action.href] : []));
    for (const item of [...primaryNav, ...secondaryNav]) expect(hrefs).toContain(item.href);
    expect(hrefs).toContain("/");
  });

  it("includes the commands named in the brief", () => {
    const labels = commands.map((command) => command.label);
    for (const label of [
      "Go to Home",
      "Go to About",
      "Go to Experience",
      "Explore Projects",
      "Open Architecture Lab",
      "Read Engineering Notes",
      "View Skills",
      "Contact Deepak",
      "Toggle Theme",
    ]) {
      expect(labels).toContain(label);
    }
  });

  it("offers a resume action that never points at a fake URL", () => {
    const resume = commands.find((command) => command.id === "resume");
    expect(resume?.action.type).toBe("external");
    if (resume?.action.type === "external" && !process.env.NEXT_PUBLIC_RESUME_URL) {
      expect(resume.action.href.startsWith("mailto:")).toBe(true);
    }
  });

  it("assigns every command to a known group", () => {
    const grouped = commandGroups.flatMap((group) => commandsByGroup(group));
    expect(grouped).toHaveLength(commands.length);
  });
});
