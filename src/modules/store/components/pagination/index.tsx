"use client"

import { visiblePages } from "@lib/util/catalogue-query"
import { clx } from "@medusajs/ui"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

export function Pagination({ page, totalPages, label = "Product pages", "data-testid": dataTestid }: {
  page: number
  totalPages: number
  label?: string
  "data-testid"?: string
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const changePage = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", String(newPage))
    router.push(`${pathname}?${params.toString()}`)
  }
  const visible = visiblePages(page, totalPages)

  return (
    <nav aria-label={label} className="mt-12 flex justify-center" data-testid={dataTestid}>
      <ul className="flex flex-wrap items-center gap-2">
        {visible.map((p, index) => (
          <li key={p} className="flex items-center gap-2">
            {index > 0 && p > visible[index - 1] + 1 && <span aria-hidden="true">…</span>}
            <button
              type="button"
              onClick={() => changePage(p)}
              disabled={p === page}
              aria-current={p === page ? "page" : undefined}
              aria-label={`Page ${p}`}
              className={clx(
                "inline-flex min-h-11 min-w-11 items-center justify-center border border-semantic-border-subtle text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-semantic-focus",
                p === page ? "bg-semantic-surface-inverse text-semantic-text-inverse" : "text-semantic-text-primary hover:border-semantic-border-strong"
              )}
            >
              {p}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}
