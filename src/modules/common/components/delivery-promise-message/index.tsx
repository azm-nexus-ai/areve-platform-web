import { amountToFreeDelivery, type AreveConfig } from "@lib/util/areve-config"
import { convertToLocale } from "@lib/util/money"
import { clx } from "@medusajs/ui"

type Props = {
  config: Pick<AreveConfig, "currency_code" | "free_delivery_threshold">
  itemTotal?: number
  className?: string
}

/** Presentational: safe to render from client components, with config supplied by the caller. */
export default function DeliveryPromiseMessage({ config, itemTotal = 0, className }: Props) {
  const safeItemTotal = Math.max(0, Number(itemTotal) || 0)
  const remaining = amountToFreeDelivery(safeItemTotal, config)
  const formatAmount = (amount: number) =>
    convertToLocale({
      amount,
      currency_code: config.currency_code,
      locale: "en-NG",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })

  const message = remaining === 0 && safeItemTotal >= config.free_delivery_threshold
    ? "Free Lagos delivery unlocked."
    : safeItemTotal > 0
      ? `${formatAmount(remaining)} away from free Lagos delivery.`
      : `Free Lagos delivery over ${formatAmount(config.free_delivery_threshold)}.`

  return (
    <p
      className={clx("text-sm leading-5 text-semantic-text-muted", className)}
      data-testid="delivery-promise"
      data-free-delivery-threshold={config.free_delivery_threshold}
    >
      {message}
    </p>
  )
}
