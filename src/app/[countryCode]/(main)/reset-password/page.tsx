import type { Metadata } from "next"
import { ResetPassword } from "@modules/account/components/password-recovery"

export const metadata: Metadata = { title: "Choose a new password | AREVÉ", robots: { index: false, follow: false }, referrer: "no-referrer" }
export default function ResetPasswordPage() {
  return <main className="content-container py-12 space-y-6"><h1 className="font-serif text-4xl">Choose a new password</h1><ResetPassword /></main>
}
