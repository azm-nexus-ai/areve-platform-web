import { expect, test } from "@playwright/test"
import AxeBuilder from "@axe-core/playwright"

test("catalogue search is accessible, keeps the first request and fits the viewport", async ({ page }) => {
  const response = await page.goto("/ng/store")
  expect(response?.request().redirectedFrom()).toBeNull()
  await expect(page.getByTestId("products-list")).toBeVisible()
  expect((await page.context().cookies()).some(cookie => cookie.name === "_medusa_cache_id")).toBe(true)
  await page.getByLabel("Search the catalogue").fill("Sample Gift Box")
  await page.locator("main").getByRole("button", { name: "Search", exact: true }).click()
  await expect(page.getByRole("status").filter({ hasText: "Showing 1–1 of 1 products" })).toBeVisible()
  await expect(page.locator("main")).toHaveCount(1)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  const accessibility = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()
  expect(accessibility.violations.map(v => ({ id: v.id, targets: v.nodes.map(n => n.target) }))).toEqual([])
  await page.screenshot({ path: `test-results/storefront-${test.info().project.name}.png`, fullPage: true })
})

test("search dialog exposes all results and returns focus when closed", async ({ page }) => {
  await page.goto("/ng/store")
  const trigger = page.getByRole("button", { name: "Search", exact: true }).first()
  await trigger.click()
  const dialog = page.getByRole("dialog")
  await expect(dialog).toBeVisible()
  await dialog.getByLabel("Search products", { exact: true }).fill("Sample")
  await dialog.getByRole("button", { name: "Search", exact: true }).click()
  await expect(dialog.getByRole("link", { name: "View all results" })).toBeVisible()
  await page.keyboard.press("Escape")
  await expect(dialog).not.toBeVisible()
  await expect(trigger).toBeFocused()
})

test("catalogue reaches records beyond 100 and clamps invalid or stale page numbers", async ({ page }) => {
  test.skip(process.env.E2E_LARGE_CATALOGUE !== "1", "Requires the guarded 105-product local catalogue fixture")
  await page.goto("/ng/store?q=Browser+Catalogue+Fixture&sortBy=title&page=9")
  await expect(page.getByRole("status").filter({ hasText: "Showing 97–105 of 105 products" })).toBeVisible()
  await expect(page.getByTestId("products-list").getByTestId("product-title")).toHaveCount(9)
  await expect(page.getByTestId("product-title").filter({ hasText: "Browser Catalogue Fixture 105" })).toBeVisible()
  await page.getByRole("button", { name: "Page 1", exact: true }).click()
  await expect(page.getByRole("status").filter({ hasText: "Showing 1–12 of 105 products" })).toBeVisible()
  await page.goto("/ng/store?q=Browser+Catalogue+Fixture&sortBy=title&page=999")
  await expect(page.getByRole("status").filter({ hasText: "Showing 97–105 of 105 products" })).toBeVisible()
  await page.goto("/ng/store?q=Browser+Catalogue+Fixture&page=not-a-page")
  await expect(page.getByRole("status").filter({ hasText: "Showing 1–12 of 105 products" })).toBeVisible()
})

test("serves optimized product imagery with the patched image processor", async ({ request }) => {
  const image = await request.get("/_next/image?url=%2Fareve-logo.png&w=384&q=75")
  expect(image.status()).toBe(200)
  expect(image.headers()["content-type"]).toMatch(/^image\//)
  expect((await image.body()).byteLength).toBeGreaterThan(100)
})
