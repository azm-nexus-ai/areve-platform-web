const loopback = new Set(["localhost", "127.0.0.1", "[::1]"])

function localReviewEnabled(env = process.env) {
  if (!env.AREVE_REVIEW_MODE && !env.NEXT_PUBLIC_AREVE_REVIEW_MODE) return false
  const reject = () => { throw new Error("Local review requires matching review flags, staging identity and loopback API/storefront origins") }
  if (env.AREVE_REVIEW_MODE !== "local" || env.NEXT_PUBLIC_AREVE_REVIEW_MODE !== "local" || env.AREVE_ENVIRONMENT !== "staging" || env.HOST !== "127.0.0.1") reject()
  if (["VERCEL", "RAILWAY_PROJECT_ID", "RENDER", "FLY_APP_NAME", "K_SERVICE", "AWS_LAMBDA_FUNCTION_NAME"].some(key => env[key])) reject()
  for (const key of ["MEDUSA_BACKEND_URL", "NEXT_PUBLIC_BASE_URL"]) {
    try {
      const url = new URL(env[key] || "")
      if (url.protocol !== "http:" || !loopback.has(url.hostname) || url.username || url.password || url.pathname !== "/" || url.hash || url.search) reject()
    } catch { reject() }
  }
  return true
}
// WebKit does not retain Secure cookies on loopback HTTP. This exception is
// available only behind the complete isolated-review guard, never on a host.
function secureCookies(env = process.env) {
  return !localReviewEnabled(env) && env.NODE_ENV === "production"
}
module.exports = { localReviewEnabled, secureCookies }
