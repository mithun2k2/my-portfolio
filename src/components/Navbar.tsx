"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

const links = [
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#experience", label: "Experience" },
  { href: "/blog", label: "Blog" },
  { href: "#contact", label: "Contact" },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: scrolled ? "rgba(10,10,15,0.92)" : "rgba(10,10,15,0.6)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid var(--border)",
        transition: "background 0.3s",
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "0 2rem",
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <motion.a
          href="#top"
          whileHover={{ scale: 1.05 }}
          style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 800,
            fontSize: "1.2rem",
            background: "linear-gradient(135deg, var(--accent), var(--accent2))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          MH.
        </motion.a>

        {/* Desktop links */}
        <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
          {links.map((link) => (
            <motion.a
              key={link.href}
              href={link.href}
              whileHover={{ color: "var(--text)" }}
              style={{
                color: "var(--muted)",
                fontSize: "0.875rem",
                fontWeight: 500,
                transition: "color 0.2s",
              }}
            >
              {link.label}
            </motion.a>
          ))}
          <motion.a
            href="mailto:mithun_2k2@yahoo.co.uk"
            whileHover={{ opacity: 0.85 }}
            whileTap={{ scale: 0.96 }}
            style={{
              background: "var(--accent)",
              color: "#fff",
              padding: "0.45rem 1.1rem",
              borderRadius: 8,
              fontSize: "0.82rem",
              fontWeight: 600,
            }}
          >
            Hire Me
          </motion.a>
        </div>
      </div>
    </motion.nav>
  )
}
