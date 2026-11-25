import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import type { StorefrontContent } from "@lib/util/areve-config"
import GiftStudy from "../gift-study"

export default function Hero({ content }: { content: StorefrontContent["hero"] }) {
  const isDefault = ["Objects for considered living", "Heritage, Refined for Modern Living."].includes(content.headline)
  return (
    <section aria-label="AREVÉ home introduction" className="grid border-b border-semantic-border-subtle small:grid-cols-2">
      <div className="flex flex-col justify-center px-6 py-10 small:px-12 small:py-16 medium:pl-[max(48px,calc((100vw-1344px)/2))] medium:pr-16">
        <p className="eyebrow mb-7 text-areve-walnut">Culture, Refined.</p>
        <h1 className="max-w-xl font-serif text-[42px] font-normal leading-[1.12] tracking-[-0.025em] small:text-[52px] medium:text-[64px]">
          {isDefault ? <>Heritage, refined<br />for modern living.</> : content.headline}
        </h1>
        <p className="mb-9 mt-6 max-w-md text-[15px] font-light leading-7 text-areve-walnut small:text-base">
          {isDefault ? "Objects, spaces and everyday rituals. Inspired by Arewa heritage. Considered for the way we live today." : content.subheadline}
        </p>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          {content.cta_link.startsWith("/")
            ? <LocalizedClientLink href={content.cta_link} className="brand-button !gap-4 !px-5 !tracking-[0.12em] small:!px-7">{isDefault ? "Explore the collection" : content.cta_label}<span aria-hidden="true">↗</span></LocalizedClientLink>
            : <a href={content.cta_link} target="_blank" rel="noopener noreferrer" className="brand-button !gap-4 !px-5 !tracking-[0.12em] small:!px-7">{content.cta_label}<span aria-hidden="true">↗</span></a>}
          <LocalizedClientLink href="/world" className="brand-link !gap-3 !tracking-[0.1em] text-areve-walnut">Our story <span aria-hidden="true">→</span></LocalizedClientLink>
        </div>
        <p className="eyebrow mt-12 hidden text-areve-walnut small:block">Rooted in heritage. Made for today.</p>
      </div>
      {content.image_url ? <div className="relative min-h-[460px] small:min-h-[590px]"><Image src={content.image_url} alt="" fill priority sizes="(max-width: 1023px) 100vw, 50vw" className="object-cover" unoptimized /></div> : <GiftStudy />}
    </section>
  )
}
