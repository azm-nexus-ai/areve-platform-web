import { listProducts } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ProductCard from "@modules/products/components/product-card"

type Props = { collection: HttpTypes.StoreCollection; region: HttpTypes.StoreRegion }

export default async function ProductRail({ collection, region }: Props) {
  const { response: { products } } = await listProducts({
    regionId: region.id,
    queryParams: { collection_id: collection.id, limit: 4 },
  })

  if (!products.length) return null

  return (
    <section className="content-container py-12 small:py-20" aria-labelledby={`collection-${collection.id}`}>
      <div className="mb-8 flex items-end justify-between gap-4">
        <h2 id={`collection-${collection.id}`} className="font-serif text-3xl text-semantic-text-primary small:text-4xl">{collection.title}</h2>
        <LocalizedClientLink href={`/collections/${collection.handle}`} className="inline-flex min-h-11 items-center text-sm font-semibold text-semantic-text-accent underline underline-offset-4">
          View all
        </LocalizedClientLink>
      </div>
      <ul className="grid grid-cols-2 gap-x-4 gap-y-10 small:grid-cols-4 small:gap-x-6">
        {products.map((product) => (
          <li key={product.id}><ProductCard product={product} region={region} isFeatured /></li>
        ))}
      </ul>
    </section>
  )
}
