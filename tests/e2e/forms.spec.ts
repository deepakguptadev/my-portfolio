import { expect, test } from "@playwright/test";

test.describe("notes", () => {
  test("search filters the list and shows an empty state", async ({ page }) => {
    await page.goto("/notes");
    await page.getByLabel("Search notes").fill("micro frontends");
    await expect(page.getByRole("status").filter({ hasText: "1 note" })).toBeVisible();
    await page.getByLabel("Search notes").fill("zzz-no-match");
    await expect(page.getByText(/No notes match/)).toBeVisible();
    await page.getByRole("button", { name: "Clear search" }).click();
    await expect(page.getByRole("status").filter({ hasText: "3 notes" })).toBeVisible();
  });

  test("sample notes are labeled and kept out of search engines", async ({ page }) => {
    await page.goto("/notes/nextjs-rendering-strategies");
    await expect(page.getByText("Sample", { exact: true }).first()).toBeVisible();
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  });
});

test.describe("resume", () => {
  test("tabs are addressable and every panel is present for print", async ({ page }) => {
    await page.goto("/resume?tab=education");
    await expect(page.getByRole("tab", { name: "Education" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    await page.emulateMedia({ media: "print" });
    for (const heading of ["Overview", "Experience", "Skills", "Projects", "Education"]) {
      await expect(
        page.getByRole("heading", { level: 2, name: heading, exact: true }),
      ).toBeVisible();
    }
  });
});

test.describe("contact form", () => {
  test("validates fields and focuses the first error", async ({ page }) => {
    await page.goto("/contact");
    await page.getByRole("button", { name: "Send message" }).click();
    await expect(page.getByText("Enter your name.")).toBeVisible();
    await expect(page.getByLabel(/^Name/)).toBeFocused();
    await expect(page.getByLabel(/^Name/)).toHaveAttribute("aria-invalid", "true");
  });

  test("prefills the project type from the URL", async ({ page }) => {
    await page.goto("/contact?type=product-development");
    await expect(page.getByRole("combobox", { name: /Project type/ })).toHaveText(
      /Product Development/,
    );
  });

  test("hiring shortcut opens the form set to a full-time role", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /Hiring\? Let's Talk/ }).click();
    await expect(page).toHaveURL(/\/contact\?type=full-time/);
    await expect(page.getByRole("combobox", { name: /Project type/ })).toHaveText(
      /Full-Time Opportunity/,
    );
  });

  test("sends a valid message and shows the success state", async ({ page }) => {
    await page.goto("/contact?type=full-time");
    await page.getByLabel(/^Name/).fill("Test Recruiter");
    await page.getByLabel(/^Email/).fill("recruiter@example.test");
    await page
      .getByLabel(/^Message/)
      .fill("We have a senior frontend role that looks like a great fit.");
    await page.waitForTimeout(3100); // minimum human fill time
    await page.getByRole("button", { name: "Send message" }).click();
    await expect(page.getByRole("heading", { name: "Message sent" })).toBeFocused();
  });
});
