import { placeOrder, retrieveCart } from "@lib/data/cart"
import { NextRequest, NextResponse } from "next/server"
import { isRedirectError } from "next/dist/client/components/redirect-error"

/** Paystack returns here. The backend verifies the payment before completing the cart. */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ countryCode: string }> }
) {
  const { countryCode: requestedCountry } = await params
  const countryCode = /^[a-z]{2}$/.test(requestedCountry) ? requestedCountry : "ng"
  const status = request.nextUrl.searchParams.get("status")
  const retry = (payment: string) => {
    const url = new URL(`/${countryCode}/checkout`, request.url)
    url.searchParams.set("step", "review")
    url.searchParams.set("payment", payment)
    return NextResponse.redirect(url)
  }
  if (status === "cancelled" || status === "abandoned" || status === "failed") return retry(status)

  try {
    const cart = await retrieveCart()
    if (!cart) {
      // Repeated callback after successful cookie cleanup, expired session, or another browser.
      return NextResponse.redirect(new URL(`/${countryCode}/cart?payment=session_missing`, request.url))
    }
    const reference = request.nextUrl.searchParams.get("reference") || request.nextUrl.searchParams.get("trxref")
    const matchingSession = cart.payment_collection?.payment_sessions?.some((session) =>
      session.provider_id === "pp_paystack_paystack" && session.data?.paystackTxRef === reference
    )
    if (!reference || !matchingSession) return retry("not_confirmed")
    // The backend independently verifies Paystack, amount, currency and session.
    await placeOrder()
    return retry("not_confirmed")
  } catch (error) {
    if (isRedirectError(error)) throw error
    return retry("error")
  }
}
