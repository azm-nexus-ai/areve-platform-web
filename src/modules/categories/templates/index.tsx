import { notFound } from "next/navigation"
import { Suspense } from "react"
import { cataloguePage, catalogueSort } from "@lib/util/catalogue-query"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"

export default function CategoryTemplate({
  category, sortBy, page, countryCode, filterCategoryId,
}: {
  category: HttpTypes.StoreProductCategory
  sortBy?: SortOptions
  page?: string
  countryCode: string
  filterCategoryId?: string
}) {
  if (!category || !countryCode) notFound()
  const sort = catalogueSort(sortBy)
  const pageNumber = cataloguePage(page)
  const parents: HttpTypes.StoreProductCategory[] = []
  let parent = category.parent_category
  while (parent) { parents.unshift(parent); parent = parent.parent_category }
  const childCategories = category.category_children || []
  const allowedFilter = childCategories.some((c) => c.id === filterCategoryId) ? filterCategoryId : undefined

  return (
    <main className="content-container py-8 small:py-12" data-testid="category-container">
      <nav aria-label="Breadcrumb" className="mb-5 text-sm text-semantic-text-muted">
        <LocalizedClientLink href="/store" className="underline underline-offset-4">Shop</LocalizedClientLink>
        {parents.map((p) => <span key={p.id}> / <LocalizedClientLink href={`/categories/${p.handle}`} className="underline underline-offset-4">{p.name}</LocalizedClientLink></span>)}
        <span aria-current="page"> / {category.name}</span>
      </nav>
      <h1 className="font-serif text-4xl text-semantic-text-primary" data-testid="category-page-title">{category.name}</h1>
      {category.description && <p className="mt-4 max-w-3xl text-base leading-7 text-semantic-text-muted">{category.description}</p>}
      <div className="mt-10 flex flex-col gap-8 small:flex-row small:items-start">
        <RefinementList
          sortBy={sort}
          categoryId={allowedFilter}
          categoryOptions={childCategories.map((c) => ({ id: c.id, name: c.name }))}
          data-testid="sort-by-container"
        />
        <div className="min-w-0 flex-1">
          <Suspense fallback={<SkeletonProductGrid numberOfProducts={12} />}>
            <PaginatedProducts
              sortBy={sort}
              page={pageNumber}
              categoryId={allowedFilter || category.id}
              countryCode={countryCode}
                    />
          </Suspense>
        </div>
      </div>
    </main>
  )
}
