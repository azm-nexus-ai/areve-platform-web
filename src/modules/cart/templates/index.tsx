import { HttpTypes } from "@medusajs/types"
import { getAreveConfig } from "@lib/data/areve"
import DeliveryProgress from "@modules/cart/components/delivery-progress"
import GiftMessage from "@modules/cart/components/gift-message"
import EmptyCartMessage from "../components/empty-cart-message"
import SignInPrompt from "../components/sign-in-prompt"
import ItemsTemplate from "./items"
import Summary from "./summary"

type Props = { cart: HttpTypes.StoreCart | null; customer: HttpTypes.StoreCustomer | null; paymentSessionMissing?: boolean }

export default async function CartTemplate({ cart, customer, paymentSessionMissing }: Props) {
  const config = await getAreveConfig()
  const initialMessage = typeof cart?.metadata?.gift_message === "string" ? cart.metadata.gift_message : ""

  return (
    <main className="content-container py-10 small:py-16" data-testid="cart-container">
      <h1 className="mb-8 font-serif text-4xl text-semantic-text-primary">Your cart</h1>
      {paymentSessionMissing && (
        <p role="status" className="mb-6 border border-semantic-border-subtle p-4 text-sm text-semantic-text-primary">
          This checkout session is no longer available. If you completed payment, check your order confirmation email or contact AREVÉ before paying again.
        </p>
      )}
      {cart?.items?.length ? (
        <div className="grid grid-cols-1 gap-10 small:grid-cols-[minmax(0,1fr)_360px] small:gap-12">
          <div className="min-w-0 space-y-8">
            {!customer && <SignInPrompt />}
            <div className="overflow-x-auto bg-semantic-surface-canvas">
              <ItemsTemplate cart={cart} />
            </div>
            <GiftMessage initialValue={initialMessage} />
          </div>
          <aside className="min-w-0 space-y-5 small:sticky small:top-32 small:self-start" aria-label="Cart summary">
            <DeliveryProgress itemTotal={cart.item_total ?? 0} config={config} />
            {cart.region && <Summary cart={cart as HttpTypes.StoreCart & { promotions: HttpTypes.StorePromotion[] }} />}
          </aside>
        </div>
      ) : (
        <EmptyCartMessage />
      )}
    </main>
  )
}
