import { retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import CheckoutProgress from "@modules/checkout/components/checkout-progress"
import CheckoutForm from "@modules/checkout/templates/checkout-form"
import CheckoutSummary from "@modules/checkout/templates/checkout-summary"
import { Metadata } from "next"
import { redirect } from "next/navigation"
import { checkoutStep } from "@lib/util/checkout-step"

export const metadata: Metadata = { title: "Checkout | AREVÉ" }

export default async function Checkout({
  params, searchParams,
}: {
  params: Promise<{ countryCode: string }>
  searchParams: Promise<{ step?: string }>
}) {
  const [{ countryCode }, query, cart] = await Promise.all([params, searchParams, retrieveCart()])
  if (!cart?.items?.length) redirect(`/${countryCode}/cart`)
  const step = checkoutStep(cart, query.step)
  if (query.step !== step) {
    redirect(`/${countryCode}/checkout?step=${step}`)
  }

  const customer = await retrieveCustomer()
  return (
    <main id="main-content" className="content-container py-10 small:py-16">
      <h1 className="mb-6 font-serif text-4xl text-semantic-text-primary">Checkout</h1>
      <CheckoutProgress />
      <div className="grid grid-cols-1 gap-10 small:grid-cols-[minmax(0,1fr)_360px] small:gap-12">
        <div>
          <CheckoutForm cart={cart} customer={customer} />
        </div>
        <CheckoutSummary cart={cart} />
      </div>
    </main>
  )
}
