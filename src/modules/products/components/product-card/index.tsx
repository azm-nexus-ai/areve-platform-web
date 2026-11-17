import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import { Text } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"

import PreviewPrice from "../product-preview/price"

type ProductCardProps = {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  region: HttpTypes.StoreRegion
}

export default async function ProductCard({
  product,
  isFeatured,
}: ProductCardProps) {
  const { cheapestPrice } = getProductPrice({ product })

  return (
    <LocalizedClientLink
      href={`/products/${product.handle}`}
      className="group block text-semantic-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-semantic-focus"
      aria-label={`View ${product.title}`}
    >
      <article data-testid="product-wrapper">
        <Thumbnail
          thumbnail={product.thumbnail}
          images={product.images}
          size="full"
          isFeatured={isFeatured}
          alt={product.title}
          sizes="(max-width: 1023px) 50vw, 25vw"
          className="!aspect-[4/5] rounded-none bg-semantic-surface-muted shadow-none transition-opacity duration-200 group-hover:opacity-90"
        />
        <div className="mt-3 flex items-start justify-between gap-3">
          <Text
            className="font-serif text-lg leading-6 text-semantic-text-primary"
            data-testid="product-title"
          >
            {product.title}
          </Text>
          <div className="shrink-0 text-sm text-semantic-text-primary">
            {cheapestPrice ? <PreviewPrice price={cheapestPrice} /> : null}
          </div>
        </div>
      </article>
    </LocalizedClientLink>
  )
}
