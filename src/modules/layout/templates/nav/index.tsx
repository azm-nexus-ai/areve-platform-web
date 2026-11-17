import { Suspense } from "react"

import { listCategories } from "@lib/data/categories"
import { listRegions } from "@lib/data/regions"
import { listLocales } from "@lib/data/locales"
import { getLocale } from "@lib/data/locale-actions"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import DeliveryPromise from "@modules/common/components/delivery-promise"
import CartButton from "@modules/layout/components/cart-button"
import SearchOverlay from "@modules/layout/components/search-overlay"
import SideMenu from "@modules/layout/components/side-menu"
import StoreHeader from "@modules/layout/components/store-header"

export default async function Nav() {
  const [regions, locales, currentLocale, categories] = await Promise.all([
    listRegions().then((regions: StoreRegion[]) => regions),
    listLocales(),
    getLocale(),
    listCategories(),
  ])

  const topLevelCategories = categories.filter(
    (category) => !category.parent_category
  )

  const cartAndAccount = (
    <>
      <LocalizedClientLink
        className="hidden text-xs font-medium uppercase tracking-[0.08em] hover:text-semantic-text-accent small:inline-flex"
        href="/account"
        data-testid="nav-account-link"
      >
        Account
      </LocalizedClientLink>
      <Suspense
        fallback={
          <LocalizedClientLink
            className="text-xs font-medium uppercase tracking-[0.08em] hover:text-semantic-text-accent"
            href="/cart"
            data-testid="nav-cart-link"
          >
            Cart (0)
          </LocalizedClientLink>
        }
      >
        <CartButton />
      </Suspense>
    </>
  )

  return (
    <div className="sticky inset-x-0 top-0 z-50">
      <div className="bg-semantic-surface-inverse px-4 py-2 text-center">
        <DeliveryPromise className="!text-semantic-text-inverse" />
      </div>

      <StoreHeader
        menu={
          <SideMenu
            regions={regions}
            locales={locales}
            currentLocale={currentLocale}
            categories={categories}
          />
        }
        searchControl={<SearchOverlay />}
        cart={cartAndAccount}
      />

      {topLevelCategories.length > 0 && (
        <nav
          aria-label="Desktop product navigation"
          className="hidden border-b border-semantic-border-subtle bg-semantic-surface-canvas small:block"
        >
          <div className="content-container flex min-h-11 items-center justify-center gap-8 overflow-x-auto text-xs font-medium uppercase tracking-[0.08em] text-semantic-text-primary">
            <LocalizedClientLink
              href="/store"
              className="whitespace-nowrap hover:text-semantic-text-accent"
            >
              Shop all
            </LocalizedClientLink>
            {topLevelCategories.map((category) => (
              <LocalizedClientLink
                key={category.id}
                href={`/categories/${category.handle}`}
                className="whitespace-nowrap hover:text-semantic-text-accent"
              >
                {category.name}
              </LocalizedClientLink>
            ))}
          </div>
        </nav>
      )}
    </div>
  )
}
