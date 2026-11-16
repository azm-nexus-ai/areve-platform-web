/**
 * WhatsApp helpers. wa.me links only work with the full international number
 * in digits, so local Nigerian formats are converted before building a link.
 */

const NIGERIA_COUNTRY_CODE = "234"

/**
 * Turns a phone number into the digits-only international form wa.me expects.
 * Accepts "+234 801 234 5678", "2348012345678", "08012345678" or "8012345678".
 * Returns null when the value cannot be a valid number.
 */
export function toWhatsAppNumber(value: string | null | undefined): string | null {
  if (!value) {
    return null
  }
  let digits = value.replace(/\D/g, "")
  if (digits.startsWith("00")) {
    digits = digits.slice(2) // 00234... international dialling prefix
  }
  if (digits.length === 11 && digits.startsWith("0")) {
    digits = NIGERIA_COUNTRY_CODE + digits.slice(1) // 080... local format
  } else if (digits.length === 10 && !digits.startsWith("0")) {
    digits = NIGERIA_COUNTRY_CODE + digits // 80... without the leading 0
  }
  // E.164 numbers are at most 15 digits; anything under 11 is incomplete.
  return digits.length >= 11 && digits.length <= 15 ? digits : null
}

/** A wa.me link, optionally with a pre-filled message. Null when the number is unusable. */
export function whatsAppLink(value: string | null | undefined, message?: string): string | null {
  const number = toWhatsAppNumber(value)
  if (!number) {
    return null
  }
  return message ? `https://wa.me/${number}?text=${encodeURIComponent(message)}` : `https://wa.me/${number}`
}
