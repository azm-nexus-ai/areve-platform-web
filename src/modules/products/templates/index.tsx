import { Suspense } from "react"
import { notFound } from "next/navigation"
import { HttpTypes } from "@medusajs/types"
import { getAreveConfig } from "@lib/data/areve"
import DeliveryPromise from "@modules/common/components/delivery-promise"
import WhatsAppHelpLink from "@modules/common/components/whatsapp-help-link"
import ImageGallery from "@modules/products/components/image-gallery"
import ProductActions from "@modules/products/components/product-actions"
import ProductTabs from "@modules/products/components/product-tabs"
import RelatedProducts from "@modules/products/components/related-products"
import ProductInfo from "@modules/products/templates/product-info"
import SkeletonRelatedProducts from "@modules/skeletons/templates/skeleton-related-products"
import ProductActionsWrapper from "./product-actions-wrapper"

type Props = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
  images: HttpTypes.StoreProductImage[]
}

export default async function ProductTemplate({ product, region, countryCode, images }: Props) {
  if (!product?.id) notFound()
  const config = await getAreveConfig()

  return (
    <main id="main-content" className="pb-28 small:pb-0" data-testid="product-container">
      <div className="content-container grid gap-8 py-8 small:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] small:gap-12 small:py-14">
        <div className="min-w-0">
          <ImageGallery images={images} />
        </div>
        <div className="flex min-w-0 flex-col gap-7">
          <ProductInfo product={product} />
          <Suspense fallback={<ProductActions disabled product={product} region={region} />}>
            <ProductActionsWrapper id={product.id} region={region} />
          </Suspense>
          <div className="border-y border-semantic-border-subtle py-4">
            <DeliveryPromise />
          </div>
          <ProductTabs product={product} />
          <WhatsAppHelpLink phoneNumber={config.whatsapp_number} message={`Hello AREVÉ, I have a question about ${product.title}.`} />
        </div>
      </div>
      <section className="content-container my-14 small:my-24" aria-label="Related products" data-testid="related-products-container">
        <Suspense fallback={<SkeletonRelatedProducts />}>
          <RelatedProducts product={product} countryCode={countryCode} />
        </Suspense>
      </section>
    </main>
  )
}
