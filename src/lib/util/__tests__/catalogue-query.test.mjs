import assert from "node:assert/strict"
import { test } from "node:test"
import { cataloguePage, catalogueQuery, catalogueSort, visiblePages } from "../catalogue-query.ts"
import medusaError from "../medusa-error.ts"
import imageHosts from "../../../../image-hosts.js"

test("catalogue paging rejects invalid offsets and never allocates the entire page count", () => {
  for (const value of [undefined, "-1", "NaN", "12junk", "2.5", Infinity, 100001, 1.1, [], {}]) assert.equal(cataloguePage(value), 1)
  assert.equal(cataloguePage("9"), 9)
  assert.deepEqual(visiblePages(9, 100000), [1, 8, 9, 10, 100000])
  assert.deepEqual(visiblePages(1, 1), [1])
})

test("only supported global sorts and bounded text search reach the API", () => {
  assert.equal(catalogueSort("price_asc"), "created_at")
  assert.equal(catalogueSort("title"), "title")
  assert.equal(catalogueQuery("  duvet  "), "duvet")
  assert.equal(catalogueQuery("x".repeat(1000)).length, 100)
})

test("transport errors never disclose provider data, credentials or request payloads", () => {
  for (const error of [null, { response: { status: 500, data: "private-body", headers: { token: "private-token" } } }, { request: "private-address" }, new Error("private-message")]) {
    assert.throws(() => medusaError(error), /The shop is temporarily unavailable/)
  }
  assert.throws(() => medusaError({ status: 401 }), /sign in again/)
})

test("image origins use an exact host and configured path, and reject unsafe configuration", () => {
  assert.deepEqual(imageHosts("https://images.areve.test/products/"), [{ protocol: "https", hostname: "images.areve.test", port: "", pathname: "/products/**", search: "" }])
  assert.deepEqual(imageHosts(undefined), [])
  for (const value of ["http://images.test", "https://user:pass@images.test", "https://images.test:444", "https://images.test?token=private", "https://*.test", "invalid"]) assert.throws(() => imageHosts(value))
})
