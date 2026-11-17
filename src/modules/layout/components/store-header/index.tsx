import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { ReactNode } from "react"

type StoreHeaderProps = {
  menu: ReactNode
  cart: ReactNode
  searchHref: string
}

export default function StoreHeader({
  menu,
  cart,
  searchHref,
}: StoreHeaderProps) {
  return (
    <header className="border-b border-semantic-border-subtle bg-semantic-surface-canvas text-semantic-text-primary">
      <nav
        aria-label="Store navigation"
        className="content-container grid min-h-16 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3"
      >
        <div className="flex min-w-0 items-center gap-1">
          <div className="min-h-11 min-w-11">{menu}</div>
          <LocalizedClientLink
            href={searchHref}
            className="inline-flex min-h-11 items-center px-3 text-xs font-medium uppercase tracking-[0.08em] hover:text-semantic-text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-semantic-focus"
          >
            Search
          </LocalizedClientLink>
        </div>

        <LocalizedClientLink
          href="/"
          className="font-serif text-2xl uppercase tracking-[0.28em] hover:text-semantic-text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-semantic-focus"
          data-testid="nav-store-link"
        >
          AREVÉ
        </LocalizedClientLink>

        <div className="flex min-h-11 min-w-0 items-center justify-end">
          {cart}
        </div>
      </nav>
    </header>
  )
}
