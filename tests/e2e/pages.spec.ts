import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const pages = [
  "/about",
  "/experience",
  "/projects",
  "/projects/quality-inspection-platform",
  "/architecture",
  "/engineering",
  "/skills",
  "/notes",
  "/notes/nextjs-rendering-strategies",
  "/resume",
  "/contact",
];

test.describe("module pages", () => {
  for (const path of pages) {
    test(`${path}: one h1, no axe violations (light + dark), no console errors`, async ({
      page,
    }) => {
      const errors: string[] = [];
      page.on("pageerror", (e) => errors.push(e.message));
      page.on("console", (m) => m.type() === "error" && errors.push(m.text()));

      for (const scheme of ["light", "dark"] as const) {
        await page.emulateMedia({ colorScheme: scheme });
        await page.goto(path);
        await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
        const results = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
          .analyze();
        expect(results.violations.map((v) => `${scheme} ${v.id}: ${v.nodes[0]?.target}`)).toEqual(
          [],
        );
      }
      expect(errors).toEqual([]);
    });

    test(`${path}: no horizontal overflow at 320px`, async ({ page }) => {
      await page.setViewportSize({ width: 320, height: 700 });
      await page.goto(path);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - window.innerWidth,
      );
      expect(overflow).toBeLessThanOrEqual(0);
    });
  }

  test("project filter syncs with the URL", async ({ page }) => {
    await page.goto("/projects");
    await page.getByRole("button", { name: "React", exact: true }).click();
    await expect(page).toHaveURL(/tech=react/);
    await expect(page.getByRole("status").filter({ hasText: "1 project" })).toBeVisible();
    await page.goto("/projects?tech=react&tech=no-such-tech");
    await expect(page.getByText("No projects match those technologies")).toBeVisible();
  });

  test("architecture lab module is addressable by URL", async ({ page }) => {
    await page.goto("/architecture?module=micro-frontends");
    await expect(page.getByRole("tab", { name: "Micro Frontends" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    await page.getByRole("tab", { name: "API Architecture" }).click();
    await expect(page).toHaveURL(/module=api/);
  });

  test("experience deep link expands the role", async ({ page }) => {
    await page.goto("/experience#atcs-nagarro");
    await expect(page.getByRole("button", { name: /Engineer\s*ATCS \/ Nagarro/ })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    await page.getByRole("button", { name: "Expand all" }).click();
    await expect(page.getByRole("button", { name: "Collapse all" })).toBeVisible();
  });

  test("skills filter narrows the categories", async ({ page }) => {
    await page.goto("/skills");
    await page.getByLabel("Filter skills").fill("playwright");
    await expect(page.getByRole("status").filter({ hasText: "1 matching skill" })).toBeVisible();
  });

  test("case study table of contents links to sections", async ({ page }, info) => {
    test.skip(info.project.name !== "desktop", "sticky TOC is a wide-screen feature");
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/projects/quality-inspection-platform");
    const toc = page.getByRole("navigation", { name: "On this page" });
    await toc.getByRole("link", { name: "Architecture" }).click();
    await expect(page).toHaveURL(/#architecture$/);
    await expect(page.locator("#architecture")).toBeInViewport();
  });
});
