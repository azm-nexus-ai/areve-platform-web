import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getCollectionByHandle, listCollections } from "@lib/data/collections"
import { listRegions } from "@lib/data/regions"
import { StoreCollection, StoreRegion } from "@medusajs/types"
import CollectionTemplate from "@modules/collections/templates"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

type Props = {
  params: Promise<{ handle: string; countryCode: string }>
  searchParams: Promise<{
    page?: string
    sortBy?: SortOptions
    minPrice?: string
    maxPrice?: string
    category?: string
  }>
}

export async function generateStaticParams() {
  const { collections } = await listCollections({ fields: "id,handle,title" })
  const countryCodes = await listRegions().then((regions: StoreRegion[]) =>
    regions.flatMap((r) => r.countries?.map((c) => c.iso_2).filter(Boolean) || [])
  )
  return countryCodes.flatMap((countryCode) =>
    collections.map((collection: StoreCollection) => ({ countryCode, handle: collection.handle }))
  )
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params
  const collection = await getCollectionByHandle(handle)
  if (!collection) notFound()
  return { title: `${collection.title} | AREVÉ`, description: `Explore the ${collection.title} collection at AREVÉ.` }
}

export default async function CollectionPage({ params, searchParams }: Props) {
  const [{ handle, countryCode }, filters] = await Promise.all([params, searchParams])
  const collection = await getCollectionByHandle(handle)
  if (!collection) notFound()
  return (
    <CollectionTemplate
      collection={collection}
      page={filters.page}
      sortBy={filters.sortBy}
      minPrice={filters.minPrice}
      maxPrice={filters.maxPrice}
      filterCategoryId={filters.category}
      countryCode={countryCode}
    />
  )
}
