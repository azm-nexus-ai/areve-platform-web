import { Heading } from "@medusajs/ui"
import ItemsPreviewTemplate from "@modules/cart/templates/preview"
import DiscountCode from "@modules/checkout/components/discount-code"
import CartTotals from "@modules/common/components/cart-totals"
import { HttpTypes } from "@medusajs/types"

export default function CheckoutSummary({ cart }: { cart: HttpTypes.StoreCart }) {
  const giftMessage = typeof cart.metadata?.gift_message === "string" ? cart.metadata.gift_message : null

  return (
    <aside className="min-w-0 border-t border-semantic-border-subtle py-6 small:sticky small:top-32 small:self-start small:border small:p-5" aria-label="Order summary">
      <Heading level="h2" className="font-serif text-2xl text-semantic-text-primary">Order summary</Heading>
      <div className="my-5"><CartTotals totals={cart} /></div>
      <ItemsPreviewTemplate cart={cart} />
      {giftMessage && (
        <div className="my-5 border-t border-semantic-border-subtle pt-4">
          <h3 className="text-sm font-semibold text-semantic-text-primary">Gift message</h3>
          <p className="mt-2 whitespace-pre-line text-sm text-semantic-text-muted">{giftMessage}</p>
        </div>
      )}
      <div className="mt-5"><DiscountCode cart={cart} /></div>
    </aside>
  )
}
