import test from "node:test"
import assert from "node:assert/strict"
import { telemetryError, telemetryMetadata, safeTelemetryAgent } from "../telemetry-safety.ts"

test("telemetry removes raw errors, identifiers, URL credentials and nested request data", async () => {
  const error = new Error("fixture@areve.test password=synthetic-secret")
  error.stack = "Error: credential\n    at action (/private/user/src/action.ts:42:1)\n    at https://example.test/reset?token=fixture:1:2"
  const safe = telemetryError(error)
  assert.equal(safe.message, "Server operation failed")
  assert.match(safe.stack, /src\/action.ts:42:1/)
  assert.doesNotMatch(safe.stack, /fixture|private|password|credential/)
  assert.deepEqual(telemetryMetadata({ method: "POST", status: 500, route_type: "action", path: "/reset?token=fixture", customer: { email: "fixture@areve.test" } }), { method: "POST", status: 500, route_type: "action" })
  const calls = []
  const agent = safeTelemetryAgent({ captureException: async (...args) => { calls.push(args); throw new Error("monitoring unavailable") } })
  await agent.captureException(error, { metadata: { path: "/sensitive" } })
  assert.equal(calls[0][0].message, "Server operation failed")
  assert.deepEqual(calls[0][1], { metadata: {} })
})

test("stalled telemetry cannot hold up the request or grow unbounded parallel work", async () => {
  let calls = 0
  let release
  const stuck = new Promise(resolve => { release = resolve })
  const agent = safeTelemetryAgent({ captureException: async () => { calls++; await stuck } })
  await Promise.all([agent.captureException(new Error()), agent.captureException(new Error()), agent.captureException(new Error())])
  assert.equal(calls, 2)
  release()
})

test("actual LAWDE adapter sends only sanitized payloads without installing process handlers", async () => {
  const previousKey = process.env.LAWDE_API_KEY
  const previousFetch = globalThis.fetch
  const before = process.listenerCount("uncaughtException")
  const payloads = []
  process.env.LAWDE_API_KEY = "synthetic-local-only"
  globalThis.fetch = async (_url, init) => { payloads.push(JSON.parse(init.body)); return new Response("{}", { status: 200 }) }
  try {
    const { getLawdeAgent } = await import("../lawde-shield.ts")
    const agent = await getLawdeAgent()
    await agent.captureException(new Error("email=fixture@areve.test token=synthetic-secret"), { metadata: { method: "POST", path: "/reset?token=fixture", headers: { cookie: "secret" } } })
    assert.equal(process.listenerCount("uncaughtException"), before)
    assert.equal(payloads.length, 1)
    assert.equal(payloads[0].error_message, "Server operation failed")
    assert.equal(payloads[0].metadata.method, "POST")
    assert.doesNotMatch(JSON.stringify(payloads), /fixture@|synthetic-secret|cookie|\/reset/)
  } finally {
    globalThis.fetch = previousFetch
    if (previousKey === undefined) delete process.env.LAWDE_API_KEY
    else process.env.LAWDE_API_KEY = previousKey
  }
})
