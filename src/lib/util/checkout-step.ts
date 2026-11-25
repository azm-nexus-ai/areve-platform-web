import type { HttpTypes } from "@medusajs/types"

export const CHECKOUT_STEPS = ["address", "delivery", "payment", "review"] as const
export type CheckoutStep = typeof CHECKOUT_STEPS[number]

export function checkoutStep(cart: HttpTypes.StoreCart, requested?: string): CheckoutStep {
  const shipping = cart.shipping_address
  const hasCoverageAddress = shipping?.country_code !== "ng" || (!!shipping.province && (shipping.province.trim().toLowerCase() !== "lagos" || !!shipping.address_2?.trim()))
  const hasAddress = hasCoverageAddress && !!(cart.email && shipping?.first_name && shipping?.last_name && shipping?.address_1 && shipping?.city && shipping?.country_code && cart.billing_address?.address_1)
  const hasDelivery = !!cart.shipping_methods?.length
  const hasPayment = cart.payment_collection?.payment_sessions?.some((session) => ["pending", "authorized", "captured"].includes(session.status))
  const reachable = !hasAddress ? 0 : !hasDelivery ? 1 : !hasPayment ? 2 : 3
  const index = CHECKOUT_STEPS.indexOf(requested as CheckoutStep)
  return CHECKOUT_STEPS[index >= 0 && index <= reachable ? index : reachable]
}
