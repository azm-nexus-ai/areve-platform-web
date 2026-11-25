import { listProducts } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"
import ProductCard from "@modules/products/components/product-card"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type Props = { region: HttpTypes.StoreRegion }

export default async function NewIn({ region }: Props) {
  const { response: { products: latest } } = await listProducts({
    regionId: region.id,
    // Sort before pagination: the newest products might not be in the first unsorted eight.
    queryParams: { limit: 4, order: "-created_at" },
  })

  if (!latest.length) return null

  return (
    <section className="content-container py-14 small:py-20" aria-labelledby="new-in-heading">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-semantic-text-accent">The latest edit</p>
          <h2 id="new-in-heading" className="font-serif text-3xl text-semantic-text-primary small:text-[40px]">Objects for everyday rituals</h2>
        </div>
        <LocalizedClientLink href="/store" className="inline-flex min-h-11 items-center text-sm font-medium text-semantic-text-accent underline underline-offset-4">
          Shop all
        </LocalizedClientLink>
      </div>
      <ul className="grid grid-cols-2 gap-x-4 gap-y-10 small:grid-cols-4 small:gap-x-6">
        {latest.map((product) => (
          <li key={product.id}><ProductCard product={product} region={region} isFeatured /></li>
        ))}
      </ul>
    </section>
  )
}
