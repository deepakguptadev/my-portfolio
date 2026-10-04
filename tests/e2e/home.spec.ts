import { expect, test } from "@playwright/test";

test.describe("home", () => {
  test("states who, what and availability above the fold", async ({ page }, info) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { level: 1, name: /Building scalable web applications/ }),
    ).toBeInViewport();
    await expect(page.getByText(/7\+ years of experience/).first()).toBeVisible();
    if (info.project.name === "desktop") {
      await expect(page.getByRole("link", { name: "View Resume" })).toBeInViewport();
      await expect(page.getByText("Immediate Joiner").first()).toBeInViewport();
    }
  });

  test("recruiter snapshot lists the six key facts", async ({ page }) => {
    await page.goto("/");
    const snapshot = page.locator("section", {
      has: page.getByRole("heading", { name: "Recruiter snapshot" }),
    });
    for (const label of [
      "Experience",
      "Primary stack",
      "Backend",
      "Location",
      "Availability",
      "Work mode",
    ]) {
      await expect(snapshot.getByText(label, { exact: true })).toBeVisible();
    }
    await expect(snapshot.getByText("Delhi NCR, India")).toBeVisible();
  });

  test("hero diagram is interactive on desktop and a list on mobile", async ({ page }, info) => {
    await page.goto("/");
    if (info.project.name === "desktop") {
      const apis = page
        .getByRole("group", { name: /How I build/ })
        .getByRole("button", { name: /^APIs,/ });
      await apis.click();
      await expect(apis).toHaveAttribute("aria-pressed", "true");
    } else {
      await expect(page.getByRole("list", { name: /How I build.*layers/ })).toBeVisible();
    }
  });
});
