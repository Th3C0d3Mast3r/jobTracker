"use client"
import { useEffect, useState } from "react"
import type React from "react"

import { useRouter } from "next/navigation"

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Simulate auth check - in real app, check token/session
    const checkAuth = () => {
      const isLoggedIn = localStorage.getItem("isAuthenticated") === "true"
      setIsAuthenticated(isLoggedIn)

      if (!isLoggedIn) {
        router.push("/auth")
      }
    }

    checkAuth()
  }, [router])

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}
