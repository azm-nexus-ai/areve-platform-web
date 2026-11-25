import Image from "next/image"

export default function BrandMark({ inverse = false, primary = false, className = "" }: {
  inverse?: boolean; primary?: boolean; className?: string
}) {
  return <Image src={`/brand/${primary ? "primary" : "wordmark"}-${inverse ? "warm-ivory" : "charcoal"}.svg`}
    alt="AREVÉ" width={primary ? 631 : 722} height={primary ? 528 : 198}
    className={`h-auto ${primary ? "w-44" : "w-28 small:w-36"} ${className}`} />
}
