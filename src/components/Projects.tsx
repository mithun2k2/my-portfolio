"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { projects } from "@/data"

const statusStyles: Record<string, { bg: string; color: string }> = {
  live: { bg: "#0f2d1f", color: "var(--accent3)" },
  building: { bg: "#1e1a2e", color: "var(--accent)" },
  academic: { bg: "#2d1e1e", color: "var(--accent2)" },
}

const filters = ["All", "Live", "Building", "Academic"] as const
type Filter = (typeof filters)[number]

export default function Projects() {
  const [activeFilter, setActiveFilter] = useState<Filter>("All")

  const filtered = projects.filter((p) => {
    if (activeFilter === "All") return true
    if (activeFilter === "Live") return p.status === "live"
    if (activeFilter === "Building") return p.status === "building"
    if (activeFilter === "Academic") return p.status === "academic" || p.statusLabel === "Virtual Experience"
    return true
  })

  return (
    <section id="projects" className="section-wrapper">
      <p className="section-label">Portfolio</p>
      <h2 className="section-title">Projects</h2>
      <p className="section-sub">
        From AI agentic systems to full enterprise SaaS — every project is either live or in active development.
      </p>

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "2rem", flexWrap: "wrap" }}>
        {filters.map((f) => (
          <motion.button
            key={f}
            onClick={() => setActiveFilter(f)}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: "0.45rem 1.1rem",
              borderRadius: 8,
              border: "1px solid",
              borderColor: activeFilter === f ? "var(--accent)" : "var(--border)",
              background: activeFilter === f ? "rgba(108,99,255,0.15)" : "var(--surface)",
              color: activeFilter === f ? "var(--accent)" : "var(--muted)",
              fontSize: "0.82rem",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            {f}
          </motion.button>
        ))}
      </div>

      {/* Grid */}
      <motion.div
        layout
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: "1.5rem",
        }}
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((project, i) => {
            const s = statusStyles[project.status] ?? statusStyles.academic
            return (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                whileHover={{ y: -8, borderColor: "var(--accent)" }}
                viewport={{ once: true }}
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: 16,
                  overflow: "hidden",
                  cursor: "pointer",
                  transition: "border-color 0.25s",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* Card header */}
                <div
                  style={{
                    height: 130,
                    background: `linear-gradient(135deg, ${project.gradient
                      .replace("from-[", "")
                      .replace("] to-[", ", ")
                      .replace("]", "")})`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "3rem",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <motion.span
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    style={{ display: "block" }}
                  >
                    {project.emoji}
                  </motion.span>
                </div>

                {/* Card body */}
                <div style={{ padding: "1.25rem", flex: 1, display: "flex", flexDirection: "column" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      marginBottom: "0.5rem",
                      flexWrap: "wrap",
                    }}
                  >
                    <h3
                      style={{
                        fontFamily: "'Syne', sans-serif",
                        fontSize: "1.05rem",
                        fontWeight: 700,
                      }}
                    >
                      {project.title}
                    </h3>
                    <span
                      style={{
                        fontSize: "0.62rem",
                        padding: "0.2rem 0.55rem",
                        borderRadius: 999,
                        fontWeight: 700,
                        background: s.bg,
                        color: s.color,
                      }}
                    >
                      {project.statusLabel}
                    </span>
                  </div>

                  <p
                    style={{
                      fontSize: "0.82rem",
                      color: "var(--muted)",
                      lineHeight: 1.65,
                      marginBottom: "1rem",
                      flex: 1,
                    }}
                  >
                    {project.desc}
                  </p>

                  {/* Tags */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "0.75rem" }}>
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        style={{
                          background: "var(--tag-bg)",
                          border: "1px solid var(--border)",
                          color: "var(--muted)",
                          fontSize: "0.65rem",
                          padding: "0.2rem 0.55rem",
                          borderRadius: 6,
                          fontWeight: 500,
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Links */}
                  <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                    {project.link && (
                      <motion.a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ x: 2 }}
                        style={{
                          fontSize: "0.78rem",
                          color: "var(--accent)",
                          fontWeight: 600,
                          display: "flex",
                          alignItems: "center",
                          gap: "0.3rem",
                        }}
                      >
                        ↗ {project.linkLabel}
                      </motion.a>
                    )}
                    {project.github && (
                      <motion.a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ x: 2 }}
                        style={{
                          fontSize: "0.78rem",
                          color: "var(--muted)",
                          fontWeight: 500,
                          display: "flex",
                          alignItems: "center",
                          gap: "0.3rem",
                        }}
                      >
                        ⌥ GitHub
                      </motion.a>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </motion.div>
    </section>
  )
}
