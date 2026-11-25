export type DeliveryCoverage = {
  version: 1
  review_only: boolean
  lagos_areas: { name: string; zone: "lagos-mainland" | "lagos-island" | "lekki-ajah" }[]
  outside_lagos_states: string[]
}
