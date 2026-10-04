import { expect, test } from "@playwright/test";

/**
 * Regression budgets on a local production build (not field data).
 * JS budget: ~150 KB is the Next 16 + React 19 framework floor; the rest
 * is this site's client code. Raise it deliberately, never silently.
 */
const BUDGET = { homeJsKB: 200, cls: 0.05, lcpMs: 2000 };

test.describe("performance budgets", () => {
  test.skip(({ browserName }) => browserName !== "chromium", "uses Chromium performance APIs");

  test("home page stays within its JavaScript, CLS and LCP budgets", async ({ page }, info) => {
    test.skip(info.project.name !== "desktop", "measured once, at desktop size");
    await page.goto("/", { waitUntil: "load" });

    const metrics = await page.evaluate(async () => {
      const resources = performance.getEntriesByType("resource") as PerformanceResourceTiming[];
      const jsBytes = resources
        .filter((r) => r.initiatorType === "script")
        .reduce((sum, r) => sum + r.transferSize, 0);

      const observe = <T>(type: string, pick: (entries: PerformanceEntry[]) => T) =>
        new Promise<T>((resolve) => {
          new PerformanceObserver((list) => resolve(pick(list.getEntries()))).observe({
            type,
            buffered: true,
          });
          setTimeout(() => resolve(pick([])), 1000);
        });

      const lcp = await observe("largest-contentful-paint", (e) => e.at(-1)?.startTime ?? 0);
      const cls = await observe("layout-shift", (e) =>
        (e as (PerformanceEntry & { value: number; hadRecentInput: boolean })[])
          .filter((s) => !s.hadRecentInput)
          .reduce((sum, s) => sum + s.value, 0),
      );
      return { jsKB: Math.round(jsBytes / 1024), lcp: Math.round(lcp), cls };
    });

    test.info().annotations.push({ type: "metrics", description: JSON.stringify(metrics) });
    console.log("home metrics", metrics);
    expect(metrics.jsKB).toBeLessThanOrEqual(BUDGET.homeJsKB);
    expect(metrics.cls).toBeLessThan(BUDGET.cls);
    expect(metrics.lcp).toBeLessThan(BUDGET.lcpMs);
  });
});
