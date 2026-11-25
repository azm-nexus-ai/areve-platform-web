import type { Metadata } from "next"
import PolicyDocument from "@modules/common/components/policy-document"
export const metadata: Metadata = { title: "Terms | AREVÉ" }
export default function PolicyPage() { return <PolicyDocument kind="terms" /> }
