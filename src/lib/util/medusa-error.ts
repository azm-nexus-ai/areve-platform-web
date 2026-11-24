/** Do not expose transport objects, response bodies, headers or provider messages
 * through server-action errors. They may contain customer data or credentials.
 */
export default function medusaError(error: unknown): never {
  const value = error as { status?: number; response?: { status?: number } } | null
  const status = value?.status ?? value?.response?.status
  if (status === 401) throw new Error("Please sign in again to continue.")
  if (status === 403) throw new Error("This action is not available for your account.")
  if (status === 404) throw new Error("This item is no longer available. Please refresh and try again.")
  if (status === 409) throw new Error("This item has changed. Please refresh and try again.")
  if (status === 400 || status === 422) throw new Error("Please check your details and try again.")
  throw new Error("The shop is temporarily unavailable. Please try again shortly.")
}
