import BrandMark from "@modules/common/components/brand-mark"
import { listCategories } from "@lib/data/categories"
import { listCollections } from "@lib/data/collections"
import { getAreveConfig } from "@lib/data/areve"
import { whatsAppLink } from "@lib/util/whatsapp"

import LocalizedClientLink from "@modules/common/components/localized-client-link"

const policyLinks = [
  { label: "Delivery", href: "/delivery" },
  { label: "Returns", href: "/returns" },
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
]

const socialLinks = [
  { label: "Instagram", href: process.env.NEXT_PUBLIC_INSTAGRAM_URL },
  { label: "TikTok", href: process.env.NEXT_PUBLIC_TIKTOK_URL },
  { label: "X", href: process.env.NEXT_PUBLIC_X_URL },
].filter((link): link is { label: string; href: string } => Boolean(link.href))

export default async function Footer() {
  const [{ collections }, productCategories, config] = await Promise.all([
    listCollections({ fields: "id,handle,title" }),
    listCategories(),
    getAreveConfig(),
  ])

  const whatsappHref = whatsAppLink(
    config.whatsapp_number,
    "Hello AREVÉ, I have a question."
  )

  const topLevelCategories = productCategories.filter(
    (category) => !category.parent_category
  )

  return (
    <footer className="border-t border-areve-ivory/20 bg-areve-ink text-areve-ivory">
      <div className="content-container py-16 small:py-24">
        <div className="grid grid-cols-1 gap-12 small:grid-cols-[1.2fr_2fr]">
          <div>
            <LocalizedClientLink
              href="/"
              className="inline-flex py-4"
            >
              <BrandMark inverse className="!w-44" />
            </LocalizedClientLink>
            <p className="mt-4 max-w-sm text-sm leading-6 text-areve-ivory/80">
              Rooted in heritage. Refined by design. Made for modern living.
            </p>
            {whatsappHref && (
              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex min-h-11 items-center text-sm font-semibold text-areve-sand underline underline-offset-4"
              >
                Chat with AREVÉ on WhatsApp
              </a>
            )}
          </div>

          <div className={`grid grid-cols-2 gap-8 ${socialLinks.length > 0 ? "xsmall:grid-cols-4" : "xsmall:grid-cols-3"}`}>
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-[0.08em]">
                Shop
              </h2>
              <ul className="mt-4 space-y-3 text-sm text-areve-ivory/80">
                <li>
                  <LocalizedClientLink href="/store" className="hover:text-areve-sand">
                    All products
                  </LocalizedClientLink>
                </li>
                {topLevelCategories.slice(0, 5).map((category) => (
                  <li key={category.id}>
                    <LocalizedClientLink
                      href={`/categories/${category.handle}`}
                      className="hover:text-areve-sand"
                    >
                      {category.name}
                    </LocalizedClientLink>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-xs font-semibold uppercase tracking-[0.08em]">
                Collections
              </h2>
              <ul className="mt-4 space-y-3 text-sm text-areve-ivory/80">
                <li><LocalizedClientLink href="/world">The world of AREVÉ</LocalizedClientLink></li>
                {collections.slice(0, 6).map((collection) => (
                  <li key={collection.id}>
                    <LocalizedClientLink
                      href={`/collections/${collection.handle}`}
                      className="hover:text-areve-sand"
                    >
                      {collection.title}
                    </LocalizedClientLink>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-xs font-semibold uppercase tracking-[0.08em]">
                Help
              </h2>
              <ul className="mt-4 space-y-3 text-sm text-areve-ivory/80">
                <li>
                  <LocalizedClientLink href="/account" className="hover:text-areve-sand">
                    My account
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink
                    href="/account/orders"
                    className="hover:text-areve-sand"
                  >
                    Track an order
                  </LocalizedClientLink>
                </li>
                {policyLinks.map((link) => (
                  <li key={link.href}>
                    <LocalizedClientLink
                      href={link.href}
                      className="hover:text-areve-sand"
                    >
                      {link.label}
                    </LocalizedClientLink>
                  </li>
                ))}
              </ul>
            </div>

            {socialLinks.length > 0 && <div>
              <h2 className="text-xs font-semibold uppercase tracking-[0.08em]">Follow</h2>
              {(
                <ul className="mt-4 space-y-3 text-sm text-areve-ivory/80">
                  {socialLinks.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-areve-sand"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>}
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-areve-ivory/20 pt-6 text-xs text-areve-ivory/80 xsmall:flex-row xsmall:items-center xsmall:justify-between">
          <span>© {new Date().getFullYear()} AREVÉ. All rights reserved.</span>
          <span>areve.cc</span>
        </div>
      </div>
    </footer>
  )
}
