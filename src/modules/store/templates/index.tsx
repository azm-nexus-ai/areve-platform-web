import { Suspense } from "react"
import { cataloguePage, catalogueQuery, catalogueSort } from "@lib/util/catalogue-query"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

import PaginatedProducts from "./paginated-products"

const StoreTemplate = ({
  sortBy,
  page,
  countryCode,
  query,
}: {
  sortBy?: SortOptions
  page?: string
  countryCode: string
  query?: string
}) => {
  const pageNumber = cataloguePage(page)
  const sort = catalogueSort(sortBy)

  return (
    <main id="main-content"
      className="flex flex-col gap-8 small:flex-row small:items-start py-8 content-container"
      data-testid="category-container"
    >
      <RefinementList sortBy={sort} />
      <div className="w-full">
        <div className="mb-8">
          <p className="eyebrow mb-3 text-areve-walnut">The collection</p>
          <h1 className="font-serif text-4xl font-normal small:text-5xl" data-testid="store-page-title">{catalogueQuery(query) ? `Search results for “${catalogueQuery(query)}”` : "All products"}</h1>
          <p className="mt-4 text-sm font-light leading-7 text-areve-walnut">Objects shaped by material, form and a sense of place.</p>
          <form className="mt-7 flex gap-2" action={`/${countryCode}/store`}>
            <label htmlFor="catalogue-search" className="sr-only">Search the catalogue</label>
            <input id="catalogue-search" name="q" defaultValue={catalogueQuery(query)} maxLength={100} type="search" placeholder="Search products" className="min-h-12 min-w-0 flex-1 border border-areve-sand bg-transparent px-4 text-sm" />
            <button className="brand-button" type="submit">Search</button>
          </form>
        </div>
        <Suspense fallback={<SkeletonProductGrid />}>
          <PaginatedProducts
            sortBy={sort}
            page={pageNumber}
            countryCode={countryCode}
            query={query}
          />
        </Suspense>
      </div>
    </main>
  )
}

export default StoreTemplate
