"use client"
import { useParams, usePathname } from "next/navigation"
import { useState } from "react"
import type { HttpTypes } from "@medusajs/types"
import { signout } from "@lib/data/customer"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const links = [{ href: "/account", label: "Overview", test: "overview-link" }, { href: "/account/profile", label: "Profile", test: "profile-link" }, { href: "/account/addresses", label: "Addresses", test: "addresses-link" }, { href: "/account/orders", label: "Orders", test: "orders-link" }]
export default function AccountNav({ customer }: { customer: HttpTypes.StoreCustomer | null }) {
  const route = usePathname()
  const { countryCode } = useParams() as { countryCode: string }
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")
  return <nav aria-label="Your account" className="border-b border-semantic-border-subtle pb-5 small:border-b-0 small:border-r small:pb-0 small:pr-6" data-testid="account-nav">
    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-semantic-text-accent">Your AREVÉ account</p>
    <p className="mb-4 break-words text-sm text-semantic-text-muted">{customer?.first_name}</p>
    <ul className="flex flex-wrap gap-x-6 small:block">{links.map(link => {
      const active = route === `/${countryCode}${link.href}` || (link.href === "/account/orders" && route?.startsWith(`/${countryCode}/account/orders/`))
      return <li key={link.href}><LocalizedClientLink href={link.href} aria-current={active ? "page" : undefined} data-testid={link.test} className={`inline-flex min-h-11 items-center text-sm underline-offset-4 hover:underline ${active ? "font-semibold text-semantic-text-primary underline" : "text-semantic-text-muted"}`}>{link.label}</LocalizedClientLink></li>
    })}<li><button type="button" disabled={busy} onClick={async () => { setBusy(true); setError(""); try { await signout(countryCode) } catch { setError("Unable to sign out. Check your connection and try again.") } finally { setBusy(false) } }} className="inline-flex min-h-11 items-center text-sm text-semantic-text-muted underline-offset-4 hover:underline disabled:opacity-60" data-testid="logout-button">{busy ? "Signing out…" : "Log out"}</button></li></ul>
    {error && <p role="alert" className="mt-3 text-sm text-semantic-text-error">{error}</p>}
  </nav>
}
