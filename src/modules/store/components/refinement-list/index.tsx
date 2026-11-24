"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { SortOptions } from "./sort-products"

type Props = {
  sortBy: SortOptions
  categoryId?: string
  categoryOptions?: { id: string; name: string }[]
  "data-testid"?: string
}

export default function RefinementList({
  sortBy, categoryId = "", categoryOptions = [],
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
    params.delete("minPrice")
    params.delete("maxPrice")
    router.push(`${pathname}?${params.toString()}`)
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
            <option value="title">Name: A to Z</option>
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


      </div>
    </aside>
  )
}
