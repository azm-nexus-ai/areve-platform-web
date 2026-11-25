type Address = Partial<Record<"first_name" | "last_name" | "address_1" | "address_2" | "company" | "postal_code" | "city" | "country_code" | "province" | "phone", string | null>>
const fields = ["first_name", "last_name", "address_1", "address_2", "company", "postal_code", "city", "country_code", "province", "phone"] as const

export default function compareAddresses(first?: Address | null, second?: Address | null) {
  if (!first || !second) return first === second
  return fields.every(field => (first[field] ?? "") === (second[field] ?? ""))
}
