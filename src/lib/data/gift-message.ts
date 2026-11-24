"use server"

import { retrieveCart, updateCart } from "@lib/data/cart"

export async function saveGiftMessage(message: string) {
  if (typeof message !== "string" || message.length > 250) {
    throw new Error("Gift message must be 250 characters or fewer.")
  }
  const cart = await retrieveCart()
  if (!cart) throw new Error("Your cart could not be found. Please refresh and try again.")

  await updateCart({
    metadata: {
      ...(cart.metadata || {}),
      gift_message: message.trim(),
    },
  })
}
