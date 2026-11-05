import type { Instrumentation } from "next"

// Starts LAWDE Shield on the Node.js server runtime.
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { getLawdeAgent } = await import("@lib/lawde-shield")
    await getLawdeAgent()
  }
}

// Reports errors thrown while rendering pages, route handlers and server actions.
export const onRequestError: Instrumentation.onRequestError = async (
  error,
  request,
  context
) => {
  if (process.env.NEXT_RUNTIME !== "nodejs") {
    return
  }
  const { getLawdeAgent } = await import("@lib/lawde-shield")
  const agent = await getLawdeAgent()
  await agent?.captureException(error, {
    metadata: {
      method: request.method,
      path: request.path,
      route: context.routePath,
      route_type: context.routeType,
    },
  })
}
