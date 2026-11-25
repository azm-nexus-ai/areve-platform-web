import { placeOrder, retrieveCart } from "@lib/data/cart"
import { NextRequest, NextResponse } from "next/server"
import { isRedirectError } from "next/dist/client/components/redirect-error"

// A relative Location retains the browser's origin. Next's reconstructed
// request URL can normalize loopback hosts or use an internal proxy hostname.
const redirectLocally = (path: string) => new NextResponse(null, { status: 303, headers: { Location: path, "Cache-Control": "no-store" } })

/** Paystack returns here. The backend verifies the payment before completing the cart. */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ countryCode: string }> }
) {
  const { countryCode: requestedCountry } = await params
  const countryCode = /^[a-z]{2}$/.test(requestedCountry) ? requestedCountry : "ng"
  const status = request.nextUrl.searchParams.get("status")
  const retry = (payment: string) => {
    const query = new URLSearchParams({ step: "review", payment })
    return redirectLocally(`/${countryCode}/checkout?${query}`)
  }
  if (status === "cancelled" || status === "abandoned" || status === "failed") return retry(status)

  try {
    const cart = await retrieveCart()
    if (!cart) {
      // Repeated callback after successful cookie cleanup, expired session, or another browser.
      return redirectLocally(`/${countryCode}/cart?payment=session_missing`)
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
