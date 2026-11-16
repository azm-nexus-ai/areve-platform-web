import { test } from "node:test"
import assert from "node:assert/strict"
import { toWhatsAppNumber, whatsAppLink } from "../whatsapp.ts"

test("keeps international numbers as digits only", () => {
  assert.equal(toWhatsAppNumber("+234 801 234 5678"), "2348012345678")
  assert.equal(toWhatsAppNumber("2348012345678"), "2348012345678")
  assert.equal(toWhatsAppNumber("00234 801-234-5678"), "2348012345678")
})

test("converts local Nigerian formats", () => {
  assert.equal(toWhatsAppNumber("08012345678"), "2348012345678")
  assert.equal(toWhatsAppNumber("0801 234 5678"), "2348012345678")
  assert.equal(toWhatsAppNumber("8012345678"), "2348012345678")
})

test("rejects empty or impossible numbers", () => {
  assert.equal(toWhatsAppNumber(""), null)
  assert.equal(toWhatsAppNumber(null), null)
  assert.equal(toWhatsAppNumber(undefined), null)
  assert.equal(toWhatsAppNumber("12345"), null)
  assert.equal(toWhatsAppNumber("not a number"), null)
  assert.equal(toWhatsAppNumber("1234567890123456"), null)
})

test("builds wa.me links, with an encoded message when given", () => {
  assert.equal(whatsAppLink("08012345678"), "https://wa.me/2348012345678")
  assert.equal(
    whatsAppLink("08012345678", "Hello AREVÉ, I have a question."),
    "https://wa.me/2348012345678?text=Hello%20AREV%C3%89%2C%20I%20have%20a%20question."
  )
  assert.equal(whatsAppLink("abc"), null)
})
