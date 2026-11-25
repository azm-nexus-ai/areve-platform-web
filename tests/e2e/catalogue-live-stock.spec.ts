import { readFile } from "node:fs/promises"
import { expect, test } from "@playwright/test"

test.skip(process.env.AREVE_E2E_REVIEW !== "local", "Requires isolated synthetic inventory")

test("stock changes reach product pages and a last-unit race refreshes availability", async ({ page, playwright }) => {
  const env = Object.fromEntries((await readFile("../areve-platform-api/.env.review", "utf8")).split("\n").filter(line => line.includes("=")).map(line => [line.slice(0, line.indexOf("=")), line.slice(line.indexOf("=") + 1)]))
  expect(env.AREVE_REVIEW_MODE).toBe("local"); expect(env.MEDUSA_BACKEND_URL).toBe("http://127.0.0.1:59010")
  const api = await playwright.request.newContext({ baseURL: env.MEDUSA_BACKEND_URL })
  const login = await api.post("/auth/user/emailpass", { data: { email: "owner@areve.test", password: env.AREVE_REVIEW_ADMIN_PASSWORD } })
  expect(login.ok()).toBe(true)
  const headers = { authorization: `Bearer ${(await login.json()).token}` }
  const products = (await (await api.get("/admin/products?handle=review-quiet-vase&fields=id,variants.id,variants.inventory_items.inventory_item_id", { headers })).json()).products
  const id = products[0].variants[0].inventory_items[0].inventory_item_id
  const inventory = (await (await api.get(`/admin/inventory-items/${id}?fields=id,sku,*location_levels`, { headers })).json()).inventory_item
  expect(inventory.sku).toMatch(/^ARV-REV-/)
  expect(inventory.location_levels).toHaveLength(1)
  const level = inventory.location_levels[0], original = Number(level.stocked_quantity), reserved = Number(level.reserved_quantity)
  const setStock = async (quantity: number) => { expect((await api.post(`/admin/inventory-items/${id}/location-levels/${level.location_id}`, { headers, data: { stocked_quantity: quantity } })).ok()).toBe(true) }
  try {
    await setStock(reserved + 2)
    await page.goto(`/ng/products/review-quiet-vase?v_id=${products[0].variants[0].id}`)
    const add = page.getByTestId("add-product-button").first()
    await expect(add).toBeEnabled()
    await setStock(reserved)
    await add.click()
    await expect(page.getByRole("alert").first()).toContainText("Could not add")
    await expect(add).toBeDisabled()
    await expect(add).toContainText("Out of stock")
    await page.reload()
    await expect(add).toBeDisabled()
    await expect(add).toContainText("Out of stock")
    // The canonical product URL must be fresh as well as the variant deep link.
    await page.goto("/ng/products/review-quiet-vase")
    await expect(add).toBeDisabled()
    await expect(add).toContainText("Out of stock")
    await setStock(reserved + 2)
    await page.reload()
    await expect(add).toBeEnabled()
    const current = (await (await api.get(`/admin/inventory-items/${id}?fields=*location_levels`, { headers })).json()).inventory_item
    expect(Number(current.location_levels[0].reserved_quantity)).toBe(reserved)
  } finally { await setStock(original); await api.dispose() }
})
