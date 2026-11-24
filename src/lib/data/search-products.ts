"use server"

import { catalogueQuery } from "@lib/util/catalogue-query"
import { listProducts } from "@lib/data/products"
import { getProductPrice } from "@lib/util/get-product-price"

export async function searchProducts(query: string, countryCode: string) {
  const trimmedQuery = catalogueQuery(query)

  if (trimmedQuery.length < 2 || !countryCode) {
    return []
  }

  const {
    response: { products },
  } = await listProducts({
    countryCode,
    queryParams: {
      q: trimmedQuery,
      limit: 6,
    },
  })

  return products.map((product) => {
    const { cheapestPrice } = getProductPrice({ product })

    return {
      id: product.id,
      title: product.title,
      handle: product.handle,
      thumbnail: product.thumbnail ?? null,
      price: cheapestPrice?.calculated_price ?? null,
    }
  })
}
