import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { getProductPrice } from "@lib/util/get-product-price"
import { sortProducts } from "@lib/util/sort-products"
import ProductPreview from "@modules/products/components/product-preview"
import { Pagination } from "@modules/store/components/pagination"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

const PRODUCT_LIMIT = 12
const MAX_LOADED_PRODUCTS = 100

function parsePrice(value?: string): number | null {
  if (!value || !/^\d+(?:\.\d+)?$/.test(value)) return null
  const price = Number(value)
  return Number.isFinite(price) && price >= 0 ? price : null
}

export default async function PaginatedProducts({
  sortBy = "created_at", page, collectionId, categoryId, productsIds, countryCode,
  minPrice, maxPrice,
}: {
  sortBy?: SortOptions
  page: number
  collectionId?: string
  categoryId?: string
  productsIds?: string[]
  countryCode: string
  minPrice?: string
  maxPrice?: string
}) {
  const region = await getRegion(countryCode)
  if (!region) return <p className="py-12 text-semantic-text-muted">Products are unavailable for this region.</p>

  const queryParams = {
    limit: MAX_LOADED_PRODUCTS,
    ...(collectionId ? { collection_id: [collectionId] } : {}),
    ...(categoryId ? { category_id: [categoryId] } : {}),
    ...(productsIds ? { id: productsIds } : {}),
  }
  const { response: { products, count } } = await listProducts({
    regionId: region.id, queryParams,
  })

  const min = parsePrice(minPrice)
  const max = parsePrice(maxPrice)
  const filtered = products.filter((product) => {
    if (min === null && max === null) return true
    const price = getProductPrice({ product }).cheapestPrice?.calculated_price_number
    if (typeof price !== "number" || !Number.isFinite(price)) return false
    return (min === null || price >= min) && (max === null || price <= max)
  })
  const sorted = sortProducts([...filtered], sortBy)
  const totalPages = Math.ceil(sorted.length / PRODUCT_LIMIT)
  const safePage = Math.min(Math.max(Number.isFinite(page) ? page : 1, 1), Math.max(totalPages, 1))
  const firstIndex = (safePage - 1) * PRODUCT_LIMIT
  const visible = sorted.slice(firstIndex, firstIndex + PRODUCT_LIMIT)

  return (
    <div className="w-full">
      <p className="mb-6 text-sm text-semantic-text-muted" role="status">
        {sorted.length === 0 ? "0 products" : `Showing ${firstIndex + 1}–${firstIndex + visible.length} of ${sorted.length} products`}
      </p>
      {count > MAX_LOADED_PRODUCTS && (
        <p className="mb-5 text-sm text-semantic-text-muted">
          Showing the first {MAX_LOADED_PRODUCTS} products. More catalogue results will be available as filtering is expanded.
        </p>
      )}
      {visible.length ? (
        <ul className="grid w-full grid-cols-2 gap-x-4 gap-y-10 small:grid-cols-3 medium:grid-cols-4 small:gap-x-6" data-testid="products-list">
          {visible.map((product) => <li key={product.id}><ProductPreview product={product} region={region} /></li>)}
        </ul>
      ) : (
        <div className="border border-semantic-border-subtle bg-semantic-surface-muted/40 px-6 py-14 text-center">
          <h2 className="font-serif text-2xl text-semantic-text-primary">No products found</h2>
          <p className="mt-3 text-sm text-semantic-text-muted">Try another category or price range.</p>
        </div>
      )}
      {totalPages > 1 && <Pagination data-testid="product-pagination" page={safePage} totalPages={totalPages} />}
    </div>
  )
}
