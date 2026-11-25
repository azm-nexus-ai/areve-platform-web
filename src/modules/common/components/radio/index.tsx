/** Visual indicator only. The enclosing native input or Headless UI Radio owns
 * focus, accessible naming and checked state; nesting another button breaks it.
 */
export default function Radio({ checked, "data-testid": dataTestId }: { checked: boolean; "data-testid"?: string }) {
  return <span aria-hidden="true" data-state={checked ? "checked" : "unchecked"} data-testid={dataTestId || "radio-button"}
    className={`inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${checked ? "border-areve-ink bg-areve-ink" : "border-areve-walnut bg-transparent"}`}>
    {checked && <span className="h-2 w-2 rounded-full bg-areve-ivory" />}
  </span>
}
