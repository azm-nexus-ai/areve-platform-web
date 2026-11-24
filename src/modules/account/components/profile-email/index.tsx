import type { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default function ProfileEmail({ customer }: { customer: HttpTypes.StoreCustomer }) {
  return <section aria-labelledby="account-email-heading" className="space-y-3" data-testid="account-email-editor">
    <h2 id="account-email-heading" className="text-lg font-semibold">Email</h2>
    <p className="break-words">{customer.email}</p>
    <p className="text-sm text-ui-fg-subtle">For an email change, <LocalizedClientLink href="/returns" className="underline">contact our support team</LocalizedClientLink> so we can verify account ownership.</p>
  </section>
}
