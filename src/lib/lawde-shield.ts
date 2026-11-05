/**
 * LAWDE Shield crash reporting for the storefront's server side
 * (server components, route handlers, middleware on Node.js).
 * Enabled only when LAWDE_API_KEY is set. Browser capture is a follow-up.
 */
type LawdeAgentLike = {
  captureException: (
    error: unknown,
    overrides?: { metadata?: Record<string, unknown> }
  ) => Promise<void>
}

let agentPromise: Promise<LawdeAgentLike | null> | null = null

export function getLawdeAgent(): Promise<LawdeAgentLike | null> {
  if (!process.env.LAWDE_API_KEY) {
    return Promise.resolve(null)
  }
  if (!agentPromise) {
    agentPromise = import("@lawdeshield/agent")
      .then(
        ({ LawdeAgent }) =>
          new LawdeAgent({
            apiKey: process.env.LAWDE_API_KEY!,
            appId: process.env.LAWDE_APP_ID || undefined,
            endpoint: process.env.LAWDE_ENDPOINT || undefined,
            environment:
              process.env.LAWDE_ENVIRONMENT || process.env.NODE_ENV || "development",
            scrubRules: [/password/i, /token/i, /secret/i, /authorization/i, /card/i, /cvv/i],
            autoInstrument: true,
          }) as LawdeAgentLike
      )
      .catch(() => null)
  }
  return agentPromise
}
