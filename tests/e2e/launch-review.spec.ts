import { readFile } from "node:fs/promises"
import { expect, test, type Page } from "@playwright/test"
import AxeBuilder from "@axe-core/playwright"

test.skip(process.env.AREVE_E2E_REVIEW !== "local", "Requires the isolated local review environment")
async function login(page: Page) {
  const env = Object.fromEntries((await readFile("../areve-platform-api/.env.review", "utf8")).split("\n").filter(line => line.includes("=")).map(line => [line.slice(0, line.indexOf("=")), line.slice(line.indexOf("=") + 1)]))
  expect(env.AREVE_REVIEW_MODE).toBe("local"); expect(env.MEDUSA_BACKEND_URL).toBe("http://127.0.0.1:59010")
  await page.goto(`${env.MEDUSA_BACKEND_URL}/app/login`)
  await page.getByPlaceholder("Email", { exact: true }).fill("owner@areve.test")
  await page.getByPlaceholder("Password", { exact: true }).fill(env.AREVE_REVIEW_ADMIN_PASSWORD)
  await page.getByRole("button", { name: "Continue with Email", exact: true }).click()
  await page.waitForURL(url => !url.pathname.includes("login"))
  return env.MEDUSA_BACKEND_URL
}
test("Owner policy editing preserves conflicting text and publishes only a saved confirmed version", async ({ page }, info) => {
  const base = await login(page)
  const body = "Synthetic policy used to exercise the editor. This is a test document, not a policy for live orders."
  let record = { kind: "delivery", revision: 2, draft_body: body, draft_review_only: true, published_body: body, published_revision: 2, published_review_only: true }
  let conflict = true
  await page.route(`${base}/admin/areve/launch**`, route => {
    if (route.request().method() === "GET") return route.fulfill({ json: { environment: "staging", ready: false, checks: [{ key: "release", label: "Owner live-checkout release", ready: false }], control: { revision: 0, checkout_enabled: false, tax_reviewed: false, tax_note: "", operations_reviewed: false, operations_note: "" }, documents: [record] } })
    expect(new URL(route.request().url()).pathname).toBe("/admin/areve/launch/policies/delivery")
    const input = route.request().postDataJSON()
    if (conflict) { conflict = false; return route.fulfill({ status: 409, json: { message: "This content changed in another session." } }) }
    expect(input.expected_revision).toBe(record.revision)
    if (input.action === "draft") record = { ...record, revision: record.revision + 1, draft_body: input.body }
    else { expect(input.confirm).toBe(true); record = { ...record, revision: record.revision + 1, published_revision: record.revision + 1, published_body: record.draft_body } }
    return route.fulfill({ json: { document: record } })
  })
  await page.goto(`${base}/app/launch-review`)
  const editor = page.getByTestId("policy-editor-delivery")
  await editor.getByLabel("Approved policy text", { exact: true }).fill(`${body}\n\nReviewed second paragraph.`)
  await expect(editor.getByRole("button", { name: "Publish policy", exact: true })).toBeDisabled()
  await editor.getByRole("button", { name: "Save draft", exact: true }).click()
  await expect(editor.getByRole("alert")).toContainText("Your text is retained")
  await expect(editor.getByLabel("Approved policy text", { exact: true })).toHaveValue(`${body}\n\nReviewed second paragraph.`)
  await editor.getByRole("button", { name: "Save draft", exact: true }).click()
  await expect(editor.getByRole("status")).toContainText("Draft saved")
  await editor.getByRole("checkbox", { name: "I have reviewed this saved version", exact: false }).check()
  await editor.getByRole("button", { name: "Publish policy", exact: true }).click()
  await expect(editor.getByRole("status")).toContainText("Policy published")
  await editor.getByText("Read the published version", { exact: true }).click()
  await expect(editor.getByText("Reviewed second paragraph.", { exact: false }).last()).toBeVisible()
  expect((await new AxeBuilder({ page }).include('[data-testid="launch-review"]').analyze()).violations).toEqual([])
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
  await page.screenshot({ path: `../brand-review/launch-review-${info.project.name}.png`, fullPage: true })
})

test("published review policies are readable, marked as test copy and accessible", async ({ page }, info) => {
  for (const kind of ["delivery", "returns", "privacy", "terms"]) {
    await page.goto(`/ng/${kind}`)
    await expect(page.getByTestId("policy-body")).toBeVisible()
    await expect(page.getByText("Review copy for testing.", { exact: false })).toBeVisible()
    await expect(page.getByRole("navigation", { name: "Customer information" }).locator('[aria-current="page"]')).toHaveText(kind[0].toUpperCase() + kind.slice(1))
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([])
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
  }
  await page.screenshot({ path: `../brand-review/policy-${info.project.name}.png`, fullPage: true })
})
