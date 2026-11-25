"use server"

import { sdk } from "@lib/config"
import { removeAuthToken } from "./cookies"
import { redirect } from "next/navigation"

export type RecoveryState = { success: boolean; message: string }

export async function requestPasswordReset(_previous: RecoveryState, form: FormData): Promise<RecoveryState> {
  const email = String(form.get("email") ?? "").trim()
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { success: false, message: "Enter a valid email address." }
  try {
    await sdk.auth.resetPassword("customer", "emailpass", { identifier: email })
    return { success: true, message: "If an account exists for that email, you will receive a reset link. Check your inbox and spam folder." }
  } catch {
    return { success: false, message: "We could not request a reset link. Please wait a few minutes and try again." }
  }
}

export async function resetCustomerPassword(_previous: RecoveryState, form: FormData): Promise<RecoveryState> {
  const token = String(form.get("token") ?? "")
  const password = String(form.get("password") ?? "")
  if (password.length < 12 || password.length > 128) return { success: false, message: "Use a password between 12 and 128 characters." }
  if (password !== form.get("confirm_password")) return { success: false, message: "The passwords do not match." }
  if (!token || token.length > 8192) return { success: false, message: "This reset link is invalid. Request a new link." }
  try {
    await sdk.auth.updateProvider("customer", "emailpass", { password }, token)
    await removeAuthToken()
  } catch {
    return { success: false, message: "This link has expired, was already used, or could not be verified. Request a new reset link." }
  }
  // Finish recovery with an explicit navigation after clearing the old cookie.
  // This also removes password fields and the consumed token from the page.
  redirect("/ng/account?password=updated")
}
