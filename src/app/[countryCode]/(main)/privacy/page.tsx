import type { Metadata } from "next"
import PolicyPlaceholder from "@modules/common/components/policy-placeholder"
export const metadata: Metadata = { title: "Privacy | AREVÉ" }
export default function PrivacyPage() { return <PolicyPlaceholder title="Privacy" subject="privacy" /> }
