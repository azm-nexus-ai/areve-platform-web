import AxeBuilder from "@axe-core/playwright"
import { expect, test, type Page } from "@playwright/test"

test.skip(process.env.AREVE_E2E_REVIEW !== "local", "Requires the isolated local review stack")

async function register(page: Page, email: string, password: string) {
  await page.goto("/ng/account")
  await page.getByRole("button", { name: "Join us", exact: true }).click()
  const form = page.getByTestId("register-page")
  await form.getByTestId("first-name-input").fill("Ada")
  await form.getByTestId("last-name-input").fill("Review")
  await form.getByTestId("email-input").fill(email)
  await form.getByTestId("password-input").fill(password)
  await form.getByRole("button", { name: "Join", exact: true }).click()
  await expect(page.getByTestId("account-page")).toContainText("Ada")
}

async function order(page: Page, email: string) {
  await page.goto("/ng/products/review-arc-bowl")
  const add = page.getByTestId("add-product-button").first()
  await expect(add).toBeEnabled()
  await add.click()
  await expect.poll(async () => (await page.context().cookies()).some(c => c.name === "_medusa_cart_id" && c.value)).toBe(true)
  await expect(add).toBeEnabled()
  await page.goto("/ng/cart")
  await page.getByLabel("Your message", { exact: true }).fill("A little warmth for your new home.")
  await page.getByRole("button", { name: "Save message", exact: true }).click()
  await expect(page.getByRole("status").filter({ hasText: "Gift message saved." })).toBeVisible()
  await page.getByTestId("checkout-button").click()
  const fields = {
    "shipping-first-name-input": "Ada", "shipping-last-name-input": "Review",
    "shipping-address-input": "1 Fictional Street",
    "shipping-city-input": "Lagos",
    "shipping-postal-code-input": "100001", "shipping-email-input": email,
    "shipping-phone-input": "08000000000",
  }
  for (const [id, value] of Object.entries(fields)) await page.getByTestId(id).fill(value)
  await page.getByTestId("shipping-country-select").selectOption("ng")
  await page.getByTestId("shipping-province-input").selectOption("Lagos")
  await page.getByTestId("shipping-area-input").selectOption("Ikeja")
  await page.getByTestId("submit-address-button").click()
  await expect(page).toHaveURL(/step=delivery/)
  await page.getByRole("radio").filter({ hasText: "Lagos Mainland" }).click()
  await page.getByTestId("submit-delivery-option-button").click()
  await expect(page).toHaveURL(/step=payment/)
  await page.getByRole("radio", { name: "Simulated payment — review only" }).click()
  await page.getByTestId("submit-payment-button").click()
  await expect(page).toHaveURL(/step=review/)
  await page.getByRole("button", { name: "Place review order", exact: true }).click()
  await expect(page).toHaveURL(/\/order\/order_[^/]+\/confirmed$/, { timeout: 30_000 })
  await expect(page.getByRole("heading", { name: "Your order is confirmed." })).toBeVisible()
  await expect(page.locator("main")).toContainText(email)
  expect((await page.context().cookies()).some(c => c.name === "_medusa_cart_id" && c.value)).toBe(false)
  const result = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()
  expect(result.violations.map(v => ({ id: v.id, targets: v.nodes.map(n => n.target) }))).toEqual([])
  return page.url()
}

async function waitForEmail(page: Page, email: string, subject: string) {
  await page.goto("/ng/review/inbox")
  const message = page.getByTestId("review-email").filter({ hasText: email }).filter({ hasText: subject }).first()
  await expect(async () => {
    await page.reload()
    await expect(message).toBeVisible()
  }).toPass({ timeout: 25_000, intervals: [1000, 2000] })
  return message
}

test("guest checkout persists a real order and private confirmation email", async ({ page, browser, baseURL }) => {
  const email = `guest-${Date.now()}-${test.info().project.name}@areve.test`
  const confirmation = await order(page, email)
  const cookie = (await page.context().cookies()).find(cookie => cookie.name.startsWith("_areve_receipt_"))
  expect(cookie).toMatchObject({ httpOnly: true, sameSite: "Lax", secure: true, path: "/" })
  const stranger = await browser.newContext({ baseURL })
  try {
    const other = await stranger.newPage()
    await other.goto(confirmation)
    await expect(other.getByTestId("order-complete-container")).toHaveCount(0)
    await expect(other.locator("body")).not.toContainText(email)
  } finally { await stranger.close() }
  const message = await waitForEmail(page, email, "is confirmed")
  await message.getByText("Preview email", { exact: true }).click()
  await expect(message.locator("iframe")).toBeVisible()
  await page.goto(confirmation)
  await expect(page.getByRole("heading", { name: "Your order is confirmed." })).toBeVisible()
})

