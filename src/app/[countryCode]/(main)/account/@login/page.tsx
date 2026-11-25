import { Metadata } from "next"

import LoginTemplate from "@modules/account/templates/login-template"
import { getAreveConfig } from "@lib/data/areve"

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your AREVÉ account.",
}

export default async function Login({ searchParams }: { searchParams: Promise<{ password?: string }> }) {
  const config = await getAreveConfig()
  return <LoginTemplate resetComplete={(await searchParams).password === "updated"} registrationAvailable={config.account_registration_available} />
}
