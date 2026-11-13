"use server"

import { sdk } from "@lib/config"

export type AreveConfig = {
  currency_code: string
  country_code: string
  free_delivery_threshold: number
  whatsapp_number: string | null
  support_email: string | null
}

/** Shop settings from the API (GET /store/areve/config). Cached for 10 minutes. */
export const getAreveConfig = async (): Promise<AreveConfig | null> => {
  return sdk.client
    .fetch<{ config: AreveConfig }>(`/store/areve/config`, {
      method: "GET",
      next: { revalidate: 600, tags: ["areve-config"] },
    })
    .then(({ config }) => config)
    .catch(() => null) // The cart still works if this call fails.
}
