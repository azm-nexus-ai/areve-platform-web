import { secureCookies } from "../local-review"
import { HttpTypes } from "@medusajs/types"
import { NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.MEDUSA_BACKEND_URL
const PUBLISHABLE_API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
const DEFAULT_REGION = process.env.NEXT_PUBLIC_DEFAULT_REGION || "ng"
let cachedCountries: Set<string> = new Set()
let updatedAt = 0

async function getCountries() {
  if (cachedCountries.size && updatedAt > Date.now() - 3600_000) return cachedCountries
  if (!BACKEND_URL || !PUBLISHABLE_API_KEY) throw new Error("Shop configuration unavailable")
  const response = await fetch(`${BACKEND_URL}/store/regions`, {
    headers: { "x-publishable-api-key": PUBLISHABLE_API_KEY },
    next: { revalidate: 3600, tags: ["regions"] },
    cache: "force-cache",
    signal: AbortSignal.timeout(5000),
  })
  if (!response.ok) throw new Error("Regions unavailable")
  const { regions } = await response.json() as { regions: HttpTypes.StoreRegion[] }
  const countries = new Set<string>()
  regions?.forEach(region => region.countries?.forEach(country => {
    if (country.iso_2) countries.add(country.iso_2.toLowerCase())
  }))
  if (!countries.size) throw new Error("Regions unavailable")
  // Replace the map so deleted regions cannot survive a refresh indefinitely.
  cachedCountries = countries
  updatedAt = Date.now()
  return countries
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  if (pathname === "/areve-logo.png" || pathname === "/favicon.ico") return NextResponse.next()

  let countries: Set<string>
  try {
    countries = await getCountries()
  } catch {
    return new NextResponse("The shop is temporarily unavailable. Please try again shortly.", {
      status: 503,
      headers: { "Retry-After": "30", "Cache-Control": "no-store", "Content-Type": "text/plain; charset=utf-8" },
    })
  }
  const segment = pathname.split("/")[1]
  const geoCountry = request.headers.get("x-vercel-ip-country")?.toLowerCase()
  const country = countries.has(segment.toLowerCase()) ? segment.toLowerCase()
    : geoCountry && countries.has(geoCountry) ? geoCountry
    : countries.has(DEFAULT_REGION) ? DEFAULT_REGION : countries.values().next().value!
  const hasCountry = segment === country
  const url = request.nextUrl.clone()
  if (!hasCountry) {
    url.pathname = countries.has(segment.toLowerCase())
      ? pathname.replace(`/${segment}`, `/${country}`)
      : `/${country}${pathname === "/" ? "" : pathname}`
  }
  const response = hasCountry ? NextResponse.next() : NextResponse.redirect(url, 307)
  if (!request.cookies.has("_medusa_cache_id")) {
    response.cookies.set("_medusa_cache_id", crypto.randomUUID(), {
      maxAge: 86400, path: "/", httpOnly: true, sameSite: "lax", secure: secureCookies(),
    })
  }
  return response
}

export const config = {
  matcher: ["/((?!api/|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|images/|assets/|brand/|apple-icon.png|icon-512.png).*)"],
}