test("account checkout, real reset link, session revocation and fresh sign-in", async ({ page, browser, baseURL }) => {
  const email = `member-${Date.now()}-${test.info().project.name}@areve.test`
  const password = "Synthetic-review-password-123"
  const nextPassword = "Synthetic-review-password-456"
  await register(page, email, password)
  const confirmation = await order(page, email)
  await page.goto("/ng/account/orders")
  await expect(page.getByTestId("order-card").first()).toBeVisible()
  const old = await browser.newContext({ baseURL, storageState: await page.context().storageState() })
  try {
    await page.goto("/ng/forgot-password")
    await page.getByRole("textbox", { name: "Email", exact: true }).fill(email)
    await page.getByRole("button", { name: "Send reset link" }).click()
    await expect(page.getByRole("status")).toContainText("If an account exists")
    const message = await waitForEmail(page, email, "Reset your")
    await message.getByTestId("review-reset-link").click()
    await expect(page.getByLabel(/^New password/)).toBeVisible()
    await expect(page).toHaveURL(/\/ng\/reset-password$/)
    await page.getByLabel(/^New password/).fill(nextPassword)
    await page.getByLabel(/^Confirm password/).fill(nextPassword)
    await page.getByRole("button", { name: "Update password" }).click()
    await expect(page).toHaveURL(/\/ng\/account\?password=updated$/)
    await expect(page.getByRole("status")).toContainText("updated")
    const stale = await old.newPage()
    await stale.goto("/ng/account")
    await expect(stale.getByTestId("login-page")).toBeVisible()
    await stale.goto(confirmation)
    await expect(stale.getByTestId("order-complete-container")).toHaveCount(0)
    await stale.goto("/ng/products/review-quiet-vase")
    await expect(stale.getByRole("heading", { name: "Quiet Form Vase" })).toBeVisible()
    await page.goto("/ng/account")
    await page.getByTestId("email-input").fill(email)
    await page.getByTestId("password-input").fill(nextPassword)
    await page.getByTestId("sign-in-button").click()
    await expect(page.getByTestId("account-page")).toContainText("Ada")
    await page.goto(confirmation)
    await expect(page.getByRole("heading", { name: "Your order is confirmed." })).toBeVisible()
  } finally { await old.close() }
})

test("delivery follows the address and cannot retain a cheaper previous zone", async ({ page }) => {
  await page.goto("/ng/products/review-quiet-vase")
  const add = page.getByTestId("add-product-button").first()
  await expect(add).toBeEnabled()
  await add.click()
  await expect.poll(async () => (await page.context().cookies()).some(cookie => cookie.name === "_medusa_cart_id" && cookie.value)).toBe(true)
  await expect(add).toBeEnabled()
  await page.goto("/ng/checkout")
  for (const [id, value] of Object.entries({ "shipping-first-name-input": "Ada", "shipping-last-name-input": "Review", "shipping-address-input": "1 Fictional Street", "shipping-city-input": "Lagos", "shipping-email-input": "delivery@areve.test", "shipping-phone-input": "08000000000" })) await page.getByTestId(id).fill(value)
  await page.getByTestId("shipping-country-select").selectOption("ng")
  await page.getByTestId("shipping-province-input").selectOption("Lagos")
  await page.getByTestId("shipping-area-input").selectOption("Ikeja")
  await page.getByTestId("submit-address-button").click()
  await expect(page).toHaveURL(/step=delivery/)
  await expect(page.getByTestId("delivery-option-radio")).toHaveCount(1)
  await page.getByRole("radio", { name: /Lagos Mainland/ }).click()
  await page.getByTestId("submit-delivery-option-button").click()
  await expect(page).toHaveURL(/step=payment/)
  await page.goto("/ng/checkout?step=address")
  await page.getByTestId("shipping-province-input").selectOption("FCT")
  await expect(page.getByTestId("shipping-area-input")).toHaveValue("")
  await page.getByTestId("shipping-area-input").fill("Wuse")
  await page.getByTestId("shipping-city-input").fill("Abuja")
  await page.getByTestId("submit-address-button").click()
  await expect(page).toHaveURL(/step=delivery/)
  await expect(page.getByTestId("delivery-option-radio")).toHaveCount(1)
  await expect(page.getByTestId("submit-delivery-option-button")).toBeDisabled()
  await page.goto("/ng/checkout?step=review")
  await expect(page).toHaveURL(/step=delivery/)
  const outside = page.getByRole("radio", { name: /Outside Lagos/ })
  await expect(outside).toContainText("12,000")
  await outside.click()
  await expect(page.getByTestId("submit-delivery-option-button")).toBeEnabled()
  const accessibility = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()
  expect(accessibility.violations.map(violation => ({ id: violation.id, targets: violation.nodes.map(node => node.target) }))).toEqual([])
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
})
