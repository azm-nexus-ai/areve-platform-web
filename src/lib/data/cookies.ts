import { secureCookies } from "../../../local-review"
import "server-only"
import { cookies as nextCookies } from "next/headers"

export const getAuthHeaders = async (): Promise<
  { authorization: string } | {}
> => {
  try {
    const cookies = await nextCookies()
    const token = cookies.get("_medusa_jwt")?.value

    if (!token) {
      return {}
    }

    return { authorization: `Bearer ${token}` }
  } catch {
    return {}
  }
}

export const getCacheTag = async (tag: string): Promise<string> => {
  try {
    const cookies = await nextCookies()
    const cacheId = cookies.get("_medusa_cache_id")?.value

    if (!cacheId) {
      return ""
    }

    return `${tag}-${cacheId}`
  } catch (error) {
    return ""
  }
}

export const getCacheOptions = async (
  tag: string
): Promise<{ tags: string[] } | {}> => {
  if (typeof window !== "undefined") {
    return {}
  }

  const cacheTag = await getCacheTag(tag)

  if (!cacheTag) {
    return {}
  }

  return { tags: [`${cacheTag}`] }
}

export const setAuthToken = async (token: string) => {
  const cookies = await nextCookies()
  cookies.set("_medusa_jwt", token, {
    maxAge: 60 * 60 * 24 * 7,
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: secureCookies(),
  })
}

export const removeAuthToken = async () => {
  const cookies = await nextCookies()
  cookies.set("_medusa_jwt", "", {
    maxAge: -1,
    path: "/",
    httpOnly: true,
    secure: secureCookies(),
    sameSite: "lax",
  })
}

export const getCartId = async () => {
  const cookies = await nextCookies()
  return cookies.get("_medusa_cart_id")?.value
}

export const setCartId = async (cartId: string) => {
  const cookies = await nextCookies()
  cookies.set("_medusa_cart_id", cartId, {
    maxAge: 60 * 60 * 24 * 7,
    httpOnly: true,
    // A top-level return from Paystack must include this cookie.
    sameSite: "lax",
    path: "/",
    secure: secureCookies(),
  })
}

export const removeCartId = async () => {
  const cookies = await nextCookies()
  cookies.set("_medusa_cart_id", "", {
    maxAge: -1,
    path: "/",
    httpOnly: true,
    secure: secureCookies(),
    sameSite: "lax",
  })
}

const receiptCookie = (id: string) => /^order_[a-zA-Z0-9]{1,80}$/.test(id) ? `_areve_receipt_${id}` : null

export const getOrderReceipt = async (orderId: string) => {
  const name = receiptCookie(orderId)
  return name ? (await nextCookies()).get(name)?.value : undefined
}

/** Server-only proof from successful cart completion, never a URL credential
 * or client storage value. Bound cookie growth on shared browsers.
 */
export const setOrderReceipt = async (orderId: string, receipt: string) => {
  const name = receiptCookie(orderId)
  if (!name || receipt.length > 1024) throw new Error("Unable to preserve your order receipt")
  const cookies = await nextCookies()
  const existing = cookies.getAll().filter(cookie => cookie.name.startsWith("_areve_receipt_") && cookie.name !== name)
  for (const cookie of existing.slice(0, Math.max(0, existing.length - 9))) cookies.delete(cookie.name)
  cookies.set(name, receipt, { maxAge: 30 * 24 * 60 * 60, httpOnly: true, sameSite: "lax", path: "/", secure: secureCookies() })
}
