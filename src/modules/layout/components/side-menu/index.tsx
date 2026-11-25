"use client"

import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react"
import { XMark } from "@medusajs/icons"
import { useState } from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CountrySelect from "../country-select"
import LanguageSelect from "../language-select"
import { HttpTypes } from "@medusajs/types"
import { Locale } from "@lib/data/locales"
import BrandMark from "@modules/common/components/brand-mark"

type SideMenuProps = {
  regions: HttpTypes.StoreRegion[] | null
  locales: Locale[] | null
  currentLocale: string | null
  categories: HttpTypes.StoreProductCategory[]
}

export default function SideMenu({ regions, locales, currentLocale, categories }: SideMenuProps) {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)
  const topLevelCategories = categories.filter(category => !category.parent_category)

  return <>
    <button type="button" data-testid="nav-menu-button" onClick={() => setOpen(true)} aria-haspopup="dialog" aria-expanded={open}
      className="flex min-h-11 items-center text-xs font-medium uppercase tracking-[0.08em] hover:text-areve-walnut">Menu</button>
    <Dialog open={open} onClose={close} className="fixed inset-0 z-[100]">
      <div className="fixed inset-0 bg-areve-ink/40" aria-hidden="true" data-testid="side-menu-backdrop" />
      <div className="fixed inset-0 flex">
        <DialogPanel className="flex h-full w-[min(90vw,420px)] flex-col bg-areve-ivory text-areve-ink shadow-xl">
          <DialogTitle className="sr-only">Explore AREVÉ</DialogTitle>
          <div className="flex items-center justify-between border-b border-areve-sand px-5 py-4">
            <BrandMark />
            <button type="button" data-testid="close-menu-button" onClick={close} className="inline-flex min-h-11 min-w-11 items-center justify-center" aria-label="Close menu"><XMark /></button>
          </div>
          <div className="flex flex-1 flex-col overflow-y-auto overscroll-contain px-5 py-6">
            <LocalizedClientLink href="/store" onClick={close} className="mb-4 flex min-h-11 items-center font-serif text-3xl hover:text-areve-walnut">Shop all</LocalizedClientLink>
            <nav aria-label="Product categories">
              <ul className="divide-y divide-areve-sand">
                {topLevelCategories.map(category => <li key={category.id} className="py-2">
                  <LocalizedClientLink href={`/categories/${category.handle}`} onClick={close} className="flex min-h-11 items-center font-serif text-2xl hover:text-areve-walnut">{category.name}</LocalizedClientLink>
                  {!!category.category_children?.length && <ul>
                    {category.category_children.map(child => <li key={child.id}>
                      <LocalizedClientLink href={`/categories/${child.handle}`} onClick={close} className="flex min-h-11 items-center text-sm text-areve-walnut hover:underline">{child.name}</LocalizedClientLink>
                    </li>)}
                  </ul>}
                </li>)}
              </ul>
            </nav>
            <div className="mt-6 grid grid-cols-2 gap-x-3 border-t border-areve-sand pt-4 text-sm">
              <LocalizedClientLink href="/world" onClick={close} className="col-span-2 flex min-h-11 items-center">The world of AREVÉ</LocalizedClientLink>
              <LocalizedClientLink href="/account" onClick={close} className="flex min-h-11 items-center">Account</LocalizedClientLink>
              <LocalizedClientLink href="/cart" onClick={close} className="flex min-h-11 items-center">Cart</LocalizedClientLink>
            </div>
            <div className="mt-auto space-y-4 border-t border-areve-sand pt-6">
              {!!locales?.length && <LanguageSelect locales={locales} currentLocale={currentLocale} />}
              {regions && <CountrySelect regions={regions} />}
              <p className="text-xs text-areve-walnut">© {new Date().getFullYear()} AREVÉ. All rights reserved.</p>
            </div>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  </>
}
