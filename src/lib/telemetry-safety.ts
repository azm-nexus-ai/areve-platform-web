/** Only code locations and explicitly allowed operational dimensions may leave
 * the application. Error messages, causes, request URLs and arbitrary metadata
 * can contain customer details or credentials and are never forwarded.
 */
export function telemetryError(value: unknown): Error {
  const safe = new Error("Server operation failed")
  safe.stack = "Error: Server operation failed"
  try {
    if (!(value instanceof Error) || typeof value.stack !== "string") return safe
    const frames: string[] = []
    for (const line of value.stack.slice(0, 32_768).split("\n").slice(1, 41)) {
      // Drop absolute deployment/user paths, function names and URL queries.
      const match = line.match(/(?:^|[/\\])((?:src|node_modules|\.next|\.medusa)[/\\][a-zA-Z0-9_@.$()[\]/\\-]+\.(?:[cm]?js|tsx?):\d{1,7}:\d{1,7})\)?$/)
      if (match && !match[1].includes("..")) frames.push(`    at ${match[1].replace(/\\/g, "/")}`)
      if (frames.length === 12) break
    }
    if (frames.length) safe.stack += `\n${frames.join("\n")}`
  } catch {
    // Hostile or malformed error properties must not break the error handler.
  }
  return safe
}

const methods = new Set(["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"])
const templates = new Set(["order-confirmation", "order-dispatched", "order-delivered", "order-canceled", "staff-new-order", "staff-low-stock", "staff-daily-sales", "customer-password-reset"])
const routeTypes = new Set(["render", "route", "action", "middleware"])

export function telemetryMetadata(input?: Record<string, unknown>): Record<string, string | number> {
  const safe: Record<string, string | number> = {}
  if (!input) return safe
  try {
    if (typeof input.method === "string" && methods.has(input.method)) safe.method = input.method
    if (typeof input.status === "number" && Number.isInteger(input.status) && input.status >= 100 && input.status <= 599) safe.status = input.status
    if (input.job === "daily-sales") safe.job = "daily-sales"
    if (typeof input.template === "string" && templates.has(input.template)) safe.template = input.template
    if (typeof input.route_type === "string" && routeTypes.has(input.route_type)) safe.route_type = input.route_type
  } catch {
    // Never inspect or serialize unknown properties, nested objects or getters.
  }
  return safe
}

export type TelemetryAgent = { captureException: (error: unknown, overrides?: { metadata?: Record<string, unknown> }) => Promise<void> }

/** Bound the error-path overhead even if the monitoring transport stalls.
 * A stalled request retains its slot until it settles, preventing an unbounded
 * number of requests after a timeout. Monitoring is best-effort, not an audit log.
 */
export function safeTelemetryAgent(raw: TelemetryAgent): TelemetryAgent {
  let inFlight = 0
  return {
    async captureException(error, overrides) {
      if (inFlight >= 2) return
      inFlight++
      const delivery = Promise.resolve()
        .then(() => raw.captureException(telemetryError(error), { metadata: telemetryMetadata(overrides?.metadata) }))
        .catch(() => undefined)
        .finally(() => { inFlight-- })
      let timer: ReturnType<typeof setTimeout> | undefined
      try {
        await Promise.race([delivery, new Promise<void>(resolve => { timer = setTimeout(resolve, 1000) })])
      } finally {
        if (timer) clearTimeout(timer)
      }
    },
  }
}
