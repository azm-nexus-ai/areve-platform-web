"use client"

import { Popover, PopoverPanel, Transition } from "@headlessui/react"
import { ArrowRightMini, XMark } from "@medusajs/icons"
import { Text, clx, useToggleState } from "@medusajs/ui"
import { Fragment } from "react"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CountrySelect from "../country-select"
import LanguageSelect from "../language-select"
import { HttpTypes } from "@medusajs/types"
import { Locale } from "@lib/data/locales"

type SideMenuProps = {
  regions: HttpTypes.StoreRegion[] | null
  locales: Locale[] | null
  currentLocale: string | null
  categories: HttpTypes.StoreProductCategory[]
}

const SideMenu = ({
  regions,
  locales,
  currentLocale,
  categories,
}: SideMenuProps) => {
  const countryToggleState = useToggleState()
  const languageToggleState = useToggleState()
  const topLevelCategories = categories.filter((category) => !category.parent_category)

  return (
    <div className="h-full">
      <div className="flex h-full items-center">
        <Popover className="flex h-full">
          {({ open, close }) => (
            <>
              <div className="relative flex h-full">
                <Popover.Button
                  data-testid="nav-menu-button"
                  className="relative flex min-h-11 items-center text-xs font-medium uppercase tracking-[0.08em] text-semantic-text-primary transition-colors hover:text-semantic-text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-semantic-focus"
                >
                  Menu
                </Popover.Button>
              </div>

              {open && (
                <div
                  className="fixed inset-0 z-[50] bg-semantic-surface-inverse/40"
                  onClick={close}
                  data-testid="side-menu-backdrop"
                />
              )}

              <Transition
                show={open}
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in duration-150"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <PopoverPanel className="fixed inset-y-0 left-0 z-[51] flex w-[min(90vw,420px)] flex-col bg-semantic-surface-canvas text-semantic-text-primary shadow-xl">
                  <div className="flex items-center justify-between border-b border-semantic-border-subtle px-5 py-4">
                    <span className="font-serif text-2xl tracking-[0.18em]">AREVÉ</span>
                    <button
                      type="button"
                      data-testid="close-menu-button"
                      onClick={close}
                      className="inline-flex min-h-11 min-w-11 items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-semantic-focus"
                      aria-label="Close menu"
                    >
                      <XMark />
                    </button>
                  </div>

                  <div className="flex flex-1 flex-col overflow-y-auto px-5 py-6">
                    <LocalizedClientLink
                      href="/store"
                      onClick={close}
                      className="mb-6 font-serif text-3xl hover:text-semantic-text-accent"
                    >
                      Shop all
                    </LocalizedClientLink>

                    <nav aria-label="Product categories">
                      <ul className="divide-y divide-semantic-border-subtle">
                        {topLevelCategories.map((category) => (
                          <li key={category.id} className="py-4">
                            <LocalizedClientLink
                              href={`/categories/${category.handle}`}
                              onClick={close}
                              className="font-serif text-2xl hover:text-semantic-text-accent"
                            >
                              {category.name}
                            </LocalizedClientLink>
                            {!!category.category_children?.length && (
                              <ul className="mt-3 space-y-2">
                                {category.category_children.map((child) => (
                                  <li key={child.id}>
                                    <LocalizedClientLink
                                      href={`/categories/${child.handle}`}
                                      onClick={close}
                                      className="text-sm text-semantic-text-muted hover:text-semantic-text-accent"
                                    >
                                      {child.name}
                                    </LocalizedClientLink>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </li>
                        ))}
                      </ul>
                    </nav>

                    <div className="mt-8 grid grid-cols-2 gap-3 border-t border-semantic-border-subtle pt-6 text-sm">
                      <LocalizedClientLink href="/account" onClick={close}>
                        Account
                      </LocalizedClientLink>
                      <LocalizedClientLink href="/cart" onClick={close}>
                        Cart
                      </LocalizedClientLink>
                    </div>
                  </div>

                  <div className="border-t border-semantic-border-subtle p-5">
                    {!!locales?.length && (
                      <div
                        className="mb-4 flex justify-between"
                        onMouseEnter={languageToggleState.open}
                        onMouseLeave={languageToggleState.close}
                      >
                        <LanguageSelect
                          toggleState={languageToggleState}
                          locales={locales}
                          currentLocale={currentLocale}
                        />
                        <ArrowRightMini
                          className={clx(
                            "transition-transform duration-150",
                            languageToggleState.state ? "-rotate-90" : ""
                          )}
                        />
                      </div>
                    )}
                    <div
                      className="flex justify-between"
                      onMouseEnter={countryToggleState.open}
                      onMouseLeave={countryToggleState.close}
                    >
                      {regions && (
                        <CountrySelect
                          toggleState={countryToggleState}
                          regions={regions}
                        />
                      )}
                      <ArrowRightMini
                        className={clx(
                          "transition-transform duration-150",
                          countryToggleState.state ? "-rotate-90" : ""
                        )}
                      />
                    </div>
                    <Text className="mt-5 txt-compact-small text-semantic-text-muted">
                      © {new Date().getFullYear()} AREVÉ. All rights reserved.
                    </Text>
                  </div>
                </PopoverPanel>
              </Transition>
            </>
          )}
        </Popover>
      </div>
    </div>
  )
}

export default SideMenu
