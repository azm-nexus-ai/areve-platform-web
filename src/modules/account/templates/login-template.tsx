"use client"

import { useState } from "react"

import Register from "@modules/account/components/register"
import Login from "@modules/account/components/login"

export enum LOGIN_VIEW {
  SIGN_IN = "sign-in",
  REGISTER = "register",
}

const LoginTemplate = ({ resetComplete = false, registrationAvailable = false }: { resetComplete?: boolean; registrationAvailable?: boolean }) => {
  const [currentView, setCurrentView] = useState("sign-in")

  return (
    <div className="w-full py-2 small:py-6">
      {currentView === "sign-in" || !registrationAvailable ? (
        <Login setCurrentView={setCurrentView} resetComplete={resetComplete} registrationAvailable={registrationAvailable} />
      ) : (
        <Register setCurrentView={setCurrentView} />
      )}
    </div>
  )
}

export default LoginTemplate
