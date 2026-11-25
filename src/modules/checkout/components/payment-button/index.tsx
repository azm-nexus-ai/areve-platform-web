"use client"

import { isManual, isPaystack } from "@lib/constants"
import { placeOrder } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@medusajs/ui"
import React, { useState } from "react"
import ErrorMessage from "../error-message"

type PaymentButtonProps = {
  cart: HttpTypes.StoreCart
  "data-testid": string
}

const PaymentButton: React.FC<PaymentButtonProps> = ({
  cart,
  "data-testid": dataTestId,
}) => {
  const notReady =
    !cart ||
    !cart.shipping_address ||
    !cart.billing_address ||
    !cart.email ||
    (cart.shipping_methods?.length ?? 0) < 1

  const paymentSession = cart.payment_collection?.payment_sessions?.[0]

  switch (true) {
    case isPaystack(paymentSession?.provider_id):
      return (
        <PaystackPaymentButton
          notReady={notReady}
          cart={cart}
          data-testid={dataTestId}
        />
      )
    case (process.env.NODE_ENV !== "production" || process.env.NEXT_PUBLIC_AREVE_REVIEW_MODE === "local") && isManual(paymentSession?.provider_id):
      return (
        <ManualTestPaymentButton notReady={notReady} data-testid={dataTestId} />
      )
    default:
      return <Button disabled>Select a payment method</Button>
  }
}

/**
 * Paystack (redirect flow): sends the customer to Paystack's hosted page.
 * Paystack then returns them to the callback URL set in the Paystack dashboard:
 *   <storefront>/ng/checkout/paystack/callback
 * which completes the cart (the backend verifies the transaction with Paystack).
 */
const PaystackPaymentButton = ({
  cart,
  notReady,
  "data-testid": dataTestId,
}: {
  cart: HttpTypes.StoreCart
  notReady: boolean
  "data-testid"?: string
}) => {
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const session = cart.payment_collection?.payment_sessions?.find(
    (s) => s.status === "pending"
  )
  const authorizationUrl = session?.data?.paystackTxAuthorizationUrl as
    | string
    | undefined

  const handlePayment = () => {
    let safeUrl: URL | null = null
    try {
      if (authorizationUrl) {
        const parsed = new URL(authorizationUrl)
        if (parsed.protocol === "https:" && parsed.hostname === "checkout.paystack.com" && !parsed.username && !parsed.password && !parsed.port) {
          safeUrl = parsed
        }
      }
    } catch {
      safeUrl = null
    }
    if (!safeUrl) {
      setErrorMessage("Paystack payment is not available. Please return to payment and try again.")
      return
    }
    setSubmitting(true)
    window.location.assign(safeUrl.href)
  }

  return (
    <>
      <Button
        disabled={notReady}
        isLoading={submitting}
        onClick={handlePayment}
        size="large"
        data-testid={dataTestId}
      >
        Pay with Paystack
      </Button>
      <ErrorMessage
        error={errorMessage}
        data-testid="paystack-payment-error-message"
      />
    </>
  )
}

const ManualTestPaymentButton = ({ notReady }: { notReady: boolean }) => {
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const onPaymentCompleted = async () => {
    await placeOrder()
      .catch((err) => {
        setErrorMessage(err.message)
      })
      .finally(() => {
        setSubmitting(false)
      })
  }

  const handlePayment = () => {
    setSubmitting(true)

    onPaymentCompleted()
  }

  return (
    <>
      <Button
        disabled={notReady}
        isLoading={submitting}
        onClick={handlePayment}
        size="large"
        data-testid="submit-order-button"
      >
        Place review order
      </Button>
      <ErrorMessage
        error={errorMessage}
        data-testid="manual-payment-error-message"
      />
    </>
  )
}

export default PaymentButton
