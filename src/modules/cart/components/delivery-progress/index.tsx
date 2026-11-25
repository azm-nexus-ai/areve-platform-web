import { amountToFreeDelivery, type AreveConfig } from "@lib/util/areve-config"
import { convertToLocale } from "@lib/util/money"

type Props = { itemTotal: number; config: Pick<AreveConfig, "currency_code" | "free_delivery_threshold"> }

export default function DeliveryProgress({ itemTotal, config }: Props) {
  const threshold = config.free_delivery_threshold
  if (!(threshold > 0)) return null
  const safeTotal = Math.max(0, Number(itemTotal) || 0)
  const remaining = amountToFreeDelivery(safeTotal, config)
  const percentage = Math.min(100, Math.max(0, Math.round((safeTotal / threshold) * 100)))
  const formatted = convertToLocale({
    amount: remaining,
    currency_code: config.currency_code,
    locale: "en-NG",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })

  return (
    <section aria-label="Free Lagos delivery progress" className="border border-semantic-border-subtle bg-semantic-surface-muted/40 p-5">
      <p className="text-sm font-semibold text-semantic-text-primary">
        {remaining === 0 ? "Free delivery threshold reached for eligible Lagos areas." : `${formatted} away from free delivery in eligible Lagos areas.`}
      </p>
      <div
        className="mt-3 h-2 w-full overflow-hidden rounded-full bg-semantic-border-subtle"
        role="progressbar"
        aria-label="Progress toward free Lagos delivery"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percentage}
      >
        <div className="h-full bg-semantic-action-primary" style={{ width: `${percentage}%` }} />
      </div>
      <p className="mt-2 text-xs text-semantic-text-muted">Applies to eligible Lagos deliveries. Final shipping options appear at checkout.</p>
    </section>
  )
}
