import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { ReactNode } from "react"
import BrandMark from "@modules/common/components/brand-mark"

type StoreHeaderProps = {
  menu: ReactNode
  cart: ReactNode
  searchHref?: string
  searchControl?: ReactNode
}

export default function StoreHeader({
  menu,
  cart,
  searchHref = "/store",
  searchControl,
}: StoreHeaderProps) {
  return (
    <div className="border-b border-semantic-border-subtle bg-semantic-surface-canvas text-semantic-text-primary">
      <nav
        aria-label="Store navigation"
        className="content-container grid min-h-20 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3 small:min-h-24"
      >
        <div className="flex min-w-0 items-center gap-1">
          <div className="min-h-11 min-w-11">{menu}</div>
          {searchControl ?? (
            <LocalizedClientLink
              href={searchHref}
              className="inline-flex min-h-11 items-center px-3 text-xs font-medium uppercase tracking-[0.08em] hover:text-semantic-text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-semantic-focus"
            >
              Search
            </LocalizedClientLink>
          )}
        </div>

        <LocalizedClientLink
          href="/"
          className="inline-flex min-h-11 items-center justify-center py-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-semantic-focus"
          data-testid="nav-store-link"
        >
          <BrandMark />
        </LocalizedClientLink>

        <div className="flex min-h-11 min-w-0 items-center justify-end gap-4">
          {cart}
        </div>
      </nav>
    </div>
  )
}
