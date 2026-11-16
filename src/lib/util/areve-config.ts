import { toWhatsAppNumber } from "./whatsapp"

export type AreveConfig = {
  currency_code: string
  country_code: string
  free_delivery_threshold: number
  whatsapp_number: string | null
  support_email: string | null
}

/** Used when the API is unreachable, so pages still render. */
export const AREVE_CONFIG_DEFAULTS: AreveConfig = {
  currency_code: "ngn",
  country_code: "ng",
  free_delivery_threshold: 300000,
  whatsapp_number: null,
  support_email: null,
}

type Env = { NEXT_PUBLIC_WHATSAPP_NUMBER?: string; NEXT_PUBLIC_FREE_DELIVERY_THRESHOLD?: string }

/**
 * Combines the API's shop settings with storefront fallbacks.
 * The API is the source of truth; env values only fill gaps.
 */
export function resolveAreveConfig(fromApi: Partial<AreveConfig> | null | undefined, env: Env = {}): AreveConfig {
  const envThreshold = Number(env.NEXT_PUBLIC_FREE_DELIVERY_THRESHOLD)
  const apiThreshold = Number(fromApi?.free_delivery_threshold)
  const threshold = Number.isFinite(apiThreshold) && apiThreshold > 0
    ? apiThreshold
    : Number.isFinite(envThreshold) && envThreshold > 0
      ? envThreshold
      : AREVE_CONFIG_DEFAULTS.free_delivery_threshold

  return {
    currency_code: fromApi?.currency_code || AREVE_CONFIG_DEFAULTS.currency_code,
    country_code: fromApi?.country_code || AREVE_CONFIG_DEFAULTS.country_code,
    free_delivery_threshold: threshold,
    whatsapp_number:
      toWhatsAppNumber(fromApi?.whatsapp_number) ?? toWhatsAppNumber(env.NEXT_PUBLIC_WHATSAPP_NUMBER),
    support_email: fromApi?.support_email || null,
  }
}

/** How much more the customer needs to spend for free Lagos delivery (0 when already free). */
export function amountToFreeDelivery(itemTotal: number, config: Pick<AreveConfig, "free_delivery_threshold">) {
  return Math.max(0, config.free_delivery_threshold - (Number(itemTotal) || 0))
}
