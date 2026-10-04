import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const isMobile = (name: string) => name === "mobile";

test.describe("site shell", () => {
  test("skip link is the first focusable element and targets main", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: "Skip to content" });
    await expect(skip).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.locator("main#main")).toBeFocused();
  });

  test("header gains a background after scrolling", async ({ page }) => {
    await page.goto("/design-system");
    const header = page.locator("header[data-scrolled]");
    await expect(header).toHaveAttribute("data-scrolled", "false");
    await page.mouse.wheel(0, 600);
    await expect(header).toHaveAttribute("data-scrolled", "true");
  });

  test("command palette opens with the shortcut and navigates", async ({ page }, info) => {
    test.skip(isMobile(info.project.name), "keyboard shortcut is a desktop affordance");
    await page.goto("/design-system");
    await page.keyboard.press("ControlOrMeta+k");
    const dialog = page.getByRole("dialog", { name: "Command palette" });
    await expect(dialog).toBeVisible();
    await page.keyboard.type("home");
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL("/");
    await expect(dialog).toBeHidden();
  });

  test("palette closes with Escape and returns focus to the trigger", async ({ page }, info) => {
    test.skip(isMobile(info.project.name), "trigger is hidden on mobile");
    await page.goto("/");
    const trigger = page.getByRole("button", { name: /search/i });
    await trigger.click();
    await expect(page.getByRole("dialog", { name: "Command palette" })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test("theme command persists across reloads", async ({ page }, info) => {
    test.skip(isMobile(info.project.name), "covered by desktop");
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/");
    await page.keyboard.press("ControlOrMeta+k");
    await expect(page.getByRole("dialog", { name: "Command palette" })).toBeVisible();
    await page.keyboard.type("Use Dark Theme");
    await page.keyboard.press("Enter");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  });

  test("mobile drawer traps focus, closes on Escape and restores focus", async ({ page }, info) => {
    test.skip(!isMobile(info.project.name), "drawer is the mobile/tablet navigation");
    await page.goto("/");
    const menu = page.getByRole("button", { name: "Open menu" });
    await menu.click();
    const drawer = page.getByRole("dialog", { name: "Modules" });
    await expect(drawer).toBeVisible();
    await expect(drawer.getByRole("link", { name: /Experience/ })).toBeVisible();
    for (let i = 0; i < 25; i++) await page.keyboard.press("Tab");
    expect(await drawer.evaluate((el) => el.contains(document.activeElement))).toBe(true);
    await page.keyboard.press("Escape");
    await expect(drawer).toBeHidden();
    await expect(menu).toBeFocused();
  });

  test("unknown routes render the module-not-found page inside the shell", async ({ page }) => {
    const response = await page.goto("/does-not-exist");
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1, name: "Module not found" })).toBeVisible();
    await expect(page.getByRole("contentinfo")).toBeVisible();
  });

  for (const scheme of ["light", "dark"] as const) {
    test(`home has no axe violations (${scheme})`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: scheme });
      await page.goto("/");
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
        .analyze();
      expect(results.violations.map((v) => `${v.id}: ${v.nodes.length}`)).toEqual([]);
    });
  }

  test("no horizontal overflow at 320px", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 700 });
    await page.goto("/");
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    );
    expect(overflow).toBe(false);
  });

  for (const path of ["/", "/does-not-exist"]) {
    test(`no console errors or hydration warnings on ${path}`, async ({ page }) => {
      const errors: string[] = [];
      page.on("console", (m) => {
        if (m.type() === "error" && !m.text().includes("404")) errors.push(m.text());
      });
      page.on("pageerror", (e) => errors.push(e.message));
      await page.goto(path);
      // Hydration and idle-time work (palette preload) have finished by now.
      await page.waitForLoadState("load");
      await page.evaluate(() => new Promise((resolve) => requestIdleCallback(resolve)));
      expect(errors).toEqual([]);
    });
  }
});
