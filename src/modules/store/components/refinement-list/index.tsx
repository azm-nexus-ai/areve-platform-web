"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { FormEvent } from "react"
import { SortOptions } from "./sort-products"

type Props = {
  sortBy: SortOptions
  minPrice?: string
  maxPrice?: string
  categoryId?: string
  categoryOptions?: { id: string; name: string }[]
  "data-testid"?: string
}

export default function RefinementList({
  sortBy, minPrice = "", maxPrice = "", categoryId = "", categoryOptions = [],
  "data-testid": dataTestId,
}: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const update = (changes: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString())
    Object.entries(changes).forEach(([key, value]) => {
      if (value) params.set(key, value)
      else params.delete(key)
    })
    params.delete("page")
    router.push(`${pathname}?${params.toString()}`)
  }

  const applyPrice = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const min = String(form.get("minPrice") || "")
    const max = String(form.get("maxPrice") || "")
    update({ minPrice: min, maxPrice: max })
  }

  return (
    <aside aria-label="Catalogue filters" className="w-full shrink-0 small:w-56" data-testid={dataTestId}>
      <div className="space-y-6 border border-semantic-border-subtle bg-semantic-surface-canvas p-4">
        <div>
          <label htmlFor="catalogue-sort" className="mb-2 block text-sm font-semibold text-semantic-text-primary">Sort by</label>
          <select
            id="catalogue-sort"
            value={sortBy}
            onChange={(e) => update({ sortBy: e.target.value })}
            className="min-h-11 w-full border border-semantic-border-strong bg-transparent px-2 text-sm text-semantic-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-semantic-focus"
          >
            <option value="created_at">Newest</option>
            <option value="price_asc">Price: low to high</option>
            <option value="price_desc">Price: high to low</option>
          </select>
        </div>

        {categoryOptions.length > 0 && (
          <div>
            <label htmlFor="catalogue-category" className="mb-2 block text-sm font-semibold text-semantic-text-primary">Category</label>
            <select
              id="catalogue-category"
              value={categoryId}
              onChange={(e) => update({ category: e.target.value })}
              className="min-h-11 w-full border border-semantic-border-strong bg-transparent px-2 text-sm text-semantic-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-semantic-focus"
            >
              <option value="">All categories</option>
              {categoryOptions.map((option) => <option key={option.id} value={option.id}>{option.name}</option>)}
            </select>
          </div>
        )}

        <form key={`${minPrice}-${maxPrice}`} onSubmit={applyPrice}>
          <p className="mb-2 text-sm font-semibold text-semantic-text-primary">Price (NGN)</p>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label htmlFor="catalogue-min" className="mb-1 block text-xs text-semantic-text-muted">From</label>
              <input id="catalogue-min" name="minPrice" type="number" min="0" step="1" placeholder="0" defaultValue={minPrice}
                className="min-h-11 w-full border border-semantic-border-strong bg-transparent px-2 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-semantic-focus" />
            </div>
            <div>
              <label htmlFor="catalogue-max" className="mb-1 block text-xs text-semantic-text-muted">To</label>
              <input id="catalogue-max" name="maxPrice" type="number" min="0" step="1" placeholder="Any" defaultValue={maxPrice}
                className="min-h-11 w-full border border-semantic-border-strong bg-transparent px-2 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-semantic-focus" />
            </div>
          </div>
          <button type="submit" className="mt-3 inline-flex min-h-11 w-full items-center justify-center bg-semantic-action-primary px-3 text-sm font-semibold text-semantic-action-primaryText">
            Apply price
          </button>
        </form>
      </div>
    </aside>
  )
}
