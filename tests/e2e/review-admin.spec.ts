import { readFile } from "node:fs/promises"
import { expect, test } from "@playwright/test"

test.skip(process.env.AREVE_E2E_REVIEW !== "local", "Requires the isolated local review stack")

test("Owner session survives navigation and saved coverage survives a reload", async ({ page }, info) => {
  test.skip(info.project.name !== "desktop", "Staff console verification uses its desktop layout")
  const env = Object.fromEntries((await readFile("../areve-platform-api/.env.review", "utf8")).split("\n").filter(line => line.includes("=")).map(line => [line.slice(0, line.indexOf("=")), line.slice(line.indexOf("=") + 1)]))
  expect(env.AREVE_REVIEW_MODE).toBe("local")
  expect(env.MEDUSA_BACKEND_URL).toBe("http://127.0.0.1:59010")
  await page.goto(`${env.MEDUSA_BACKEND_URL}/app/login`)
  await page.getByPlaceholder("Email", { exact: true }).fill("owner@areve.test")
  await page.getByPlaceholder("Password", { exact: true }).fill(env.AREVE_REVIEW_ADMIN_PASSWORD)
  await page.getByRole("button", { name: "Continue with Email", exact: true }).click()
  await page.waitForURL(url => !url.pathname.includes("login"))
  await page.goto(`${env.MEDUSA_BACKEND_URL}/app/settings/store`)
  await expect(page.getByRole("heading", { name: "Delivery coverage", exact: true })).toBeVisible()
  await expect(page.locator("#coverage-lagos-mainland")).toHaveValue("Ikeja\nYaba")
  await expect(page.getByRole("checkbox", { name: /Test coverage only/ })).toBeChecked()
  await page.getByRole("button", { name: "Save coverage", exact: true }).click()
  await expect(page.getByText("Coverage saved. New delivery quotes and order completion use it immediately.")).toBeVisible()
  await page.reload()
  await expect(page.locator("#coverage-lagos-mainland")).toHaveValue("Ikeja\nYaba")
  await page.screenshot({ path: "../brand-review/delivery-admin.png", fullPage: true })
})
