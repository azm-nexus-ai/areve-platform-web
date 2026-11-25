import { readFile } from "node:fs/promises"
import { expect, test, type Page } from "@playwright/test"
import AxeBuilder from "@axe-core/playwright"

test.skip(process.env.AREVE_E2E_REVIEW !== "local", "Requires the isolated review admin build; all payment operations are intercepted")
async function login(page: Page) {
  const env = Object.fromEntries((await readFile("../areve-platform-api/.env.review", "utf8")).split("\n").filter(line => line.includes("=")).map(line => [line.slice(0, line.indexOf("=")), line.slice(line.indexOf("=") + 1)]))
  expect(env.AREVE_REVIEW_MODE).toBe("local")
  expect(env.MEDUSA_BACKEND_URL).toBe("http://127.0.0.1:59010")
  await page.goto(`${env.MEDUSA_BACKEND_URL}/app/login`)
  await page.getByPlaceholder("Email", { exact: true }).fill("owner@areve.test")
  await page.getByPlaceholder("Password", { exact: true }).fill(env.AREVE_REVIEW_ADMIN_PASSWORD)
  await page.getByRole("button", { name: "Continue with Email", exact: true }).click()
  await page.waitForURL(url => !url.pathname.includes("login"))
  return env.MEDUSA_BACKEND_URL
}
const fixture = { configured: true, can_approve: true, actor_id: "user_synthetic", limit: 25, attempts_count: 1, refunds_count: 0, target: null, refunds: [], attempts: [{ id: "arpa_synthetic", reference: "arv_synthetic_reference", amount_kobo: 100000, state: "paid", payment_id: "pay_synthetic", order_id: "order_synthetic", attention: null, checked_at: "2026-11-25T00:00:00Z" }] }

test("Owner approval preserves its identity after an interrupted response and a page reload", async ({ page }, info) => {
  const base = await login(page)
  const requests: Record<string, unknown>[] = []
  await page.route(`${base}/admin/areve/payments**`, async route => {
    if (route.request().method() === "GET") return route.fulfill({ json: fixture })
    if (new URL(route.request().url()).pathname !== "/admin/areve/payments/refunds") throw new Error("Unexpected synthetic payment operation")
    requests.push(route.request().postDataJSON())
    if (requests.length === 1) return route.fulfill({ status: 503, json: { message: "Synthetic interrupted response" } })
    if (requests.length === 3) return route.fulfill({ status: 400, json: { message: "Refund exceeds the unreserved payment balance", approval_not_created: true } })
    return route.fulfill({ status: 202, json: { refund: { state: "pending", accounting_state: "waiting", attention: null } } })
  })
  await page.goto(`${base}/app/payment-review`)
  await expect(page.getByRole("heading", { name: "Payment review", exact: true })).toBeVisible()
  await page.getByRole("button", { name: "Review refund", exact: true }).click()
  await page.getByLabel("Refund amount (NGN)", { exact: true }).fill("250.50")
  await page.getByLabel("Approval reason", { exact: true }).fill("Synthetic reviewed return")
  await page.getByRole("checkbox").check()
  await page.getByRole("button", { name: "Approve refund", exact: true }).click()
  await expect(page.getByRole("alert")).toContainText("same approval reference is retained")
  await page.reload()
  await expect(page.getByLabel("Refund amount (NGN)", { exact: true })).toHaveValue("250.50")
  await expect(page.getByLabel("Refund amount (NGN)", { exact: true })).toHaveAttribute("readonly", "")
  await page.getByLabel("Approval reason", { exact: true }).fill("Synthetic reviewed return")
  await page.getByRole("checkbox").check()
  await page.getByRole("button", { name: "Retry same approval", exact: true }).click()
  await expect(page.getByRole("status").filter({ hasText: "Refund recorded" })).toContainText("pending")
  expect(requests).toHaveLength(2)
  expect(requests[0]).toEqual(requests[1])
  expect(requests[0].amount_kobo).toBe(25050)
  await expect(page.locator('[data-testid="payment-review"] :user-invalid')).toHaveCount(0)
  await page.getByRole("button", { name: "Review refund", exact: true }).click()
  await page.getByLabel("Refund amount (NGN)", { exact: true }).fill("99999")
  await page.getByLabel("Approval reason", { exact: true }).fill("Synthetic rejected amount")
  await page.getByRole("checkbox").check()
  await page.getByRole("button", { name: "Approve refund", exact: true }).click()
  await expect(page.getByRole("alert")).toContainText("No approval was created")
  await expect(page.getByLabel("Refund amount (NGN)", { exact: true })).not.toHaveAttribute("readonly", "")
  await page.getByLabel("Refund amount (NGN)", { exact: true }).fill("100")
  const violations = (await new AxeBuilder({ page }).include('[data-testid="payment-review"]').analyze()).violations
  expect(violations).toEqual([])
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
  await page.screenshot({ path: `../brand-review/payment-review-${info.project.name}.png`, fullPage: true })
})

