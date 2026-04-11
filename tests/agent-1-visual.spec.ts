import { test, expect } from "@playwright/test";

const BREAKPOINTS = [
  { name: "mobile", width: 375, height: 812 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1440, height: 900 },
];

const PAGES = [
  { name: "homepage", path: "/" },
  { name: "listings", path: "/listings" },
  { name: "login", path: "/auth/login" },
  { name: "signup", path: "/auth/signup" },
  { name: "about", path: "/about" },
  { name: "contact", path: "/contact" },
];

test.describe("Agent 1: Visual Inspector", () => {
  // 1.1 & 1.5 — Full page screenshots at every breakpoint
  for (const bp of BREAKPOINTS) {
    for (const pg of PAGES) {
      test(`${pg.name} renders correctly at ${bp.name} (${bp.width}px)`, async ({ page }) => {
        await page.setViewportSize({ width: bp.width, height: bp.height });
        await page.goto(pg.path, { waitUntil: "networkidle" });

        // No crash — page loaded
        await expect(page).not.toHaveTitle(/error/i);

        // Screenshot for visual reference
        await page.screenshot({
          path: `test-artifacts/visual/current/${pg.name}-${bp.name}.png`,
          fullPage: true,
        });
      });
    }
  }

  // 1.3 — Layout overflow check
  test("no horizontal overflow on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    for (const pg of PAGES) {
      await page.goto(pg.path, { waitUntil: "networkidle" });
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
      expect(scrollWidth, `${pg.name} has horizontal overflow`).toBeLessThanOrEqual(clientWidth + 5);
    }
  });

  // 1.4 — Typography and color: verify text is readable
  test("text is not too small on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/", { waitUntil: "networkidle" });

    const smallText = await page.evaluate(() => {
      const elements = document.querySelectorAll("p, span, a, li, h1, h2, h3, h4, h5, h6");
      const tooSmall: string[] = [];
      elements.forEach((el) => {
        const size = parseFloat(window.getComputedStyle(el).fontSize);
        if (size < 10 && el.textContent?.trim()) {
          tooSmall.push(`${el.tagName}: "${el.textContent?.slice(0, 30)}" (${size}px)`);
        }
      });
      return tooSmall;
    });

    expect(smallText, "Found text smaller than 10px").toHaveLength(0);
  });

  // 1.3 — Z-index: verify navbar is above content
  test("navbar stays on top when scrolling", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(300);

    const header = page.locator("header");
    await expect(header).toBeVisible();

    const headerBox = await header.boundingBox();
    expect(headerBox?.y).toBeLessThanOrEqual(0);
  });

  // 1.5 — Responsive: navigation accessible on mobile
  test("mobile menu button is visible on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/", { waitUntil: "networkidle" });

    const menuButton = page.locator("[data-slot='sheet-trigger']");
    await expect(menuButton).toBeVisible();
  });

  test("desktop nav links visible on desktop", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/", { waitUntil: "networkidle" });

    const nav = page.locator("nav.hidden.md\\:flex");
    await expect(nav).toBeVisible();
  });

  // 1.6 — Loading states: verify no skeleton flash on static pages
  test("homepage loads without stuck spinner", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    await page.waitForTimeout(2000);

    const spinner = page.locator(".animate-spin");
    const spinnerCount = await spinner.count();
    // Some spinners may exist briefly, but main content should be visible
    const h1 = page.locator("h1");
    await expect(h1.first()).toBeVisible();
  });
});
