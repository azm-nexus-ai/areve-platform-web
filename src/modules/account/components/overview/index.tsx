import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { convertToLocale } from "@lib/util/money"
import type { HttpTypes } from "@medusajs/types"

export default function Overview({ customer, orders }: { customer: HttpTypes.StoreCustomer | null; orders: HttpTypes.StoreOrder[] | null }) {
  const complete = [customer?.email, customer?.first_name && customer?.last_name, customer?.phone, customer?.addresses?.some(address => address.is_default_billing)].filter(Boolean).length * 25
  return <div data-testid="overview-page-wrapper">
    <h1 className="font-serif text-4xl small:text-5xl" data-testid="welcome-message" data-value={customer?.first_name}>Welcome{customer?.first_name ? `, ${customer.first_name}` : " back"}</h1>
    <p className="mt-4 break-words text-sm leading-6 text-semantic-text-muted">Signed in as <span data-testid="customer-email" data-value={customer?.email}>{customer?.email}</span></p>
    <div className="my-8 grid grid-cols-2 gap-4 border-y border-semantic-border-subtle py-6">
      <LocalizedClientLink href="/account/profile" className="space-y-2"><h2 className="text-sm font-medium">Your profile</h2><p className="font-serif text-3xl" data-testid="customer-profile-completion" data-value={complete}>{complete}%</p><p className="text-xs text-semantic-text-muted">Complete your details</p></LocalizedClientLink>
      <LocalizedClientLink href="/account/addresses" className="space-y-2"><h2 className="text-sm font-medium">Saved addresses</h2><p className="font-serif text-3xl" data-testid="addresses-count" data-value={customer?.addresses?.length ?? 0}>{customer?.addresses?.length ?? 0}</p><p className="text-xs text-semantic-text-muted">Manage delivery details</p></LocalizedClientLink>
    </div>
    <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="font-serif text-2xl">Recent orders</h2><LocalizedClientLink href="/account/orders" className="inline-flex min-h-11 items-center text-sm underline underline-offset-4">View all orders</LocalizedClientLink></div>
    {orders?.length ? <ul className="mt-4 divide-y divide-semantic-border-subtle" data-testid="orders-wrapper">{orders.slice(0, 5).map(order => <li key={order.id} data-testid="order-wrapper" data-value={order.id}>
      <LocalizedClientLink href={`/account/orders/details/${order.id}`} className="flex flex-wrap items-center justify-between gap-3 py-5 hover:text-semantic-text-accent" data-testid="open-order-button">
        <div><p className="text-sm font-medium" data-testid="order-id" data-value={order.display_id}>Order #{order.display_id}</p><p className="mt-1 text-xs text-semantic-text-muted" data-testid="order-created-date">{new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeZone: "Africa/Lagos" }).format(new Date(order.created_at))}</p></div>
        <p className="text-sm" data-testid="order-amount">{convertToLocale({ amount: order.total, currency_code: order.currency_code })}<span aria-hidden="true" className="ml-3">→</span></p>
      </LocalizedClientLink>
    </li>)}</ul> : <div className="mt-4 bg-semantic-surface-muted p-6"><p className="text-sm leading-6" data-testid="no-orders-message">Your signed-in orders will appear here. Explore the collection when you’re ready.</p><LocalizedClientLink href="/store" className="mt-3 inline-flex min-h-11 items-center text-sm font-medium underline underline-offset-4">Discover the collection</LocalizedClientLink></div>}
  </div>
}
