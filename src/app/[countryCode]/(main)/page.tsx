import { Metadata } from "next"
import { getAreveConfig } from "@lib/data/areve"
import { listCollections } from "@lib/data/collections"
import { listCategories } from "@lib/data/categories"
import { getRegion } from "@lib/data/regions"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Hero from "@modules/home/components/hero"
import NewIn from "@modules/home/components/new-in"
import Image from "next/image"

export const metadata: Metadata = {
  title: "Heritage, Refined for Modern Living",
  description: "Discover the world of AREVÉ. Home essentials and thoughtful gifts inspired by Arewa heritage, refined for modern living.",
}

const rituals = [
  { word: "Rest", detail: "A softer beginning. A slower end.", query: /bed|bath/i, href: "/store", shape: "linen" },
  { word: "Gather", detail: "Objects that make room for togetherness.", query: /table|d.cor/i, href: "/store", shape: "vessel" },
  { word: "Give", detail: "For someone worth remembering.", query: /gift/i, href: "/store", shape: "gift" },
]

export default async function Home({ params }: { params: Promise<{ countryCode: string }> }) {
  const { countryCode } = await params
  const [region, { collections }, categories, config] = await Promise.all([
    getRegion(countryCode), listCollections({ fields: "id,handle,title" }), listCategories(), getAreveConfig(),
  ])
  const topCategories = categories.filter(category => !category.parent_category)
  return (
    <main id="main-content">
      <Hero content={config.content.hero} />
      <section className="content-container grid gap-8 py-16 small:grid-cols-[1fr_2fr] small:gap-16 small:py-24" aria-labelledby="introduction-title">
        <p className="eyebrow text-areve-walnut">The world of AREVÉ</p>
        <div>
          <h2 id="introduction-title" className="max-w-3xl font-serif text-3xl leading-[1.3] small:text-[38px]">Some things become meaningful<br className="hidden small:block" /> because they become part of our lives.</h2>
          <div className="mt-8 flex flex-col gap-6 small:flex-row small:items-end small:justify-between">
            <p className="max-w-lg text-sm font-light leading-7 text-areve-walnut">Inspired by the architecture, craft and hospitality of Arewa. A contemporary perspective on the objects we bring home, and the moments we make our own.</p>
            <LocalizedClientLink href="/world" className="brand-link shrink-0 self-start text-areve-walnut">Discover our story <span aria-hidden="true">↗</span></LocalizedClientLink>
          </div>
        </div>
      </section>
      <div className="border-y border-areve-sand bg-white/30">{region && <NewIn region={region} />}</div>
      <section id="collections" className="content-container py-16 small:py-24" aria-labelledby="rituals-heading">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div><p className="eyebrow mb-3 text-areve-walnut">The art of living</p><h2 id="rituals-heading" className="font-serif text-3xl small:text-[40px]">Everyday, considered.</h2></div>
          <LocalizedClientLink href="/store" className="brand-link text-areve-walnut">Explore all objects <span aria-hidden="true">↗</span></LocalizedClientLink>
        </div>
        <ul className="grid gap-8 small:grid-cols-3">
          {rituals.map((ritual, index) => {
            const category = topCategories.find(item => ritual.query.test(item.name))
            return <li key={ritual.word}><LocalizedClientLink href={category ? `/categories/${category.handle}` : ritual.href} className="group block">
              <div className="relative aspect-[5/4] overflow-hidden bg-areve-sand/60">
                <Image src={`/brand/study-${ritual.shape}.svg`} alt="" fill sizes="(max-width:1023px) 100vw, 33vw" className="object-cover transition-transform duration-700 motion-safe:group-hover:scale-[1.035]" />
                <span className="eyebrow absolute left-5 top-5 text-areve-walnut">0{index + 1}</span>
              </div>
              <div className="mt-5 flex items-center justify-between"><h3 className="font-serif text-3xl">{ritual.word}</h3><span aria-hidden="true">↗</span></div>
              <p className="mt-2 text-sm font-light leading-6 text-areve-walnut">{ritual.detail}</p>
            </LocalizedClientLink></li>
          })}
        </ul>
        {collections.length > 0 && <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-areve-sand pt-6"><span className="eyebrow text-areve-walnut">Collections</span>{collections.slice(0,5).map(collection => <LocalizedClientLink key={collection.id} href={`/collections/${collection.handle}`} className="inline-flex min-h-11 items-center border-b border-transparent text-sm hover:border-areve-walnut">{collection.title} <span className="ml-4" aria-hidden="true">↗</span></LocalizedClientLink>)}</div>}
      </section>
      <section className="relative overflow-hidden bg-areve-botanical py-16 text-areve-ivory small:py-24" aria-labelledby="heritage-heading">
        <div className="content-container relative grid items-center gap-12 small:grid-cols-2 small:gap-24">
          <div className="relative flex aspect-square max-h-[420px] items-center justify-center border border-areve-ivory/20">
            <div className="absolute inset-5 bg-[url('/brand/pattern-arch.svg')] bg-[length:100px_80px] opacity-[0.08]" aria-hidden="true" />
            <Image src="/brand/icon-warm-ivory.svg" width={663} height={588} alt="" className="relative h-auto w-32 small:w-44" />
          </div>
          <div><p className="eyebrow mb-6 text-areve-sand">Rooted in heritage</p><h2 id="heritage-heading" className="font-serif text-4xl leading-[1.15] small:text-5xl">Culture, expressed<br />through design.</h2><p className="mt-6 max-w-md text-sm font-light leading-7 text-areve-ivory/90">An arch. A woven line. The warmth of an invitation. We look to heritage for meaning, then give it room to become something new.</p><LocalizedClientLink href="/world#heritage" className="brand-link mt-7">Explore our heritage <span aria-hidden="true">↗</span></LocalizedClientLink></div>
        </div>
      </section>
      <section className="content-container py-20 text-center small:py-28" aria-labelledby="closing-heading"><p className="eyebrow mb-5 text-areve-walnut">The Modern Heirloom</p><h2 id="closing-heading" className="font-serif text-4xl small:text-6xl">Made to be lived with.</h2><p className="mx-auto mb-8 mt-5 max-w-lg text-sm font-light leading-7 text-areve-walnut">For quiet mornings, shared tables and moments worth marking.</p><LocalizedClientLink href="/store" className="brand-button">Discover AREVÉ <span aria-hidden="true">↗</span></LocalizedClientLink></section>
    </main>
  )
}
