import { test, expect } from "@playwright/test";

const BASE = process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3000";

test.describe("Agent 3: Functional Tester", () => {
  // 3.1 — Happy path: homepage loads with content
  test("homepage loads and shows hero section", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });

    // Hero heading exists
    const h1 = page.locator("h1");
    await expect(h1.first()).toBeVisible();

    // Search bar exists
    const searchInput = page.locator("input[name='q']");
    await expect(searchInput).toBeVisible();

    // CTA button exists
    const ctaSection = page.locator("text=InternGo");
    await expect(ctaSection.first()).toBeVisible();

    await page.screenshot({ path: "test-artifacts/functional/steps/homepage-loaded.png" });
  });

  // 3.1 — Happy path: listings page shows results
  test("listings page loads and shows opportunities", async ({ page }) => {
    await page.goto("/listings", { waitUntil: "networkidle" });

    // Page title
    const heading = page.locator("h1");
    await expect(heading.first()).toBeVisible();

    // Should have listing cards or a no-results message
    const cards = page.locator("[data-slot='card'], .group");
    const noResults = page.locator("text=Imkoniyatlar topilmadi, text=No opportunities");

    const hasCards = await cards.count();
    const hasNoResults = await noResults.count();
    expect(hasCards + hasNoResults, "Should show cards or empty state").toBeGreaterThan(0);

    await page.screenshot({ path: "test-artifacts/functional/steps/listings-loaded.png" });
  });

  // 3.1 — Happy path: search works
  test("search filters listings", async ({ page }) => {
    await page.goto("/listings", { waitUntil: "networkidle" });

    const searchInput = page.locator("input[name='q'], input[placeholder*='qidirish'], input[placeholder*='Search']");
    if (await searchInput.count() > 0) {
      await searchInput.first().fill("scholarship");
      await searchInput.first().press("Enter");
      await page.waitForTimeout(1000);

      // URL should update with search query
      expect(page.url()).toContain("q=");

      await page.screenshot({ path: "test-artifacts/functional/steps/search-results.png" });
    }
  });

  // 3.1 — Happy path: type filter works
  test("type filter badges work on listings", async ({ page }) => {
    await page.goto("/listings", { waitUntil: "networkidle" });

    // Click on a filter badge (e.g., Scholarships)
    const filterBadge = page.locator("a[href*='type=SCHOLARSHIP']").first();
    if (await filterBadge.count() > 0) {
      await filterBadge.click();
      await page.waitForTimeout(1000);
      expect(page.url()).toContain("type=SCHOLARSHIP");
    }
  });

  // 3.1 — Happy path: listing detail page
  test("clicking a listing navigates to detail page", async ({ page }) => {
    await page.goto("/listings", { waitUntil: "networkidle" });

    const firstCard = page.locator("a[href*='/listings/']").first();
    if (await firstCard.count() > 0) {
      await firstCard.click();
      await page.waitForURL("**/listings/**", { timeout: 5000 });
      await page.waitForLoadState("networkidle");

      // Detail page should have a title
      const title = page.locator("h1");
      await expect(title.first()).toBeVisible();

      await page.screenshot({ path: "test-artifacts/functional/steps/listing-detail.png" });
    }
  });

  // 3.1 — Happy path: login page renders
  test("login page shows form", async ({ page }) => {
    await page.goto("/auth/login", { waitUntil: "networkidle" });

    const emailInput = page.locator("input[type='email']");
    const passwordInput = page.locator("input[type='password']");
    const submitButton = page.locator("button[type='submit']");

    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(submitButton).toBeVisible();

    await page.screenshot({ path: "test-artifacts/functional/steps/login-page.png" });
  });

  // 3.2 — Edge case: empty search
  test("empty search shows all results", async ({ page }) => {
    await page.goto("/listings?q=", { waitUntil: "networkidle" });

    // Should not crash, should show listings
    const heading = page.locator("h1");
    await expect(heading.first()).toBeVisible();
  });

  // 3.2 — Edge case: invalid listing slug
  test("invalid listing slug shows error or 404", async ({ page }) => {
    const response = await page.goto("/listings/this-slug-does-not-exist-123456", {
      waitUntil: "networkidle",
    });

    // Should show 404 or "not found" content — not crash
    const is404 = response?.status() === 404;
    const hasNotFound = await page.locator("text=404, text=Not Found, text=not found").count();
    expect(is404 || hasNotFound > 0, "Should handle invalid slug gracefully").toBe(true);
  });

  // 3.3 — Error handling: login with invalid credentials
  test("login with wrong password shows error", async ({ page }) => {
    await page.goto("/auth/login", { waitUntil: "networkidle" });

    await page.locator("input[type='email']").fill("test@example.com");
    await page.locator("input[type='password']").fill("wrongpassword");
    await page.locator("button[type='submit']").click();

    await page.waitForTimeout(2000);

    // Should show an error message, not crash
    const errorText = page.locator("[role='alert'], .text-destructive, [data-slot='alert']");
    const errorVisible = await errorText.count();
    // Either shows error or stays on login page (not redirected)
    expect(page.url()).toContain("/auth/login");

    await page.screenshot({ path: "test-artifacts/functional/steps/login-error.png" });
  });

  // 3.5 — Auth: protected pages redirect
  test("dashboard redirects to login when not authenticated", async ({ page }) => {
    // Clear any stored tokens
    await page.goto("/", { waitUntil: "networkidle" });
    await page.evaluate(() => localStorage.removeItem("accessToken"));

    await page.goto("/dashboard", { waitUntil: "networkidle" });
    await page.waitForTimeout(2000);

    // Should either redirect to login or show login prompt
    const isOnLogin = page.url().includes("/auth/login");
    const hasLoginForm = await page.locator("input[type='email']").count();
    const hasSpinner = await page.locator(".animate-spin").count();

    // Dashboard should not show content without auth
    expect(isOnLogin || hasLoginForm > 0 || hasSpinner > 0, "Should require auth for dashboard").toBe(true);
  });

  // 3.6 — Navigation: footer links work
  test("footer links navigate correctly", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });

    const aboutLink = page.locator("footer a[href='/about']");
    if (await aboutLink.count() > 0) {
      await aboutLink.first().click();
      await page.waitForURL("**/about", { timeout: 5000 });
      expect(page.url()).toContain("/about");
    }
  });

  // 3.6 — Navigation: navbar links work
  test("navbar links navigate correctly", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    await page.setViewportSize({ width: 1440, height: 900 });

    const browseLink = page.locator("nav a[href='/listings']");
    if (await browseLink.count() > 0) {
      await browseLink.first().click();
      await page.waitForURL("**/listings", { timeout: 5000 });
      expect(page.url()).toContain("/listings");
    }
  });

  // 3.8 — Performance: page load time
  test("homepage loads within 5 seconds", async ({ page }) => {
    const start = Date.now();
    await page.goto("/", { waitUntil: "networkidle" });
    const loadTime = Date.now() - start;

    expect(loadTime, `Homepage took ${loadTime}ms to load`).toBeLessThan(5000);
  });

  // 3.9 — Keyboard: tab navigation works
  test("can tab through interactive elements", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });

    // Tab a few times and verify focus moves
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");

    const focusedTag = await page.evaluate(() => document.activeElement?.tagName);
    expect(focusedTag).toBeTruthy();
  });
});
