import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import type { StorefrontContent } from "@lib/util/areve-config"

type Props = { content: StorefrontContent["hero"] }

export default function Hero({ content }: Props) {
  const hasImage = Boolean(content.image_url)
  const buttonClasses = "inline-flex min-h-11 items-center justify-center bg-semantic-action-primary px-7 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-semantic-action-primaryText transition-colors hover:bg-semantic-surface-inverse focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-semantic-focus"

  return (
    <section aria-label="AREVÉ home introduction" className="relative w-full overflow-hidden bg-areve-sand">
      <div className="relative flex aspect-[4/5] min-h-[440px] items-center justify-center small:aspect-[16/9] small:min-h-[480px]">
        {content.image_url ? (
          <>
            <Image
              src={content.image_url}
              alt=""
              fill
              priority
              unoptimized
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/40" aria-hidden="true" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-areve-ivory via-areve-sand to-areve-ivory" aria-hidden="true" />
        )}
        <div className="content-container relative z-10 flex w-full flex-col items-center gap-6 px-6 text-center">
          <p className={`text-xs font-semibold uppercase tracking-[0.25em] ${hasImage ? "text-white" : "text-semantic-text-accent"}`}>AREVÉ</p>
          <h1 className={`max-w-3xl font-serif text-4xl leading-tight xsmall:text-5xl medium:text-6xl ${hasImage ? "text-white" : "text-semantic-text-primary"}`}>
            {content.headline}
          </h1>
          {content.subheadline && (
            <p className={`max-w-xl text-base leading-7 small:text-lg ${hasImage ? "text-white" : "text-semantic-text-muted"}`}>
              {content.subheadline}
            </p>
          )}
          {content.cta_link.startsWith("/") ? (
            <LocalizedClientLink href={content.cta_link} className={buttonClasses}>{content.cta_label}</LocalizedClientLink>
          ) : (
            <a href={content.cta_link} target="_blank" rel="noopener noreferrer" className={buttonClasses}>{content.cta_label}</a>
          )}
        </div>
      </div>
    </section>
  )
}
