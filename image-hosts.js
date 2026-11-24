/** Limit optimized product images to the configured public R2 origin and prefix. */
module.exports = function imageHosts(value) {
  if (!value) return []
  let url
  try { url = new URL(value) } catch { throw new Error("NEXT_PUBLIC_R2_PUBLIC_URL must be a valid HTTPS URL") }
  if (url.protocol !== "https:" || url.username || url.password || url.port || url.search || url.hash || /[*]/.test(url.hostname + url.pathname)) {
    throw new Error("NEXT_PUBLIC_R2_PUBLIC_URL must be an HTTPS image origin or path without credentials, a port, query or wildcard")
  }
  return [{ protocol: "https", hostname: url.hostname, port: "", pathname: `${url.pathname.replace(/\/+$/, "")}/**`, search: "" }]
}
