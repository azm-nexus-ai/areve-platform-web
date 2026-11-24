import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { cataloguePage, catalogueQuery, catalogueSort } from "@lib/util/catalogue-query"
import ProductPreview from "@modules/products/components/product-preview"
import { Pagination } from "@modules/store/components/pagination"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

const PRODUCT_LIMIT = 12
export default async function PaginatedProducts({
  sortBy = "created_at", page, collectionId, categoryId, productsIds, countryCode,
  query,
}: {
  sortBy?: SortOptions
  page: number
  collectionId?: string
  categoryId?: string
  productsIds?: string[]
  countryCode: string
  query?: string
}) {
  const region = await getRegion(countryCode)
  if (!region) return <p className="py-12 text-semantic-text-muted">Products are unavailable for this region.</p>

  const requestedPage = cataloguePage(page)
  const queryParams = {
    limit: PRODUCT_LIMIT,
    order: catalogueSort(sortBy) === "title" ? "title" : "-created_at",
    ...(catalogueQuery(query) ? { q: catalogueQuery(query) } : {}),
    ...(collectionId ? { collection_id: [collectionId] } : {}),
    ...(categoryId ? { category_id: [categoryId] } : {}),
    ...(productsIds ? { id: productsIds } : {}),
  }
  let { response: { products: visible, count } } = await listProducts({
    regionId: region.id, queryParams, pageParam: requestedPage,
  })
  const totalPages = Math.ceil(count / PRODUCT_LIMIT)
  const safePage = Math.min(requestedPage, Math.max(totalPages, 1))
  if (safePage !== requestedPage) {
    const lastPage = await listProducts({ regionId: region.id, queryParams, pageParam: safePage })
    visible = lastPage.response.products
  }
  const firstIndex = (safePage - 1) * PRODUCT_LIMIT

  return (
    <div className="w-full">
      <p className="mb-6 text-sm text-semantic-text-muted" role="status">
        {count === 0 ? "0 products" : `Showing ${firstIndex + 1}–${firstIndex + visible.length} of ${count} products`}
      </p>
      {visible.length ? (
        <ul className="grid w-full grid-cols-2 gap-x-4 gap-y-10 small:grid-cols-3 medium:grid-cols-4 small:gap-x-6" data-testid="products-list">
          {visible.map((product) => <li key={product.id}><ProductPreview product={product} region={region} /></li>)}
        </ul>
      ) : (
        <div className="border border-semantic-border-subtle bg-semantic-surface-muted/40 px-6 py-14 text-center">
          <h2 className="font-serif text-2xl text-semantic-text-primary">No products found</h2>
          <p className="mt-3 text-sm text-semantic-text-muted">Try another category or search term.</p>
        </div>
      )}
      {totalPages > 1 && <Pagination data-testid="product-pagination" page={safePage} totalPages={totalPages} />}
    </div>
  )
}
