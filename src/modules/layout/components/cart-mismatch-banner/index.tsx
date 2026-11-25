"use client"

import { transferCart } from "@lib/data/customer"
import type { StoreCart, StoreCustomer } from "@medusajs/types"
import { useState, useTransition } from "react"

export default function CartMismatchBanner({ customer, cart }: { customer: StoreCustomer; cart: StoreCart }) {
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState("")
  if (!customer || cart.customer_id) return null

  return <section aria-label="Account basket recovery" className="border-b border-semantic-border-subtle bg-semantic-surface-muted px-6 py-4 text-center text-sm text-semantic-text-primary">
    <p>We couldn’t connect this basket to your account. Your items are still here.</p>
    <button type="button" disabled={pending} aria-busy={pending} className="mt-1 inline-flex min-h-11 items-center font-medium underline underline-offset-4 disabled:opacity-60" onClick={() => startTransition(async () => {
      setError("")
      try { await transferCart() }
      catch { setError("Your basket could not be connected. Please try again when your connection is restored.") }
    })}>{pending ? "Connecting your basket…" : "Try again"}</button>
    {error && <p role="alert" className="text-semantic-text-error">{error}</p>}
  </section>
}
