import { ReactNode } from "react"

export type TrustStripItem = {
  label: string
  detail: ReactNode
}

type TrustStripProps = {
  items: TrustStripItem[]
  ariaLabel?: string
}

export default function TrustStrip({
  items,
  ariaLabel = "Shopping assurances",
}: TrustStripProps) {
  if (items.length === 0) {
    return null
  }

  return (
    <aside
      aria-label={ariaLabel}
      className="border-y border-semantic-border-subtle bg-semantic-surface-muted/60 px-5 py-2 text-semantic-text-primary"
    >
      <ul className="content-container grid grid-cols-1 divide-y divide-semantic-border-strong/20 p-0 small:grid-cols-3 small:divide-x small:divide-y-0">
        {items.map((item) => (
          <li
            key={item.label}
            className="flex min-h-11 items-center justify-between gap-4 py-3 small:block small:px-5 small:text-center"
          >
            <strong className="text-xs font-semibold">{item.label}</strong>
            <div className="text-right text-xs text-semantic-text-muted small:mt-1 small:text-center">
              {item.detail}
            </div>
          </li>
        ))}
      </ul>
    </aside>
  )
}
