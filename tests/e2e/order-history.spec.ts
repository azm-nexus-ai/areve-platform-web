import { readFile } from "node:fs/promises"
import { expect, test } from "@playwright/test"
import AxeBuilder from "@axe-core/playwright"

test.skip(process.env.AREVE_E2E_REVIEW !== "local", "Requires npm run review:history in the isolated API repository")
test("order history reaches older orders and recovers invalid pages", async ({ page }) => {
  const env = Object.fromEntries((await readFile("../areve-platform-api/.env.review", "utf8")).split("\n").filter(line => line.includes("=")).map(line => [line.slice(0, line.indexOf("=")), line.slice(line.indexOf("=") + 1)]))
  expect(env.AREVE_REVIEW_MODE).toBe("local")
  expect(env.MEDUSA_BACKEND_URL).toBe("http://127.0.0.1:59010")
  await page.goto("/ng/account")
  await page.getByTestId("email-input").fill("history@areve.test")
  await page.getByTestId("password-input").fill(`${env.AREVE_REVIEW_ADMIN_PASSWORD}-history`)
  await page.getByTestId("sign-in-button").click()
  await expect(page.getByTestId("account-page")).toContainText("History")
  await page.goto("/ng/account/orders")
  await expect(page.getByTestId("order-card")).toHaveCount(10)
  await page.getByRole("navigation", { name: "Order pages" }).getByRole("button", { name: "Page 2" }).click()
  await expect(page.getByTestId("order-card")).toHaveCount(1)
  await expect(page.getByRole("button", { name: "Page 2" })).toHaveAttribute("aria-current", "page")
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([])
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  await page.goto("/ng/account/orders?page=999")
  await expect(page).toHaveURL(/orders\?page=2$/)
  await expect(page.getByTestId("order-card")).toHaveCount(1)
  await page.goto("/ng/account/orders?page=invalid")
  await expect(page).toHaveURL(/orders\?page=1$/)
  await expect(page.getByTestId("order-card")).toHaveCount(10)
})
