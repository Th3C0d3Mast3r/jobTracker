"use client"
import type React from "react"

import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  BriefcaseIcon,
  ChartBarIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()

  const handleSignOut = () => {
    localStorage.removeItem("isAuthenticated")
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="flex items-center gap-2">
              <BriefcaseIcon className="h-8 w-8 text-primary" />
              <span className="text-xl font-semibold text-foreground">JobTracker</span>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/dashboard"
                className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                  pathname === "/dashboard" ? "text-foreground" : "text-muted-foreground hover:text-primary"
                }`}
              >
                <ChartBarIcon className="h-4 w-4" />
                Dashboard
              </Link>
              <Link
                href="/scraping"
                className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                  pathname === "/scraping" ? "text-foreground" : "text-muted-foreground hover:text-primary"
                }`}
              >
                <MagnifyingGlassIcon className="h-4 w-4" />
                Job Discovery
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button variant="ghost" size="icon">
              <UserCircleIcon className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleSignOut}>
              <ArrowRightOnRectangleIcon className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  )
}
