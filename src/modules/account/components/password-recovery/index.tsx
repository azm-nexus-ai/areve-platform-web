"use client"

import { useActionState, useEffect, useRef, useState } from "react"
import { requestPasswordReset, resetCustomerPassword } from "@lib/data/password-recovery"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import Input from "@modules/common/components/input"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const initialState = { success: false, message: "" }

export function RequestPasswordReset({ email = "" }: { email?: string }) {
  const [state, action] = useActionState(requestPasswordReset, initialState)
  return <form action={action} className="w-full max-w-md space-y-5">
    <Input label="Email" name="email" type="email" autoComplete="email" defaultValue={email} maxLength={254} required />
    <p className="text-sm text-semantic-text-muted">We will email a link that expires in 15 minutes.</p>
    {state.message && <p role={state.success ? "status" : "alert"} className="text-sm">{state.message}</p>}
    <SubmitButton className="w-full">Send reset link</SubmitButton>
  </form>
}

export function ResetPassword() {
  const loaded = useRef(false)
  const [token, setToken] = useState<string | null>(null)
  const [state, action] = useActionState(resetCustomerPassword, initialState)
  useEffect(() => {
    if (loaded.current) return
    loaded.current = true
    const value = new URLSearchParams(window.location.hash.slice(1)).get("token") ?? ""
    setToken(value)
    // Keep credentials out of browser history and subsequent navigation.
    window.history.replaceState(null, "", window.location.pathname)
  }, [])
  if (token === null) return <p role="status">Checking your reset link…</p>
  if (state.success) return <div className="space-y-5"><p role="status">{state.message}</p><LocalizedClientLink className="underline" href="/account">Sign in</LocalizedClientLink></div>
  if (!token) return <div className="space-y-5"><p role="alert">This reset link is missing or has already been opened. Request a new link.</p><LocalizedClientLink className="underline" href="/forgot-password">Request a new reset link</LocalizedClientLink></div>
  return <form action={action} className="w-full max-w-md space-y-5">
    <input type="hidden" name="token" value={token} />
    <Input label="New password" name="password" type="password" autoComplete="new-password" minLength={12} maxLength={128} required />
    <Input label="Confirm password" name="confirm_password" type="password" autoComplete="new-password" minLength={12} maxLength={128} required />
    <p className="text-sm text-semantic-text-muted">Use 12–128 characters. A long, unique passphrase works well.</p>
    {state.message && <p role="alert" className="text-sm">{state.message}</p>}
    <SubmitButton className="w-full">Update password</SubmitButton>
    <LocalizedClientLink className="block underline text-sm" href="/forgot-password">Request a new reset link</LocalizedClientLink>
  </form>
}
