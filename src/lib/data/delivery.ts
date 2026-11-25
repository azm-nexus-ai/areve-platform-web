"use server"

import { sdk } from "@lib/config"
import type { DeliveryCoverage } from "@lib/util/delivery-coverage"

export async function getDeliveryCoverage(): Promise<DeliveryCoverage | null> {
  return sdk.client.fetch<{ coverage: DeliveryCoverage | null }>("/store/areve/delivery", { cache: "no-store" })
    .then(({ coverage }) => coverage?.version === 1 && Array.isArray(coverage.lagos_areas) && Array.isArray(coverage.outside_lagos_states) ? coverage : null)
    .catch(() => null)
}
