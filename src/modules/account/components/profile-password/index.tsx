"use client"

import type { HttpTypes } from "@medusajs/types"
import { RequestPasswordReset } from "../password-recovery"

export default function ProfilePassword({ customer }: { customer: HttpTypes.StoreCustomer }) {
  return <section aria-labelledby="account-password-heading" className="py-5 space-y-4" data-testid="account-password-editor">
    <h2 id="account-password-heading" className="text-lg font-semibold">Password</h2>
    <p className="text-sm">Confirm access to your email before choosing a new password.</p>
    <RequestPasswordReset email={customer.email} />
  </section>
}
