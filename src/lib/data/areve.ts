"use server"

import { sdk } from "@lib/config"
import { resolveAreveConfig, type AreveConfig } from "@lib/util/areve-config"

/**
 * Shop settings from the API (GET /store/areve/config), cached for 10 minutes.
 * Always returns usable settings: if the API is down, storefront fallbacks are used.
 */
export const getAreveConfig = async (): Promise<AreveConfig> => {
  const fromApi = await sdk.client
    .fetch<{ config: AreveConfig }>(`/store/areve/config`, {
      method: "GET",
      next: { revalidate: 600, tags: ["areve-config"] },
    })
    .then(({ config }) => config)
    .catch(() => null)

  return resolveAreveConfig(fromApi, {
    NEXT_PUBLIC_WHATSAPP_NUMBER: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER,
    NEXT_PUBLIC_FREE_DELIVERY_THRESHOLD: process.env.NEXT_PUBLIC_FREE_DELIVERY_THRESHOLD,
  })
}
