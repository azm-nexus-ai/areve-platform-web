import type { MetadataRoute } from "next"
import { isPublicProduction } from "../../deployment-policy"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: isPublicProduction()
      ? { userAgent: "*", allow: "/", disallow: ["/*/cart", "/*/checkout", "/*/account", "/*/order", "/*/forgot-password", "/*/reset-password"] }
      : { userAgent: "*", disallow: "/" },
  }
}
