"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"


export function Footer() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // ✅ Fix hydration mismatch
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  return (
    <footer
      className={`mt-10 border-t transition-colors duration-300 ${
        theme === "dark" ? "border-zinc-800 bg-zinc-950 text-zinc-400" : "border-zinc-200 bg-white text-zinc-600"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col sm:flex-row justify-between items-center text-sm">
        <p className="mb-2 sm:mb-0">
          © {new Date().getFullYear()} JobTracker — Made by <span className="font-semibold">Devesh Acharya</span>
        </p>
        <div className="flex space-x-4">
          
          <a
            href="https://github.com/Th3C0d3Mast3r/jobTracker?tab=readme-ov-file#version-history"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors">
            v1.0.3
          </a>
          
          <a
            href="https://github.com/Th3C0d3Mast3r/jobTracker"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors"
          >
            GitHub
          </a>
          
        </div>
      </div>
    </footer>
  )
}
