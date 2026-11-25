import type { Metadata } from "next"
import { RequestPasswordReset } from "@modules/account/components/password-recovery"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export const metadata: Metadata = { title: "Reset your password | AREVÉ", robots: { index: false, follow: false } }
export default function ForgotPasswordPage() {
  return <main id="main-content" className="content-container py-12 space-y-6"><h1 className="font-serif text-4xl">Reset your password</h1><RequestPasswordReset /><LocalizedClientLink href="/account" className="inline-block underline">Back to sign in</LocalizedClientLink></main>
}
