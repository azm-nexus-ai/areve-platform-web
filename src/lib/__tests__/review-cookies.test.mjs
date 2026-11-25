import test from "node:test"
import assert from "node:assert/strict"
import { createRequire } from "node:module"
const { secureCookies } = createRequire(import.meta.url)("../../../local-review.js")
const review = { NODE_ENV: "production", AREVE_REVIEW_MODE: "local", NEXT_PUBLIC_AREVE_REVIEW_MODE: "local", AREVE_ENVIRONMENT: "staging", HOST: "127.0.0.1", MEDUSA_BACKEND_URL: "http://127.0.0.1:59010", NEXT_PUBLIC_BASE_URL: "http://127.0.0.1:58010" }

test("hosted production cookies remain Secure and ordinary development uses HTTP", () => {
  assert.equal(secureCookies({ NODE_ENV: "production", VERCEL: "1" }), true)
  assert.equal(secureCookies({ NODE_ENV: "development" }), false)
})
test("isolated local review permits HTTP cookies for all browser engines", () => {
  assert.equal(secureCookies(review), false)
})
test("partial flags, public origins and hosted markers cannot downgrade cookies", () => {
  for (const change of [{ AREVE_REVIEW_MODE: "" }, { NEXT_PUBLIC_AREVE_REVIEW_MODE: "" }, { AREVE_ENVIRONMENT: "production" }, { HOST: "0.0.0.0" }, { NEXT_PUBLIC_BASE_URL: "https://shop.areve.cc" }, { MEDUSA_BACKEND_URL: "http://public.example" }, { VERCEL: "1" }, { RAILWAY_PROJECT_ID: "fixture" }]) {
    assert.throws(() => secureCookies({ ...review, ...change }), /Local review requires/)
  }
})
