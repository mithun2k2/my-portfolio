"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem("theme") as "dark" | "light" | null
    const preferred = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark"
    const initial = saved || preferred
    setTheme(initial)
    document.documentElement.setAttribute("data-theme", initial)
  }, [])

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark"
    setTheme(next)
    document.documentElement.setAttribute("data-theme", next)
    localStorage.setItem("theme", next)
  }

  if (!mounted) return null

  const isDark = theme === "dark"

  return (
    <motion.button
      onClick={toggle}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.92 }}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      style={{
        width: 44,
        height: 24,
        borderRadius: 12,
        border: "1px solid var(--border)",
        background: isDark ? "rgba(108,99,255,0.15)" : "rgba(255,200,50,0.15)",
        cursor: "pointer",
        position: "relative",
        display: "flex",
        alignItems: "center",
        padding: "0 3px",
        transition: "background 0.3s, border-color 0.3s",
      }}
    >
      {/* Track icons */}
      <span style={{ position: "absolute", left: 5, fontSize: "0.6rem", opacity: isDark ? 0.4 : 0 }}>🌙</span>
      <span style={{ position: "absolute", right: 5, fontSize: "0.6rem", opacity: isDark ? 0 : 0.8 }}>☀️</span>

      {/* Thumb */}
      <motion.div
        animate={{ x: isDark ? 0 : 20 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        style={{
          width: 18,
          height: 18,
          borderRadius: "50%",
          background: isDark
            ? "linear-gradient(135deg, #6c63ff, #ff6584)"
            : "linear-gradient(135deg, #f7971e, #ffd200)",
          boxShadow: isDark
            ? "0 0 8px rgba(108,99,255,0.6)"
            : "0 0 8px rgba(247,151,30,0.6)",
          flexShrink: 0,
        }}
      />
    </motion.button>
  )
}
