import { toWhatsAppNumber } from "./whatsapp"

export type StorefrontContent = {
  announcement: { enabled: boolean; text: string; link: string | null }
  hero: {
    headline: string
    subheadline: string
    cta_label: string
    cta_link: string
    image_url: string | null
  }
}

export type AreveConfig = {
  currency_code: string
  country_code: string
  free_delivery_threshold: number
  whatsapp_number: string | null
  support_email: string | null
  content: StorefrontContent
}

/** Mirrors the backend's StorefrontContent defaults until its PR is deployed. */
export const DEFAULT_STOREFRONT_CONTENT: StorefrontContent = {
  announcement: { enabled: false, text: "", link: null },
  hero: {
    headline: "Objects for considered living",
    subheadline: "Bedding, fragrance and gifts for unhurried homes.",
    cta_label: "Shop the collection",
    cta_link: "/store",
    image_url: null,
  },
}

export const AREVE_CONFIG_DEFAULTS: AreveConfig = {
  currency_code: "ngn",
  country_code: "ng",
  free_delivery_threshold: 300000,
  whatsapp_number: null,
  support_email: null,
  content: DEFAULT_STOREFRONT_CONTENT,
}

type Env = { NEXT_PUBLIC_WHATSAPP_NUMBER?: string; NEXT_PUBLIC_FREE_DELIVERY_THRESHOLD?: string }
type ApiConfig = Partial<Omit<AreveConfig, "content">> & {
  content?: {
    announcement?: Partial<StorefrontContent["announcement"]>
    hero?: Partial<StorefrontContent["hero"]>
  } | null
}

const safeLink = (value: unknown): value is string =>
  typeof value === "string" &&
  (/^\/(?!\/)[^\s]*$/.test(value) || /^https:\/\/[^\s]+$/.test(value))

export function resolveStorefrontContent(input: ApiConfig["content"]): StorefrontContent {
  const announcement = input?.announcement
  const hero = input?.hero
  return {
    announcement: {
      enabled: announcement?.enabled === true && typeof announcement.text === "string" && announcement.text.trim().length > 0,
      text: typeof announcement?.text === "string" ? announcement.text : "",
      link: safeLink(announcement?.link) ? announcement.link! : null,
    },
    hero: {
      headline: typeof hero?.headline === "string" && hero.headline.trim()
        ? hero.headline : DEFAULT_STOREFRONT_CONTENT.hero.headline,
      subheadline: typeof hero?.subheadline === "string"
        ? hero.subheadline : DEFAULT_STOREFRONT_CONTENT.hero.subheadline,
      cta_label: typeof hero?.cta_label === "string" && hero.cta_label.trim()
        ? hero.cta_label : DEFAULT_STOREFRONT_CONTENT.hero.cta_label,
      cta_link: safeLink(hero?.cta_link) ? hero.cta_link! : DEFAULT_STOREFRONT_CONTENT.hero.cta_link,
      image_url: typeof hero?.image_url === "string" && /^https:\/\/[^\s]+$/.test(hero.image_url)
        ? hero.image_url : null,
    },
  }
}

/** The API is the source of truth; env values only fill gaps. */
export function resolveAreveConfig(fromApi: ApiConfig | null | undefined, env: Env = {}): AreveConfig {
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
    content: resolveStorefrontContent(fromApi?.content),
  }
}

export function amountToFreeDelivery(itemTotal: number, config: Pick<AreveConfig, "free_delivery_threshold">) {
  return Math.max(0, config.free_delivery_threshold - (Number(itemTotal) || 0))
}
