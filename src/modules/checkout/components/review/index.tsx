"use client"

import { Heading, clx } from "@medusajs/ui"
import PaymentButton from "../payment-button"
import { useSearchParams } from "next/navigation"

const Review = ({ cart }: { cart: any }) => {
  const searchParams = useSearchParams()
  const isOpen = searchParams.get("step") === "review"
  const paymentStatus = searchParams.get("payment")
  const paidByGiftcard = cart?.gift_cards?.length > 0 && cart?.total === 0
  const previousStepsCompleted =
    cart.shipping_address &&
    (cart.shipping_methods?.length ?? 0) > 0 &&
    (cart.payment_collection || paidByGiftcard)

  return (
    <section className="bg-semantic-surface-canvas">
      <Heading
        level="h2"
        className={clx("mb-6 flex items-baseline text-3xl-regular", {
          "opacity-50": !isOpen,
        })}
      >
        Review your order
      </Heading>
      {isOpen && (
        <div className="space-y-5">
          {paymentStatus && (
            <p role="alert" className="border border-semantic-border-subtle bg-semantic-surface-muted p-4 text-sm text-semantic-text-error">
              Your order has not been confirmed in this browser. Check its status before paying again.
              If money has left your account, keep your payment reference and contact AREVÉ for help.
            </p>
          )}
          <p className="text-sm leading-6 text-semantic-text-muted">
            Check your contact, delivery method and order total before proceeding.
            Delivery and returns information is being finalised; contact AREVÉ if you need clarification before paying.
          </p>
          {previousStepsCompleted ? (
            <PaymentButton cart={cart} data-testid="submit-order-button" />
          ) : (
            <p role="status" className="text-sm text-semantic-text-muted">Complete the previous checkout steps to continue.</p>
          )}
        </div>
      )}
    </section>
  )
}

export default Review
