import { test } from "node:test"
import assert from "node:assert/strict"
import { AREVE_CONFIG_DEFAULTS, amountToFreeDelivery, resolveAreveConfig } from "../areve-config.ts"

test("uses the API settings and normalises the WhatsApp number", () => {
  const config = resolveAreveConfig({
    currency_code: "ngn",
    country_code: "ng",
    free_delivery_threshold: 250000,
    whatsapp_number: "0801 234 5678",
    support_email: "care@example.com",
  })
  assert.deepEqual(config, {
    currency_code: "ngn",
    country_code: "ng",
    free_delivery_threshold: 250000,
    whatsapp_number: "2348012345678",
    support_email: "care@example.com",
    content: AREVE_CONFIG_DEFAULTS.content,
  })
})

test("falls back to storefront env values when the API is down", () => {
  const config = resolveAreveConfig(null, {
    NEXT_PUBLIC_WHATSAPP_NUMBER: "+2348099999999",
    NEXT_PUBLIC_FREE_DELIVERY_THRESHOLD: "350000",
  })
  assert.equal(config.whatsapp_number, "2348099999999")
  assert.equal(config.free_delivery_threshold, 350000)
  assert.equal(config.currency_code, "ngn")
})

test("uses safe defaults when nothing is configured", () => {
  assert.deepEqual(resolveAreveConfig(null), AREVE_CONFIG_DEFAULTS)
})

test("prefers the API WhatsApp number, but uses env when the API one is invalid", () => {
  const env = { NEXT_PUBLIC_WHATSAPP_NUMBER: "08011111111" }
  assert.equal(resolveAreveConfig({ whatsapp_number: "08022222222" }, env).whatsapp_number, "2348022222222")
  assert.equal(resolveAreveConfig({ whatsapp_number: "123" }, env).whatsapp_number, "2348011111111")
})

test("ignores a missing or zero threshold from the API", () => {
  assert.equal(resolveAreveConfig({ free_delivery_threshold: 0 }).free_delivery_threshold, 300000)
})

test("works out how far a cart is from free delivery", () => {
  const config = { free_delivery_threshold: 300000 }
  assert.equal(amountToFreeDelivery(255000, config), 45000)
  assert.equal(amountToFreeDelivery(300000, config), 0)
  assert.equal(amountToFreeDelivery(410000, config), 0)
})


test("reads admin-managed hero and announcement content from the API", () => {
  const config = resolveAreveConfig({
    content: {
      announcement: { enabled: true, text: "New arrivals", link: "/collections/new-in" },
      hero: {
        headline: "A new collection",
        subheadline: "Considered details.",
        cta_label: "Browse",
        cta_link: "/store",
        image_url: "https://images.example.com/hero.webp",
      },
    },
  })
  assert.equal(config.content.announcement.enabled, true)
  assert.equal(config.content.announcement.text, "New arrivals")
  assert.equal(config.content.hero.headline, "A new collection")
  assert.equal(config.content.hero.image_url, "https://images.example.com/hero.webp")
})

test("rejects unsafe content links and uses defaults", () => {
  const config = resolveAreveConfig({
    content: {
      announcement: { enabled: true, text: "Offers", link: "javascript:alert(1)" },
      hero: { cta_link: "javascript:alert(1)", image_url: "javascript:alert(1)" },
    },
  })
  assert.equal(config.content.announcement.link, null)
  assert.equal(config.content.hero.cta_link, "/store")
  assert.equal(config.content.hero.image_url, null)
})
