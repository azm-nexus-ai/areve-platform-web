import { readFile } from "node:fs/promises"
import { expect, test } from "@playwright/test"

test.skip(process.env.AREVE_E2E_REVIEW !== "local", "Requires the isolated local review stack")

test("Owner sees an unpaid dispatch blocker, captures the test payment, packs, ships and delivers", async ({ page, playwright }, info) => {
  test.setTimeout(90_000)
  const parse = (text: string) => Object.fromEntries(text.split("\n").filter(line => line.includes("=")).map(line => [line.slice(0, line.indexOf("=")), line.slice(line.indexOf("=") + 1)]))
  const env = parse(await readFile("../areve-platform-api/.env.review", "utf8")), web = parse(await readFile(".env.review", "utf8"))
  expect(env.AREVE_REVIEW_MODE).toBe("local"); expect(env.MEDUSA_BACKEND_URL).toBe("http://127.0.0.1:59010")
  const base = env.MEDUSA_BACKEND_URL
  const store = await playwright.request.newContext({ baseURL: base, extraHTTPHeaders: { "x-publishable-api-key": web.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY } })
  const post = async (url: string, data: unknown) => { const response = await store.post(url, { data }); expect(response.ok()).toBe(true); return response.json() }
  let orderId: string
  try {
    const region = (await (await store.get("/store/regions")).json()).regions[0]
    const product = (await (await store.get("/store/products?handle=review-towel-set&fields=*variants")).json()).products[0]
    const address = { first_name: "Ada", last_name: "Operations", address_1: "1 Fictional Street", address_2: "Ikeja", city: "Lagos", province: "Lagos", country_code: "ng", phone: "08000000000" }
    const { cart } = await post("/store/carts", { region_id: region.id, email: `operations-${Date.now()}-${info.project.name}@areve.test`, shipping_address: address, billing_address: address })
    await post(`/store/carts/${cart.id}/line-items`, { variant_id: product.variants[0].id, quantity: 1 })
    const options = (await (await store.get(`/store/shipping-options?cart_id=${cart.id}`)).json()).shipping_options
    await post(`/store/carts/${cart.id}/shipping-methods`, { option_id: options.find((option: { name: string }) => option.name === "Lagos Mainland").id })
    const collection = (await post("/store/payment-collections", { cart_id: cart.id })).payment_collection
    await post(`/store/payment-collections/${collection.id}/payment-sessions`, { provider_id: "pp_system_default" })
    const completed = await post(`/store/carts/${cart.id}/complete`, {})
    expect(completed.type).toBe("order"); orderId = completed.order.id
  } finally { await store.dispose() }

  await page.goto(`${base}/app/login`)
  await page.getByPlaceholder("Email", { exact: true }).fill("owner@areve.test")
  await page.getByPlaceholder("Password", { exact: true }).fill(env.AREVE_REVIEW_ADMIN_PASSWORD)
  await page.getByRole("button", { name: "Continue with Email", exact: true }).click()
  await page.waitForURL(url => !url.pathname.includes("login"))
  await page.goto(`${base}/app/orders/${orderId}`)
  await page.getByRole("heading", { name: "Unfulfilled Items", exact: true }).locator("..").getByRole("button").click()
  await page.getByRole("menuitem", { name: "Fulfill items", exact: true }).click()
  const create = page.getByRole("dialog").getByRole("button", { name: "Create Fulfillment", exact: true })
  await expect(create).toBeEnabled()
  await create.click()
  await expect(page.getByText("Capture and reconcile the full order balance before packing or shipping. Refunded or unpaid orders cannot be dispatched.", { exact: true })).toBeVisible()
  await expect(create).toBeEnabled()
  await page.getByRole("dialog").getByRole("button", { name: "Cancel", exact: true }).click()
  await page.getByRole("button", { name: /^(Capture payment|Capture)$/ }).click()
  await page.getByRole("alertdialog").getByRole("button", { name: "Confirm", exact: true }).click()
  await expect(page.getByRole("button", { name: /^(Capture payment|Capture)$/ })).toHaveCount(0)
  await page.getByRole("heading", { name: "Unfulfilled Items", exact: true }).locator("..").getByRole("button").click()
  await page.getByRole("menuitem", { name: "Fulfill items", exact: true }).click()
  await expect(create).toBeEnabled()
  await create.click()
  await expect(page.getByRole("button", { name: "Mark as shipped", exact: true })).toBeVisible()
  await page.getByRole("button", { name: "Mark as shipped", exact: true }).click()
  await page.getByRole("dialog").getByRole("button", { name: "Add tracking number", exact: true }).click()
  await page.getByLabel("Tracking number", { exact: true }).fill(`REVIEW-${info.project.name}`)
  await page.getByLabel("Tracking URL", { exact: true }).fill("https://tracking.areve.test/review")
  await page.getByRole("dialog").getByRole("button", { name: "Save", exact: true }).click()
  await expect(page.getByRole("button", { name: "Mark as delivered", exact: true })).toBeVisible()
  await page.getByRole("button", { name: "Mark as delivered", exact: true }).click()
  const delivered = page.waitForResponse(response => response.url().endsWith("/mark-as-delivered") && response.request().method() === "POST")
  await page.getByRole("alertdialog").getByRole("button", { name: "Continue", exact: true }).click()
  expect((await delivered).ok()).toBe(true)
  await expect(page.getByRole("button", { name: "Mark as delivered", exact: true })).toHaveCount(0)
  const order = (await (await page.request.get(`${base}/admin/orders/${orderId}?fields=+payment_status,+fulfillment_status,*fulfillments`)).json()).order
  expect(order.payment_status).toBe("captured"); expect(order.fulfillment_status).toBe("delivered")
  expect(order.fulfillments).toHaveLength(1)
  await page.screenshot({ path: `../brand-review/order-operations-${info.project.name}.png`, fullPage: true })
})
