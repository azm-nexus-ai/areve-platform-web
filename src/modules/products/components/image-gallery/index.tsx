"use client"

import { HttpTypes } from "@medusajs/types"
import Image from "next/image"
import { useState } from "react"

type Props = { images: HttpTypes.StoreProductImage[]; title: string }

export default function ImageGallery({ images, title }: Props) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [failed, setFailed] = useState<string[]>([])
  const selected = images[selectedIndex] || images[0]

  if (!selected?.url) {
    return (
      <div className="flex aspect-[4/5] w-full items-center justify-center bg-semantic-surface-muted text-sm text-semantic-text-muted" role="img" aria-label="Product image unavailable">
        Image unavailable
      </div>
    )
  }

  return (
    <div aria-label="Product gallery">
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-semantic-surface-muted">
        {failed.includes(selected.url) ? <div role="img" aria-label={`${title}: image unavailable`} className="flex h-full items-center justify-center p-8 text-sm text-semantic-text-muted">Image unavailable</div> : <Image
          src={selected.url}
          alt={`${title} — view ${selectedIndex + 1} of ${images.length}`}
          onError={() => setFailed(current => current.includes(selected.url) ? current : [...current, selected.url])}
          fill
          priority
          fetchPriority="high"
          quality={75}
          sizes="(max-width: 1023px) 100vw, 55vw"
          className="object-cover"
        />}
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
              {image.url && !failed.includes(image.url) ? <Image src={image.url} alt="" fill quality={75} sizes="(max-width: 1023px) 20vw, 100px" onError={() => setFailed(current => current.includes(image.url) ? current : [...current, image.url])} className="object-cover" /> : <span aria-hidden="true" className="flex h-full items-center justify-center bg-semantic-surface-muted p-1 text-xs text-semantic-text-muted">View {index + 1}</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
