/** Indexing needs an explicit live-release identity. A Vercel preview can never
 * inherit indexing permission from a copied production environment variable.
 */
function isPublicProduction(env = process.env) {
  return env.AREVE_ENVIRONMENT === "production" &&
    (!env.VERCEL_ENV || env.VERCEL_ENV === "production")
}

module.exports = { isPublicProduction }
