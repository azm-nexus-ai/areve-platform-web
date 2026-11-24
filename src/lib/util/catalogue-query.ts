export type CatalogueSort = "created_at" | "title"

export function catalogueSort(value: unknown): CatalogueSort {
  return value === "title" ? "title" : "created_at"
}

export function cataloguePage(value: unknown): number {
  const number = typeof value === "string" && /^\d+$/.test(value) ? Number(value) : value
  return typeof number === "number" && Number.isSafeInteger(number) && number >= 1 && number <= 100_000 ? number : 1
}

export function catalogueQuery(value: unknown): string {
  return typeof value === "string" ? value.trim().slice(0, 100) : ""
}

export function visiblePages(page: number, totalPages: number): number[] {
  return Array.from(new Set([1, page - 1, page, page + 1, totalPages]))
    .filter(p => p >= 1 && p <= totalPages).sort((a, b) => a - b)
}
