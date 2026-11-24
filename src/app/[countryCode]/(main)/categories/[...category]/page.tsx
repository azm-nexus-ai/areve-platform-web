import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getCategoryByHandle, listCategories } from "@lib/data/categories"
import { listRegions } from "@lib/data/regions"
import { StoreRegion } from "@medusajs/types"
import CategoryTemplate from "@modules/categories/templates"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

type Props = {
  params: Promise<{ category: string[]; countryCode: string }>
  searchParams: Promise<{
    sortBy?: SortOptions
    page?: string
    category?: string
  }>
}

export async function generateStaticParams() {
  const productCategories = await listCategories()
  const countryCodes = await listRegions().then((regions: StoreRegion[]) =>
    regions.flatMap((r) => r.countries?.map((c) => c.iso_2).filter(Boolean) || [])
  )
  return countryCodes.flatMap((countryCode) =>
    productCategories.map((category) => ({ countryCode, category: [category.handle] }))
  )
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params
  const productCategory = await getCategoryByHandle(category)
  if (!productCategory) notFound()
  return {
    title: `${productCategory.name} | AREVÉ`,
    description: productCategory.description ?? `Explore ${productCategory.name} at AREVÉ.`,
  }
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const [{ category, countryCode }, filters] = await Promise.all([params, searchParams])
  const productCategory = await getCategoryByHandle(category)
  if (!productCategory) notFound()
  return (
    <CategoryTemplate
      category={productCategory}
      sortBy={filters.sortBy}
      page={filters.page}
      filterCategoryId={filters.category}
      countryCode={countryCode}
    />
  )
}