test("Finance sees provider truth with no money-changing controls", async ({ page }) => {
  const base = await login(page)
  await page.route(`${base}/admin/areve/payments**`, async route => {
    expect(route.request().method()).toBe("GET")
    return route.fulfill({ json: { ...fixture, can_approve: false, refunds_count: 1, refunds: [{ id: "arfi_synthetic", reference: "arfr_synthetic", transaction_reference: "arv_synthetic_reference", amount_kobo: 25050, state: "processed", accounting_state: "complete", order_id: "order_synthetic", reason: "Synthetic return", attention: null }] } })
  })
  await page.goto(`${base}/app/payment-review`)
  await expect(page.getByText("Finance access is read-only.", { exact: false })).toBeVisible()
  await expect(page.getByRole("button", { name: /approve|check .* status|review refund/i })).toHaveCount(0)
  await expect(page.getByText("This does not confirm arrival in the customer’s bank account.", { exact: false })).toBeVisible()
})

test("Owner resolves a failed reservation and imports a dashboard refund with safe retry", async ({ page }) => {
  const base = await login(page)
  let released = false
  let imported = false
  const imports: Record<string, unknown>[] = []
  await page.route(`${base}/admin/areve/payments**`, async route => {
    const path = new URL(route.request().url()).pathname
    if (route.request().method() === "GET") return route.fulfill({ json: { ...fixture, refunds_count: imported ? 2 : 1, refunds: [
      { id: "arfi_failed", reference: "arfr_failed", provider_id: "900", source: "console", transaction_reference: "arv_synthetic_reference", amount_kobo: 25050, state: "failed", accounting_state: "waiting", reason: "Synthetic failed refund", reservation_released_at: released ? "2026-11-25T00:00:00Z" : null, release_reason: released ? "Verified provider failure" : null },
      ...(imported ? [{ id: "arfi_imported", reference: "arfr_external_test_989", provider_id: "989", source: "external", transaction_reference: "arv_synthetic_reference", amount_kobo: 25050, state: "processed", accounting_state: "complete", reason: "Reviewed existing refund" }] : []),
    ] } })
    if (path === "/admin/areve/payments/refunds/arfi_failed/release") {
      expect(route.request().postDataJSON()).toEqual({ confirm: true, reason: "Verified provider failure" })
      released = true
      return route.fulfill({ json: { refund: { id: "arfi_failed", reservation_released_at: "2026-11-25T00:00:00Z" } } })
    }
    expect(path).toBe("/admin/areve/payments/refunds/import")
    imports.push(route.request().postDataJSON()); imported = true
    if (imports.length === 1) return route.fulfill({ status: 503, json: { message: "Synthetic response loss" } })
    return route.fulfill({ json: { refund: { id: "arfi_imported", state: "processed", accounting_state: "complete" } } })
  })
  await page.goto(`${base}/app/payment-review`)
  await page.getByText("Resolve a verified failed refund", { exact: true }).click()
  await page.getByLabel("Failure resolution reason").fill("Verified provider failure")
  await page.getByRole("checkbox", { name: "I have reviewed the failed refund", exact: false }).check()
  await page.getByRole("button", { name: "Verify failure and release reservation", exact: true }).click()
  await expect(page.getByRole("status")).toContainText("No replacement was created")
  await expect(page.getByText("Reservation released after verified failure:", { exact: false })).toBeVisible()
  await page.getByText("Reconcile an existing Paystack refund", { exact: true }).click()
  await page.locator("#import-payment").fill("pay_synthetic")
  await page.getByLabel("Paystack refund ID", { exact: true }).fill("989")
  await page.getByLabel("Reconciliation reason", { exact: true }).fill("Reviewed existing refund")
  await page.getByRole("checkbox", { name: "I have reviewed the existing refund", exact: false }).check()
  await page.getByRole("button", { name: "Import existing refund", exact: true }).click()
  await expect(page.getByRole("alert")).toContainText("same provider refund ID")
  await page.getByRole("button", { name: "Import existing refund", exact: true }).click()
  await expect(page.getByRole("status")).toContainText("No additional money was moved")
  expect(imports).toHaveLength(2)
  expect(imports[0]).toEqual(imports[1])
  await expect(page.getByText("Source: Existing Paystack refund", { exact: false })).toBeVisible()
  expect((await new AxeBuilder({ page }).include('[data-testid="payment-review"]').analyze()).violations).toEqual([])
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
})
