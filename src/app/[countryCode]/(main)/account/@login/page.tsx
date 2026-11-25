import { Metadata } from "next"

import LoginTemplate from "@modules/account/templates/login-template"

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your AREVÉ account.",
}

export default async function Login({ searchParams }: { searchParams: Promise<{ password?: string }> }) {
  return <LoginTemplate resetComplete={(await searchParams).password === "updated"} />
}
