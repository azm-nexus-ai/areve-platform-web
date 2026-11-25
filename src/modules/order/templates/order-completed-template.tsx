import { Heading } from "@medusajs/ui"

import CartTotals from "@modules/common/components/cart-totals"
import Help from "@modules/order/components/help"
import Items from "@modules/order/components/items"
import OrderDetails from "@modules/order/components/order-details"
import ShippingDetails from "@modules/order/components/shipping-details"
import PaymentDetails from "@modules/order/components/payment-details"
import { HttpTypes } from "@medusajs/types"

type OrderCompletedTemplateProps = {
  order: HttpTypes.StoreOrder
}

export default async function OrderCompletedTemplate({
  order,
}: OrderCompletedTemplateProps) {
  return (
    <main id="main-content" className="py-6 min-h-[calc(100vh-64px)]">
      <div className="content-container flex flex-col justify-center items-center gap-y-10 max-w-4xl h-full w-full">
        <div
          className="flex flex-col gap-4 max-w-4xl h-full bg-areve-ivory w-full py-10"
          data-testid="order-complete-container"
        >
          <Heading
            level="h1"
            className="flex flex-col gap-y-3 font-serif text-areve-ink text-4xl small:text-5xl mb-4"
          >
            <span>Thank you.</span>
            <span className="font-sans text-base font-normal leading-7">Your order is confirmed.</span>
          </Heading>
          <OrderDetails order={order} />
          <Heading level="h2" className="font-serif text-3xl">
            Summary
          </Heading>
          <Items order={order} />
          <CartTotals totals={order} />
          {typeof order.metadata?.gift_message === "string" && order.metadata.gift_message && <section className="my-4 border-l-2 border-areve-walnut bg-areve-sand/30 p-5"><h2 className="font-serif text-2xl">Your gift note</h2><p className="mt-3 whitespace-pre-wrap break-words text-sm leading-7">{order.metadata.gift_message}</p></section>}
          <ShippingDetails order={order} />
          <PaymentDetails order={order} />
          <Help />
        </div>
      </div>
    </main>
  )
}
