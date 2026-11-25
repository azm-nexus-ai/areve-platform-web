import { defineConfig } from "@playwright/test"

const browser = process.env.E2E_BROWSER || "chromium"
if (!["chromium", "firefox", "webkit"].includes(browser)) throw new Error("Unsupported E2E_BROWSER")
const browserName = browser as "chromium" | "firefox" | "webkit"

const baseURL = process.env.E2E_BASE_URL || "http://localhost:8000"
if (!["localhost", "127.0.0.1"].includes(new URL(baseURL).hostname)) {
  throw new Error("These fixture-creating tests require an isolated local storefront")
}

export default defineConfig({
  testDir: "./tests/e2e",
  outputDir: `./test-results/${browserName}`,
  timeout: 45_000,
  expect: { timeout: 15_000 },
  workers: 1,
  reporter: "list",
  use: {
    browserName,
    baseURL,
    // Optional official patched Firefox binary; see docs/brand-experience.md.
    launchOptions: browserName === "firefox" && process.env.E2E_FIREFOX_EXECUTABLE_PATH
      ? { executablePath: process.env.E2E_FIREFOX_EXECUTABLE_PATH }
      : undefined,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    { name: "desktop", use: { viewport: { width: 1440, height: 1000 } } },
    { name: "mobile", use: { viewport: { width: 375, height: 812 }, isMobile: browserName !== "firefox", hasTouch: browserName !== "firefox" } },
  ],
})
