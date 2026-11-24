import { expect, test, type Page } from "@playwright/test"

async function addFixtureProduct(page: Page) {
  await page.goto("/ng/products/sample-gift-box")
  const add = page.getByTestId("add-product-button").first()
  await expect(add).toBeEnabled()
  await add.click()
  await expect.poll(async () => (await page.context().cookies()).find((cookie) => cookie.name === "_medusa_cart_id")?.value).toBeTruthy()
  await expect(add).toBeEnabled()
}

test("product → cart → gift message → address → flat-fee delivery", async ({ page }) => {
  await addFixtureProduct(page)
  await page.goto("/ng/cart")
  await expect(page.getByRole("heading", { name: "Your cart", exact: true })).toBeVisible()
  await page.getByLabel("Your message", { exact: true }).fill("Happy birthday from the browser fixture")
  await page.getByRole("button", { name: "Save message", exact: true }).click()
  await expect(page.getByRole("status").filter({ hasText: "Gift message saved." })).toBeVisible()
  await page.reload()
  await expect(page.getByLabel("Your message", { exact: true })).toHaveValue("Happy birthday from the browser fixture")
  await page.getByTestId("checkout-button").click()
  await expect(page).toHaveURL(/step=address/)
  const fields: Record<string, string> = {
    "shipping-first-name-input": "Ada", "shipping-last-name-input": "Fixture",
    "shipping-address-input": "1 Test Street", "shipping-area-input": "Ikeja",
    "shipping-city-input": "Lagos", "shipping-province-input": "Lagos",
    "shipping-postal-code-input": "100001", "shipping-email-input": "browser-fixture@areve.test",
    "shipping-phone-input": "08000000000",
  }
  for (const [id, value] of Object.entries(fields)) await page.getByTestId(id).fill(value)
  await page.getByTestId("shipping-country-select").selectOption("ng")
  await page.getByTestId("submit-address-button").click()
  await expect(page).toHaveURL(/step=delivery/)
  const mainland = page.getByRole("radio").filter({ hasText: "Lagos Mainland" })
  await expect(mainland).toBeVisible()
  await expect(mainland).toBeEnabled()
  await mainland.click()
  await expect(page.getByTestId("submit-delivery-option-button")).toBeEnabled()
  await page.getByTestId("submit-delivery-option-button").click()
  await expect(page).toHaveURL(/step=payment/)
  await expect(page.locator("main")).toHaveCount(1)
})

test("cross-site payment return retains the real cart cookie", async ({ page, context }) => {
  await addFixtureProduct(page)
  const cart = (await context.cookies()).find((cookie) => cookie.name === "_medusa_cart_id")!
  expect(cart).toMatchObject({ sameSite: "Lax", httpOnly: true, path: "/" })
  // 127.0.0.1 and localhost are different sites. This simulates a hosted payment
  // return without visiting Paystack or making any real payment request.
  const origin = new URL(page.url()).origin
  await page.route("http://127.0.0.1:8010/**", (route) => route.fulfill({ contentType: "text/html; charset=utf-8", body: `<a href="${origin}/ng/checkout/paystack/callback?reference=fixture_unpaid">Return to AREVÉ</a>` }))
  await page.goto("http://127.0.0.1:8010/payment-fixture")
  const callback = page.waitForRequest((request) => request.url().includes("/checkout/paystack/callback"))
  await page.getByRole("link", { name: "Return to AREVÉ" }).click()
  const headers = await (await callback).allHeaders()
  expect(headers.cookie).toContain(`_medusa_cart_id=${cart.value}`)
  await expect(page).toHaveURL(/\/ng\/checkout\?step=address/)
  expect((await context.cookies()).find((cookie) => cookie.name === "_medusa_cart_id")?.value).toBe(cart.value)
})

test("expired or repeated payment returns recover without a server error", async ({ page }) => {
  await page.goto("/ng/checkout/paystack/callback?reference=fixture_completed")
  await expect(page).toHaveURL(/\/ng\/cart\?payment=session_missing/)
  await expect(page.getByRole("status")).toContainText("check your order confirmation email")
  await page.reload()
  await expect(page.getByRole("heading", { name: "Your cart", exact: true })).toBeVisible()
})

test("invalid and skipped checkout steps return to the next required step", async ({ page }) => {
  await addFixtureProduct(page)
  for (const step of ["review", "unknown"]) {
    await page.goto(`/ng/checkout?step=${step}`)
    await expect(page).toHaveURL(/step=address/)
    await expect(page.getByTestId("shipping-email-input")).toBeVisible()
  }
})
