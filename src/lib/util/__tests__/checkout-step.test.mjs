import { test } from "node:test"
import assert from "node:assert/strict"
import { checkoutStep } from "../checkout-step.ts"

const addressed = () => ({ email: "fixture@areve.test", shipping_address: { first_name: "Ada", last_name: "Fixture", address_1: "1 Test St", city: "Lagos", country_code: "ng" }, billing_address: { address_1: "1 Test St" } })

test("checkout cannot skip required steps or render an unknown step", () => {
  assert.equal(checkoutStep({}, "review"), "address")
  assert.equal(checkoutStep(addressed(), "unknown"), "delivery")
  assert.equal(checkoutStep({ ...addressed(), shipping_methods: [{}] }, "review"), "payment")
  assert.equal(checkoutStep({ ...addressed(), shipping_methods: [{}], payment_collection: { payment_sessions: [{ status: "error" }] } }, "review"), "payment")
})

test("completed steps remain editable and a valid pending session unlocks review", () => {
  const cart = { ...addressed(), shipping_methods: [{}], payment_collection: { payment_sessions: [{ status: "pending" }] } }
  assert.equal(checkoutStep(cart), "review")
  assert.equal(checkoutStep(cart, "address"), "address")
  assert.equal(checkoutStep(cart, "payment"), "payment")
})
