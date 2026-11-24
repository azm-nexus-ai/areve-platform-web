import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type Props = { product: HttpTypes.StoreProduct }

export default function ProductInfo({ product }: Props) {
  return (
    <div id="product-info">
      {product.collection && (
        <LocalizedClientLink
          href={`/collections/${product.collection.handle}`}
          className="inline-flex min-h-11 items-center text-sm text-semantic-text-accent underline underline-offset-4"
        >
          {product.collection.title}
        </LocalizedClientLink>
      )}
      <h1 className="font-serif text-3xl leading-tight text-semantic-text-primary small:text-4xl" data-testid="product-title">
        {product.title}
      </h1>
      {product.description && (
        <p className="mt-5 whitespace-pre-line text-base leading-7 text-semantic-text-muted" data-testid="product-description">
          {product.description}
        </p>
      )}
    </div>
  )
}
