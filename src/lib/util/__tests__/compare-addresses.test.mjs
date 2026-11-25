import { test } from "node:test"
import assert from "node:assert/strict"
import compareAddresses from "../compare-addresses.ts"

test("saved addresses in different delivery areas are not interchangeable", () => {
  const address = { address_1: "1 Fictional Street", province: "Lagos", address_2: "Ikeja" }
  assert.equal(compareAddresses(address, { ...address, address_2: "Ajah" }), false)
  assert.equal(compareAddresses(address, { ...address, company: "" }), true)
})
