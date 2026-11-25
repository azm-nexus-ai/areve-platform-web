import { listCartShippingMethods } from "@lib/data/fulfillment"
import { listCartPaymentMethods } from "@lib/data/payment"
import { HttpTypes } from "@medusajs/types"
import Addresses from "@modules/checkout/components/addresses"
import Payment from "@modules/checkout/components/payment"
import Review from "@modules/checkout/components/review"
import Shipping from "@modules/checkout/components/shipping"
import { getDeliveryCoverage } from "@lib/data/delivery"

export default async function CheckoutForm({
  cart,
  customer,
  shippingMethods,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
  shippingMethods: Awaited<ReturnType<typeof listCartShippingMethods>>
}) {
  if (!cart) {
    return null
  }

  const [paymentMethods, coverage] = await Promise.all([
    listCartPaymentMethods(cart.region?.id ?? ""), getDeliveryCoverage(),
  ])

  if (!paymentMethods) {
    return <p role="alert" className="text-sm text-semantic-text-error">Checkout options are temporarily unavailable. Please try again later.</p>
  }

  return (
    <div className="w-full grid grid-cols-1 gap-y-8">
      <Addresses cart={cart} customer={customer} coverage={coverage} />

      <Shipping cart={cart} availableShippingMethods={shippingMethods} />

      <Payment cart={cart} availablePaymentMethods={paymentMethods} />

      <Review cart={cart} />
    </div>
  )
}
