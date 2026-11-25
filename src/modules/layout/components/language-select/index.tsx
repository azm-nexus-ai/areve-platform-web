"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { updateLocale } from "@lib/data/locale-actions"
import { Locale } from "@lib/data/locales"

export default function LanguageSelect({ locales, currentLocale }: { locales: Locale[]; currentLocale: string | null }) {
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState("")
  const router = useRouter()
  return <div>
    <label className="flex flex-col gap-2 text-sm">
      Language
      <select value={currentLocale ?? ""} disabled={pending} onChange={event => {
        const code = event.target.value
        setError("")
        startTransition(async () => {
          try { await updateLocale(code); router.refresh() }
          catch { setError("We couldn’t change your language. Please try again.") }
        })
      }} className="min-h-11 w-full border border-areve-sand bg-areve-ivory px-3">
        <option value="">English (default)</option>
        {locales.map(locale => <option key={locale.code} value={locale.code}>{locale.name}</option>)}
      </select>
    </label>
    {pending && <p role="status" className="mt-2 text-xs">Updating language…</p>}
    {error && <p role="alert" className="mt-2 text-sm">{error}</p>}
  </div>
}
