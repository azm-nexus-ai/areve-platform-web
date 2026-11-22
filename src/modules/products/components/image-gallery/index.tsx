import { HttpTypes } from "@medusajs/types"
import { Container } from "@medusajs/ui"
import Image from "next/image"

type ImageGalleryProps = { images: HttpTypes.StoreProductImage[] }

const ImageGallery = ({ images }: ImageGalleryProps) => (
  <div className="relative flex items-start">
    <div className="flex flex-1 flex-col gap-y-4 small:mx-16">
      {images.map((image, index) => (
        <Container
          key={image.id}
          className="relative aspect-[29/34] w-full overflow-hidden bg-ui-bg-subtle"
          id={image.id}
        >
          {!!image.url && (
            <Image
              src={image.url}
              priority={index <= 2}
              quality={75}
              className="absolute inset-0 rounded-rounded object-cover"
              alt={`Product image ${index + 1}`}
              fill
              sizes="(max-width: 576px) 280px, (max-width: 768px) 360px, (max-width: 992px) 480px, 800px"
            />
          )}
        </Container>
      ))}
    </div>
  </div>
)

export default ImageGallery
