import { test } from "node:test"
import assert from "node:assert/strict"
import { checkoutStep } from "../checkout-step.ts"

const addressed = () => ({ email: "fixture@areve.test", shipping_address: { first_name: "Ada", last_name: "Fixture", address_1: "1 Test St", city: "Lagos", province: "Lagos", address_2: "Ikeja", country_code: "ng" }, billing_address: { address_1: "1 Test St" } })

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


test("Nigeria checkout requires a delivery state and Lagos area before proceeding", () => {
  const cart = { ...addressed(), shipping_methods: [{}], payment_collection: { payment_sessions: [{ status: "pending" }] } }
  assert.equal(checkoutStep({ ...cart, shipping_address: { ...cart.shipping_address, province: "" } }, "review"), "address")
  assert.equal(checkoutStep({ ...cart, shipping_address: { ...cart.shipping_address, address_2: " " } }, "review"), "address")
  assert.equal(checkoutStep({ ...cart, shipping_address: { ...cart.shipping_address, province: "Oyo", address_2: "" } }, "review"), "review")
})
