import { safeTelemetryAgent } from "./telemetry-safety"

/**
 * LAWDE Shield crash reporting for the AREVÉ storefront server.
 * Enabled only when LAWDE_API_KEY is set; otherwise every call is a no-op.
 * The agent package is ESM-only, so it is loaded with a dynamic import.
 */
type LawdeAgentLike = {
  captureException: (error: unknown, overrides?: { metadata?: Record<string, unknown> }) => Promise<void>
}

let agentPromise: Promise<LawdeAgentLike | null> | null = null

export function getLawdeAgent(): Promise<LawdeAgentLike | null> {
  if (!process.env.LAWDE_API_KEY) {
    return Promise.resolve(null)
  }
  if (!agentPromise) {
    agentPromise = import("@lawdeshield/agent")
      .then(({ LawdeAgent }) => {
        const agent = new LawdeAgent({
          apiKey: process.env.LAWDE_API_KEY!,
          appId: process.env.LAWDE_APP_ID || undefined,
          // Optional override (tests/self-hosting); defaults to lawde.net ingest.
          endpoint: process.env.LAWDE_ENDPOINT || undefined,
          environment: process.env.LAWDE_ENVIRONMENT || process.env.NODE_ENV || "development",
          // Never send customer secrets or payment data.
          scrubRules: [/password/i, /token/i, /secret/i, /authorization/i, /card/i, /cvv/i],
          // Raw global capture bypasses our privacy boundary and changes Node's
          // uncaught-exception behavior. Hosting handles process crashes.
          autoInstrument: false,
        })
        return safeTelemetryAgent(agent)
      })
      .catch(() => {
        console.warn("[lawde-shield] monitoring is unavailable")
        return null
      })
  }
  return agentPromise
}

/** Report an error without ever throwing or slowing the request. */
export function reportError(error: unknown, metadata?: Record<string, unknown>) {
  void getLawdeAgent()
    .then((agent) => agent?.captureException(error, metadata ? { metadata } : undefined))
    .catch(() => undefined)
}
