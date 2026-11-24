import { Suspense } from "react"
import { cataloguePage, catalogueSort } from "@lib/util/catalogue-query"
import { listCategories } from "@lib/data/categories"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import { HttpTypes } from "@medusajs/types"

export default async function CollectionTemplate({
  sortBy, collection, page, countryCode, filterCategoryId,
}: {
  sortBy?: SortOptions
  collection: HttpTypes.StoreCollection
  page?: string
  countryCode: string
  filterCategoryId?: string
}) {
  const categories = await listCategories()
  const topLevel = categories.filter((c) => !c.parent_category)
  const allowedFilter = topLevel.some((c) => c.id === filterCategoryId) ? filterCategoryId : undefined
  const sort = catalogueSort(sortBy)
  const pageNumber = cataloguePage(page)

  return (
    <main className="content-container py-8 small:py-12">
      <nav aria-label="Breadcrumb" className="mb-5 text-sm text-semantic-text-muted">
        <LocalizedClientLink href="/store" className="underline underline-offset-4">Shop</LocalizedClientLink>
        <span aria-current="page"> / {collection.title}</span>
      </nav>
      <h1 className="font-serif text-4xl text-semantic-text-primary">{collection.title}</h1>
      <div className="mt-10 flex flex-col gap-8 small:flex-row small:items-start">
        <RefinementList
          sortBy={sort}
          categoryId={allowedFilter}
          categoryOptions={topLevel.map((c) => ({ id: c.id, name: c.name }))}
        />
        <div className="min-w-0 flex-1">
          <Suspense fallback={<SkeletonProductGrid numberOfProducts={12} />}>
            <PaginatedProducts
              sortBy={sort}
              page={pageNumber}
              collectionId={collection.id}
              categoryId={allowedFilter}
              countryCode={countryCode}
                    />
          </Suspense>
        </div>
      </div>
    </main>
  )
}
