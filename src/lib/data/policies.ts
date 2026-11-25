"use server"
import { sdk } from "@lib/config"

export type PolicyKind = "delivery" | "returns" | "privacy" | "terms"
export type PublishedPolicy = { kind: PolicyKind; title: string; body: string; revision: number; published_at: string; review_only: boolean }
export async function getPolicy(kind: PolicyKind): Promise<{ policy: PublishedPolicy | null; unavailable: boolean }> {
  try {
    const { policy } = await sdk.client.fetch<{ policy: PublishedPolicy }>(`/store/areve/policies/${kind}`, { method: "GET", cache: "no-store" })
    return { policy, unavailable: false }
  } catch (error) { return { policy: null, unavailable: (error as { status?: number }).status !== 404 } }
}
