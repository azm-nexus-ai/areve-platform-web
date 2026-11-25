"use client"

import { useParams, usePathname } from "next/navigation"
import { useState, useTransition } from "react"
import { updateRegion } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"

export default function CountrySelect({ regions }: { regions: HttpTypes.StoreRegion[] }) {
  const [error, setError] = useState("")
  const [pending, startTransition] = useTransition()
  const params = useParams()
  const countryCode = String(params.countryCode ?? "ng")
  const pathname = usePathname()
  const options = regions.flatMap(region => (region.countries ?? []).flatMap(country =>
    country.iso_2 && country.display_name ? [{ code: country.iso_2, name: country.display_name }] : []
  )).sort((a, b) => a.name.localeCompare(b.name))
  const current = options.find(option => option.code === countryCode)

  if (options.length <= 1) return <p className="text-sm">Shipping to: {current?.name ?? options[0]?.name ?? "Nigeria"}</p>

  return <div>
    <label className="flex flex-col gap-2 text-sm">
      Shipping to
      <select value={countryCode} disabled={pending} onChange={event => {
        const next = event.target.value
        setError("")
        startTransition(async () => {
          try { await updateRegion(next, pathname.slice(countryCode.length + 1)) }
          catch { setError("We couldn’t change your delivery country. Please try again.") }
        })
      }} className="min-h-11 w-full border border-areve-sand bg-areve-ivory px-3">
        {options.map(option => <option key={option.code} value={option.code}>{option.name}</option>)}
      </select>
    </label>
    {pending && <p role="status" className="mt-2 text-xs">Updating delivery country…</p>}
    {error && <p role="alert" className="mt-2 text-sm">{error}</p>}
  </div>
}
