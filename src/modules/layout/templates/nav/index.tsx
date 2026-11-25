import { Suspense } from "react"
import { listCategories } from "@lib/data/categories"
import { listRegions } from "@lib/data/regions"
import { listLocales } from "@lib/data/locales"
import { getLocale } from "@lib/data/locale-actions"
import { getAreveConfig } from "@lib/data/areve"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import SearchOverlay from "@modules/layout/components/search-overlay"
import SideMenu from "@modules/layout/components/side-menu"
import StoreHeader from "@modules/layout/components/store-header"

export default async function Nav() {
  const [regions, locales, currentLocale, categories, config] = await Promise.all([
    listRegions().then((regions: StoreRegion[]) => regions),
    listLocales(),
    getLocale(),
    listCategories(),
    getAreveConfig(),
  ])
  const topLevelCategories = categories.filter((category) => !category.parent_category)
  const announcement = config.content.announcement
  const cartAndAccount = (
    <>
      <LocalizedClientLink
        className="hidden text-xs font-medium uppercase tracking-[0.08em] hover:text-semantic-text-accent small:inline-flex"
        href="/account"
        data-testid="nav-account-link"
      >
        Account
      </LocalizedClientLink>
      <Suspense fallback={
        <LocalizedClientLink className="text-xs font-medium uppercase tracking-[0.08em] hover:text-semantic-text-accent" href="/cart" data-testid="nav-cart-link">
          Cart (0)
        </LocalizedClientLink>
      }>
        <CartButton />
      </Suspense>
    </>
  )

  return (
    <div className="small:sticky small:inset-x-0 small:top-0 small:z-50">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-areve-ivory focus:p-4">Skip to content</a>
      <div className="bg-semantic-surface-inverse px-4 py-2 text-center text-semantic-text-inverse">
        {announcement.enabled ? (
          announcement.link ? (
            announcement.link.startsWith("/") ? (
              <LocalizedClientLink href={announcement.link} className="text-sm underline-offset-4 hover:underline">
                {announcement.text}
              </LocalizedClientLink>
            ) : (
              <a href={announcement.link} rel="noopener noreferrer" target="_blank" className="text-sm underline-offset-4 hover:underline">
                {announcement.text}
              </a>
            )
          ) : (
            <p className="text-sm">{announcement.text}</p>
          )
        ) : (
          <p className="text-[10px] font-medium uppercase tracking-[0.22em]">Rooted in heritage. Refined for today.</p>
        )}
      </div>
      <div className="sticky inset-x-0 top-0 z-50 small:static">
        <StoreHeader
          menu={<SideMenu regions={regions} locales={locales} currentLocale={currentLocale} categories={categories} />}
          searchControl={<SearchOverlay />}
          cart={cartAndAccount}
        />
      </div>
      {topLevelCategories.length > 0 && (
        <nav aria-label="Desktop product navigation" className="hidden border-b border-semantic-border-subtle bg-semantic-surface-canvas small:block">
          <div className="content-container flex min-h-11 items-center justify-center gap-8 overflow-x-auto text-xs font-medium uppercase tracking-[0.08em] text-semantic-text-primary">
            <LocalizedClientLink href="/store" className="whitespace-nowrap hover:text-semantic-text-accent">Shop all</LocalizedClientLink>
            {topLevelCategories.slice(0,5).map((category) => (
              <LocalizedClientLink key={category.id} href={`/categories/${category.handle}`} className="whitespace-nowrap hover:text-semantic-text-accent">
                {category.name}
              </LocalizedClientLink>
            ))}
            <LocalizedClientLink href="/world" className="whitespace-nowrap text-areve-walnut hover:underline underline-offset-4">The world of AREVÉ</LocalizedClientLink>
          </div>
        </nav>
      )}
    </div>
  )
}
