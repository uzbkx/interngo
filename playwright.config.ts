import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 1,
  workers: 3,
  reporter: [["html", { open: "never" }], ["list"]],
  timeout: 30000,
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "on-first-retry",
  },
  projects: [
    {
      name: "agent-1-visual",
      testMatch: /agent-1/,
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "agent-2-code-review",
      testMatch: /agent-2/,
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "agent-3-functional",
      testMatch: /agent-3/,
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
