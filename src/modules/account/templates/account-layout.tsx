import type { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import AccountNav from "../components/account-nav"

export default function AccountLayout({ customer, children }: { customer: HttpTypes.StoreCustomer | null; children: React.ReactNode }) {
  return <main id="main-content" className="content-container py-10 text-semantic-text-primary small:py-16" data-testid="account-page">
    <div className={customer ? "grid min-w-0 gap-8 small:grid-cols-[180px_minmax(0,1fr)] small:gap-14" : "mx-auto max-w-lg"}>
      {customer && <AccountNav customer={customer} />}
      <div className="min-w-0">{children}</div>
    </div>
    <section aria-labelledby="account-help" className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-semantic-border-subtle pt-8 small:flex-row small:items-center">
      <div><h2 id="account-help" className="font-serif text-2xl">A little assistance</h2><p className="mt-2 max-w-lg text-sm leading-6 text-semantic-text-muted">Find information about your delivery, returns and getting in touch with our team.</p></div>
      <LocalizedClientLink className="inline-flex min-h-11 items-center text-sm font-medium text-semantic-text-accent underline underline-offset-4" href="/returns">Customer care</LocalizedClientLink>
    </section>
  </main>
}
