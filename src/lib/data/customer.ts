"use server"

import { sdk } from "@lib/config"
import medusaError from "@lib/util/medusa-error"
import { HttpTypes } from "@medusajs/types"
import { revalidatePath, revalidateTag } from "next/cache"
import { redirect } from "next/navigation"
import {
  getAuthHeaders,
  getCacheTag,
  getCartId,
  removeAuthToken,
  removeCartId,
  setAuthToken,
} from "./cookies"

async function revalidateCustomerViews() {
  const tag = await getCacheTag("customers")
  if (tag) revalidateTag(tag)
  // Customer reads are deliberately uncached. Invalidate the account route tree
  // as well so mutations replace prefetched layouts and address lists.
  revalidatePath("/[countryCode]/(main)/account", "layout")
}

export const retrieveCustomer =
  async (): Promise<HttpTypes.StoreCustomer | null> => {
    const authHeaders = await getAuthHeaders()

    if (!("authorization" in authHeaders)) return null

    const headers = {
      ...authHeaders,
    }

    return await sdk.client
      .fetch<{ customer: HttpTypes.StoreCustomer }>(`/store/customers/me`, {
        method: "GET",
        query: {
          fields: "*orders",
        },
        headers,
        cache: "no-store",
      })
      .then(({ customer }) => customer)
      .catch(() => null)
  }

export const updateCustomer = async (body: HttpTypes.StoreUpdateCustomer) => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  const updateRes = await sdk.store.customer
    .update(body, {}, headers)
    .then(({ customer }) => customer)
    .catch(medusaError)

  await revalidateCustomerViews()

  return updateRes
}

export async function updateCustomerName(_previous: unknown, form: FormData) {
  try {
    await updateCustomer({ first_name: String(form.get("first_name") ?? ""), last_name: String(form.get("last_name") ?? "") })
    return { success: true, error: null }
  } catch {
    return { success: false, error: "Unable to update your name. Please try again." }
  }
}

export async function updateCustomerPhone(_previous: unknown, form: FormData) {
  try {
    await updateCustomer({ phone: String(form.get("phone") ?? "") })
    return { success: true, error: null }
  } catch {
    return { success: false, error: "Unable to update your phone number. Please try again." }
  }
}

export async function saveCustomerBillingAddress(_previous: unknown, form: FormData) {
  const state = { isDefaultBilling: true, isDefaultShipping: false }
  return form.get("addressId") ? updateCustomerAddress(state, form) : addCustomerAddress(state, form)
}

export async function signup(_currentState: unknown, formData: FormData) {
  const password = formData.get("password") as string
  const customerForm = {
    email: formData.get("email") as string,
    first_name: formData.get("first_name") as string,
    last_name: formData.get("last_name") as string,
    phone: formData.get("phone") as string,
  }

  try {
    const token = await sdk.auth.register("customer", "emailpass", {
      email: customerForm.email,
      password: password,
    })

    await setAuthToken(token as string)

    const headers = {
      ...(await getAuthHeaders()),
    }

    const { customer: createdCustomer } = await sdk.store.customer.create(
      customerForm,
      {},
      headers
    )

    const loginToken = await sdk.auth.login("customer", "emailpass", {
      email: customerForm.email,
      password,
    })

    await setAuthToken(loginToken as string)

    await revalidateCustomerViews()

    await transferCart()

    return null
  } catch {
    await removeAuthToken()
    return "Unable to create your account. If you already registered, sign in or reset your password."
  }
}

export async function login(_currentState: unknown, formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  try {
    await sdk.auth
      .login("customer", "emailpass", { email, password })
      .then(async (token) => {
        await setAuthToken(token as string)
        await revalidateCustomerViews()
      })
  } catch {
    return "Unable to sign in. Check your email and password and try again."
  }

  try {
    await transferCart()
  } catch {
    return "You are signed in, but your cart could not be restored. Please refresh your cart."
  }
}

export async function signout(countryCode: string) {
  try {
    await sdk.auth.logout()
  } catch {
    // Local credentials must still be removed when an expired session or outage
    // prevents the optional backend session logout.
  }
  await removeAuthToken()

  await revalidateCustomerViews()

  await removeCartId()

  const cartCacheTag = await getCacheTag("carts")
  revalidateTag(cartCacheTag)

  redirect(`/${/^[a-z]{2}$/.test(countryCode) ? countryCode : "ng"}/account`)
}

export async function transferCart() {
  const cartId = await getCartId()

  if (!cartId) {
    return
  }

  const headers = await getAuthHeaders()

  await sdk.store.cart.transferCart(cartId, {}, headers)

  const cartCacheTag = await getCacheTag("carts")
  revalidateTag(cartCacheTag)
}

export const addCustomerAddress = async (
  currentState: Record<string, unknown>,
  formData: FormData
): Promise<any> => {
  const isDefaultBilling = (currentState.isDefaultBilling as boolean) || false
  const isDefaultShipping = (currentState.isDefaultShipping as boolean) || false

  const address = {
    first_name: formData.get("first_name") as string,
    last_name: formData.get("last_name") as string,
    company: formData.get("company") as string,
    address_1: formData.get("address_1") as string,
    address_2: formData.get("address_2") as string,
    city: formData.get("city") as string,
    postal_code: formData.get("postal_code") as string,
    province: formData.get("province") as string,
    country_code: formData.get("country_code") as string,
    phone: formData.get("phone") as string,
    is_default_billing: isDefaultBilling,
    is_default_shipping: isDefaultShipping,
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  return sdk.store.customer
    .createAddress(address, {}, headers)
    .then(async ({ customer }) => {
      await revalidateCustomerViews()
      return { ...currentState, success: true, error: null }
    })
    .catch((err) => {
      return { ...currentState, success: false, error: "Unable to save this address. Check the details and try again." }
    })
}

export const deleteCustomerAddress = async (
  addressId: string
): Promise<{ success: boolean; error: string | null }> => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  return sdk.store.customer
    .deleteAddress(addressId, headers)
    .then(async () => {
      await revalidateCustomerViews()
      return { success: true, error: null }
    })
    .catch((err) => {
      return { success: false, error: "Unable to remove this address. Please try again." }
    })
}

export const updateCustomerAddress = async (
  currentState: Record<string, unknown>,
  formData: FormData
): Promise<any> => {
  const addressId =
    (currentState.addressId as string) || (formData.get("addressId") as string)

  if (!addressId) {
    return { success: false, error: "Address ID is required" }
  }

  const address = {
    first_name: formData.get("first_name") as string,
    last_name: formData.get("last_name") as string,
    company: formData.get("company") as string,
    address_1: formData.get("address_1") as string,
    address_2: formData.get("address_2") as string,
    city: formData.get("city") as string,
    postal_code: formData.get("postal_code") as string,
    province: formData.get("province") as string,
    country_code: formData.get("country_code") as string,
  } as HttpTypes.StoreUpdateCustomerAddress

  const phone = formData.get("phone") as string

  if (phone) {
    address.phone = phone
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  return sdk.store.customer
    .updateAddress(addressId, address, {}, headers)
    .then(async () => {
      await revalidateCustomerViews()
      return { success: true, error: null }
    })
    .catch((err) => {
      return { success: false, error: "Unable to save this address. Check the details and try again." }
    })
}
