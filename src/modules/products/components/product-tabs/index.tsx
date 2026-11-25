"use client"

import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Accordion from "./accordion"

type Props = { product: HttpTypes.StoreProduct }

const asText = (value: unknown): string | null =>
  typeof value === "string" && value.trim()
    ? value
    : typeof value === "number" && Number.isFinite(value)
      ? String(value)
      : null

export default function ProductTabs({ product }: Props) {
  const metadata = product.metadata || {}
  const fields = [
    { label: "Care instructions", value: asText(metadata.care_instructions) },
    { label: "What's in the box", value: asText(metadata.whats_in_the_box) },
    { label: "Scent notes", value: asText(metadata.scent_notes) },
    { label: "Thread count", value: asText(metadata.thread_count) },
    { label: "Delivery note", value: asText(metadata.delivery_note) },
  ].filter((item): item is { label: string; value: string } => Boolean(item.value))

  return (
    <div className="w-full text-semantic-text-primary">
      <Accordion type="multiple">
        {(product.material || fields.length > 0 || metadata.gift_ready === true) && <Accordion.Item title="Details & care" headingSize="medium" value="details">
          <div className="space-y-4 py-5 text-sm leading-6">
            {product.material && <p><strong>Material:</strong> {product.material}</p>}
            {metadata.gift_ready === true && <p>Gift-ready</p>}
            {fields.map(({ label, value }) => (
              <div key={label}>
                <strong>{label}</strong>
                <p className="whitespace-pre-line text-semantic-text-muted">{value}</p>
              </div>
            ))}
          </div>
        </Accordion.Item>}
        <Accordion.Item title="Delivery & returns" headingSize="medium" value="delivery">
          <div className="space-y-3 py-5 text-sm leading-6 text-semantic-text-muted">
            <p>Delivery options and fees are confirmed at checkout. Please check the current information before placing an order.</p>
            <p>
              <LocalizedClientLink href="/delivery" className="underline underline-offset-4">Delivery information</LocalizedClientLink>
              {" · "}
              <LocalizedClientLink href="/returns" className="underline underline-offset-4">Returns information</LocalizedClientLink>
            </p>
          </div>
        </Accordion.Item>
      </Accordion>
    </div>
  )
}
