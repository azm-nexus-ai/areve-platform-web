"use client"

import { HttpTypes } from "@medusajs/types"
import Image from "next/image"
import { useState } from "react"

type Props = { images: HttpTypes.StoreProductImage[] }

export default function ImageGallery({ images }: Props) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const selected = images[selectedIndex] || images[0]

  if (!selected?.url) {
    return (
      <div className="flex aspect-[4/5] w-full items-center justify-center bg-semantic-surface-muted text-sm text-semantic-text-muted" role="img" aria-label="Product image unavailable">
        Product image coming soon
      </div>
    )
  }

  return (
    <div aria-label="Product gallery">
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-semantic-surface-muted">
        <Image
          src={selected.url}
          alt={`Product image ${selectedIndex + 1} of ${images.length}`}
          fill
          priority
          quality={75}
          sizes="(max-width: 1023px) 100vw, 55vw"
          className="object-cover"
        />
      </div>
      {images.length > 1 && (
        <div className="mt-3 grid grid-cols-5 gap-2" role="group" aria-label="Choose a product image">
          {images.map((image, index) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setSelectedIndex(index)}
              aria-label={`Show product image ${index + 1}`}
              aria-pressed={selectedIndex === index}
              className={`relative aspect-[4/5] min-h-11 overflow-hidden border-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-semantic-focus ${selectedIndex === index ? "border-semantic-border-strong" : "border-transparent"}`}
            >
              {image.url && <Image src={image.url} alt="" fill quality={75} sizes="(max-width: 1023px) 20vw, 100px" className="object-cover" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
