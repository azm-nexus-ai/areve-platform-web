import { expect, test } from "@playwright/test"
import AxeBuilder from "@axe-core/playwright"

test("brand assets bypass regional redirects and load with the intended media types", async ({ request }) => {
  for (const [path, type] of [["/brand/wordmark-charcoal.svg", "image/svg+xml"], ["/brand/pattern-arch.svg", "image/svg+xml"], ["/apple-icon.png", "image/png"]]) {
    const response = await request.get(path, { maxRedirects: 0 })
    expect(response.status()).toBe(200)
    expect(response.headers()["content-type"]).toContain(type)
  }
})

test("home and story are accessible, responsive and have no broken brand imagery", async ({ page }) => {
  for (const path of ["/ng", "/ng/world"]) {
    await page.goto(path)
    await expect(page.locator("main#main-content")).toHaveCount(1)
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1)
    const images = page.locator('img[src^="/brand/"]')
    expect(await images.count()).toBeGreaterThan(2)
    for (const image of await images.all()) {
      await image.scrollIntoViewIfNeeded()
      await expect.poll(() => image.evaluate(element => (element as HTMLImageElement).complete && (element as HTMLImageElement).naturalWidth > 0)).toBe(true)
    }
    await page.evaluate(() => scrollTo(0, 0))
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    const accessibility = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()
    expect(accessibility.violations.map(v => ({ id: v.id, targets: v.nodes.map(n => n.target) }))).toEqual([])
  }
})

test("packaging study responds to keyboard input and respects reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/ng")
  const study = page.getByRole("figure", { name: "Interactive AREVÉ packaging study" })
  const lid = study.getByRole("button", { name: "Lift the lid" })
  await lid.focus()
  await page.keyboard.press("Enter")
  await expect(study.getByRole("button", { name: "Close the box" })).toHaveAttribute("aria-expanded", "true")
  await expect(study.getByText("Walnut. A personal note, revealed.")).toBeVisible()
  const ivory = study.getByRole("button", { name: "View Warm Ivory packaging study" })
  await ivory.click()
  await expect(ivory).toHaveAttribute("aria-pressed", "true")
  const left = study.getByRole("button", { name: "Rotate packaging left" })
  await left.click()
  await left.click()
  await expect(left).toBeDisabled()
  expect(await study.locator('[data-testid="gift-study"] > div:last-child').evaluate(element => getComputedStyle(element).transitionDuration)).toBe("0s")
  await study.getByRole("button", { name: "Close the box" }).click()
  await expect(study.getByRole("button", { name: "Lift the lid" })).toHaveAttribute("aria-expanded", "false")
})

test("menu traps focus, locks scrolling, closes with Escape and navigates to the brand story", async ({ page }) => {
  await page.goto("/ng")
  const trigger = page.getByTestId("nav-menu-button")
  await trigger.click()
  const dialog = page.getByRole("dialog", { name: "Explore AREVÉ" })
  await expect(dialog).toBeVisible()
  expect(await page.locator("html").evaluate(element => getComputedStyle(element).overflow)).toBe("hidden")
  for (let index = 0; index < 22; index++) {
    await page.keyboard.press("Tab")
    expect(await dialog.evaluate(element => element.contains(document.activeElement))).toBe(true)
  }
  const accessibility = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()
  expect(accessibility.violations.map(v => ({ id: v.id, targets: v.nodes.map(n => n.target) }))).toEqual([])
  await page.keyboard.press("Escape")
  await expect(dialog).not.toBeVisible()
  await expect(trigger).toBeFocused()
  await trigger.click()
  await dialog.getByRole("link", { name: "The world of AREVÉ" }).click()
  await expect(page).toHaveURL(/\/ng\/world$/)
  await expect(dialog).not.toBeVisible()
})

test("narrow viewport retains all packaging controls and navigation without overflow", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 740 })
  await page.goto("/ng")
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  await page.getByTestId("nav-menu-button").click()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  await page.keyboard.press("Escape")
  for (const label of ["Rotate packaging left", "Rotate packaging right", "Lift the lid"]) {
    const button = page.getByRole("button", { name: label })
    await button.scrollIntoViewIfNeeded()
    const bounds = await button.boundingBox()
    expect(bounds?.height).toBeGreaterThanOrEqual(44)
    expect(bounds?.x).toBeGreaterThanOrEqual(0)
    expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(320)
  }
})
