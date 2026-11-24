import { placeOrder } from "@lib/data/cart"
import { NextRequest, NextResponse } from "next/server"

/** Paystack returns here. The backend verifies the payment before completing the cart. */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ countryCode: string }> }
) {
  const { countryCode } = await params
  const status = request.nextUrl.searchParams.get("status")
  if (status === "cancelled" || status === "abandoned" || status === "failed") {
    const url = new URL(`/${countryCode}/checkout`, request.url)
    url.searchParams.set("step", "review")
    url.searchParams.set("payment", status)
    return NextResponse.redirect(url)
  }

  // placeOrder() redirects to the confirmation page only after the backend accepts the order.
  const cart = await placeOrder()
  const url = new URL(`/${countryCode}/checkout`, request.url)
  url.searchParams.set("step", "review")
  url.searchParams.set("payment", cart ? "not_confirmed" : "error")
  return NextResponse.redirect(url)
}
