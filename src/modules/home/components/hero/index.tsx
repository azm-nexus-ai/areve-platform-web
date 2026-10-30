import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const Hero = () => {
  return (
    <section className="w-full border-b border-ui-border-base bg-areve-ivory">
      <div className="content-container flex flex-col items-center justify-center text-center gap-8 py-24 small:py-32">
        <Image
          src="/areve-logo.png"
          alt="AREVÉ"
          width={240}
          height={185}
          priority
        />
        <p className="font-serif text-2xl small:text-3xl text-areve-ink max-w-xl leading-snug">
          Luxurious living &amp; home essentials, delivered across Lagos.
        </p>
        <LocalizedClientLink
          href="/store"
          className="inline-flex items-center justify-center px-8 py-3 bg-areve-bronze text-white uppercase tracking-[0.2em] text-sm hover:bg-areve-ink transition-colors"
        >
          Shop the collection
        </LocalizedClientLink>
      </div>
    </section>
  )
}

export default Hero
