"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Avoid hydration mismatch by waiting for mount
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="w-9 h-9 rounded-full bg-secondary/50 animate-pulse" />
  }

  const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)

  return (
    <label className="switch">
      <input 
        type="checkbox" 
        checked={isDark} 
        onChange={() => setTheme(isDark ? "light" : "dark")} 
        aria-label="Toggle theme"
      />
      <span className="slider"></span>
    </label>
  )
}
