import { retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import CheckoutProgress from "@modules/checkout/components/checkout-progress"
import CheckoutForm from "@modules/checkout/templates/checkout-form"
import CheckoutSummary from "@modules/checkout/templates/checkout-summary"
import { Metadata } from "next"
import { redirect } from "next/navigation"
import { checkoutStep } from "@lib/util/checkout-step"
import { listCartShippingMethods } from "@lib/data/fulfillment"
import { getAreveConfig } from "@lib/data/areve"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export const metadata: Metadata = { title: "Checkout | AREVÉ" }

export default async function Checkout({
  params, searchParams,
}: {
  params: Promise<{ countryCode: string }>
  searchParams: Promise<{ step?: string }>
}) {
  const [{ countryCode }, query, cart] = await Promise.all([params, searchParams, retrieveCart()])
  if (!cart?.items?.length) redirect(`/${countryCode}/cart`)
  const config = await getAreveConfig()
  const existingPayment = cart.payment_collection?.payment_sessions?.some(session => session.provider_id === "pp_paystack_paystack" && !!session.data?.paystackTxRef)
  if (!config.checkout_available && !existingPayment) return <main id="main-content" className="content-container py-16 small:py-24"><p className="text-xs uppercase tracking-[0.18em] text-semantic-text-accent">Your AREVÉ basket</p><h1 className="mt-4 font-serif text-4xl">Checkout is temporarily paused</h1><p className="mt-6 max-w-xl text-base leading-7 text-semantic-text-muted">Your selections are saved. Please return later to complete your order.</p><LocalizedClientLink href="/cart" className="mt-8 inline-flex min-h-11 items-center text-sm font-semibold underline underline-offset-4">Return to your basket</LocalizedClientLink></main>
  const shippingMethods = await listCartShippingMethods(cart.id)
  const deliveryValid = cart.shipping_methods?.length === 1 && shippingMethods?.some(option => option.id === cart.shipping_methods?.[0].shipping_option_id && (option.price_type !== "flat" || Number(option.amount) === Number(cart.shipping_methods[0].amount)))
  const step = checkoutStep({ ...cart, shipping_methods: deliveryValid ? cart.shipping_methods : [] }, query.step)
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
          <CheckoutForm cart={cart} customer={customer} shippingMethods={shippingMethods} />
        </div>
        <CheckoutSummary cart={cart} />
      </div>
    </main>
  )
}
