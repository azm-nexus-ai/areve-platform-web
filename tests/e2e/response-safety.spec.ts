import { expect, test } from "@playwright/test"

test("staging responses protect sensitive routes and stay out of search indexes", async ({ request }) => {
  for (const path of ["/ng/store", "/ng/cart", "/ng/reset-password"]) {
    const response = await request.get(path)
    expect(response.status()).toBe(200)
    const headers = response.headers()
    expect(headers["x-content-type-options"]).toBe("nosniff")
    expect(headers["x-frame-options"]).toBe("DENY")
    expect(headers["content-security-policy"]).toContain("frame-ancestors 'none'")
    expect(headers["referrer-policy"]).toBe("no-referrer")
    expect(headers["x-robots-tag"]).toContain("noindex")
    expect(headers["x-powered-by"]).toBeUndefined()
  }
  const robots = await request.get("/robots.txt", { maxRedirects: 0 })
  expect(robots.status()).toBe(200)
  expect(robots.headers()["content-type"]).toContain("text/plain")
  expect(await robots.text()).toContain("Disallow: /")
})
