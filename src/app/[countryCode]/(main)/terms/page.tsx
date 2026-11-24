import type { Metadata } from "next"
import PolicyPlaceholder from "@modules/common/components/policy-placeholder"
export const metadata: Metadata = { title: "Terms | AREVÉ" }
export default function TermsPage() { return <PolicyPlaceholder title="Terms" subject="terms" /> }
