import { placeOrder } from "@lib/data/cart"
import { NextRequest, NextResponse } from "next/server"

/**
 * Paystack redirects the customer here after payment.
 * Completing the cart makes the backend verify the transaction with Paystack;
 * on success placeOrder() redirects to the order confirmation page.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ countryCode: string }> }
) {
  const { countryCode } = await params

  // placeOrder() throws a Next.js redirect when the order is created.
  const cart = await placeOrder()

  // Still a cart: payment was not confirmed. Send the customer back to review.
  const url = new URL(`/${countryCode}/checkout`, request.url)
  url.searchParams.set("step", "review")
  url.searchParams.set("payment", cart ? "not_confirmed" : "error")
  return NextResponse.redirect(url)
}
