import AxeBuilder from "@axe-core/playwright"
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
  await page.goto("/ng/products/sample-gift-box")
  const accessible = async (label: string) => {
    await page.evaluate(() => document.fonts.ready)
    const result = await new AxeBuilder({ page }).analyze()
    expect.soft(result.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => ({ target: n.target, html: n.html, summary: n.failureSummary })) })), label).toEqual([])
  }
  await accessible("product")
  await addFixtureProduct(page)
  await page.goto("/ng/cart")
  await expect(page.getByRole("heading", { name: "Your cart", exact: true })).toBeVisible()
  await page.getByLabel("Your message", { exact: true }).fill("Happy birthday from the browser fixture")
  await page.getByRole("button", { name: "Save message", exact: true }).click()
  await expect(page.getByRole("status").filter({ hasText: "Gift message saved." })).toBeVisible()
  await page.reload()
  await expect(page.getByLabel("Your message", { exact: true })).toHaveValue("Happy birthday from the browser fixture")
  await accessible("cart")
  await page.getByTestId("checkout-button").click()
  await expect(page).toHaveURL(/step=address/)
  await accessible("checkout address")
  const fields: Record<string, string> = {
    "shipping-first-name-input": "Ada", "shipping-last-name-input": "Fixture",
    "shipping-address-input": "1 Test Street",
    "shipping-city-input": "Lagos",
    "shipping-postal-code-input": "100001", "shipping-email-input": "browser-fixture@areve.test",
    "shipping-phone-input": "08000000000",
  }
  for (const [id, value] of Object.entries(fields)) await page.getByTestId(id).fill(value)
  await page.getByTestId("shipping-country-select").selectOption("ng")
  await page.getByTestId("shipping-province-input").selectOption("Lagos")
  await page.getByTestId("shipping-area-input").selectOption("Ikeja")
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
  await accessible("checkout payment")
})

test("cross-site payment return retains the real cart cookie", async ({ page, context }) => {
  await addFixtureProduct(page)
  const cart = (await context.cookies()).find((cookie) => cookie.name === "_medusa_cart_id")!
  expect(cart).toMatchObject({ sameSite: "Lax", httpOnly: true, path: "/" })
  // 127.0.0.1 and localhost are different sites. This simulates a hosted payment
  // return without visiting Paystack or making any real payment request.
  const origin = new URL(page.url()).origin
  const otherHost = new URL(origin).hostname === "127.0.0.1" ? "localhost" : "127.0.0.1"
  const otherOrigin = `http://${otherHost}:8010`
  await page.route(`${otherOrigin}/**`, (route) => route.fulfill({ contentType: "text/html; charset=utf-8", body: `<a href="${origin}/ng/checkout/paystack/callback?reference=fixture_unpaid">Return to AREVÉ</a>` }))
  await page.goto(`${otherOrigin}/payment-fixture`)
  const callback = page.waitForResponse((response) => response.url().includes("/checkout/paystack/callback"))
  await page.getByRole("link", { name: "Return to AREVÉ" }).click()
  // Verify the server used the cookie; WebKit omits it from request inspection.
  const returned = await callback
  expect(returned.status()).toBe(303)
  expect(returned.headers().location).toContain("payment=not_confirmed")
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


test("cart quantities update and failed removals remain retryable", async ({ page }) => {
  await addFixtureProduct(page)
  await page.goto("/ng/cart")
  const quantity = page.getByRole("combobox", { name: /^Quantity for / })
  // The cart payload omits exact stock. The server must still reject a quantity
  // above the fixture's stock and leave the persisted cart unchanged.
  await quantity.selectOption("99")
  await expect(page.getByTestId("product-error-message")).toBeVisible()
  await expect(quantity).toBeEnabled()
  await page.reload()
  await expect(quantity).toHaveValue("1")
  await quantity.selectOption("2")
  await expect(quantity).toBeEnabled()
  await page.reload()
  await expect(quantity).toHaveValue("2")
  const remove = page.getByTestId("product-delete-button")
  await page.route("**/ng/cart", route => route.request().method() === "POST" ? route.abort("failed") : route.continue())
  await remove.click()
  await expect(page.locator("main").getByRole("alert")).toContainText("Unable to remove")
  await expect(remove).toBeEnabled()
  await page.unroute("**/ng/cart")
  await remove.click()
  await expect(page.getByTestId("product-row")).toHaveCount(0)
})
