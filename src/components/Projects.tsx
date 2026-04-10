"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { projects } from "@/data"

const statusStyles: Record<string, { bg: string; color: string }> = {
  live: { bg: "#0f2d1f", color: "var(--accent3)" },
  building: { bg: "#1e1a2e", color: "var(--accent)" },
  academic: { bg: "#2d1e1e", color: "var(--accent2)" },
}

const filters = ["All", "Live", "Building", "Academic"] as const
type Filter = (typeof filters)[number]

// URLs to ping for live status
const liveUrls: Record<string, string> = {
  "canopycare": "https://canopycare-backend.onrender.com/api/health",
  "contentforge": "https://contentforge.net",
  "enterprise": "https://platform.contentforge.net",
}

type UpStatus = "checking" | "up" | "down"

function useProjectStatus(projectId: string, isLive: boolean) {
  const [status, setStatus] = useState<UpStatus>("checking")

  useEffect(() => {
    if (!isLive || !liveUrls[projectId]) {
      setStatus("up")
      return
    }

    const check = async () => {
      try {
        const res = await fetch(liveUrls[projectId], {
          method: "HEAD",
          mode: "no-cors",
          cache: "no-cache",
        })
        setStatus("up")
      } catch {
        setStatus("down")
      }
    }

    check()
    const interval = setInterval(check, 60000) // check every 60s
    return () => clearInterval(interval)
  }, [projectId, isLive])

  return status
}

function StatusDot({ projectId, isLive }: { projectId: string; isLive: boolean }) {
  const status = useProjectStatus(projectId, isLive)

  if (!isLive) return null

  const color = status === "checking" ? "#888" : status === "up" ? "#43e97b" : "#ff6584"
  const label = status === "checking" ? "Checking..." : status === "up" ? "Live" : "Down"

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 5, marginLeft: "auto" }}>
      <div style={{ position: "relative", width: 8, height: 8 }}>
        <div style={{
          width: 8, height: 8, borderRadius: "50%", background: color,
          position: "absolute",
        }} />
        {status === "up" && (
          <div style={{
            width: 8, height: 8, borderRadius: "50%", background: color,
            position: "absolute", opacity: 0.4,
            animation: "ping 1.5s ease-in-out infinite",
          }} />
        )}
      </div>
      <span style={{ fontSize: "0.65rem", color, fontWeight: 600 }}>{label}</span>
      <style>{`
        @keyframes ping {
          0% { transform: scale(1); opacity: 0.4; }
          100% { transform: scale(2.5); opacity: 0; }
        }
      `}</style>
    </div>
  )
}

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
            const isLive = project.status === "live"
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
                  <motion.div
                    whileHover={{ scale: 1.15, rotate: 3 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
                  >
                    <img
                      src={project.emoji}
                      alt={project.title}
                      width={64}
                      height={64}
                      style={{
                        objectFit: "contain",
                        filter: ["Enterprise Headless SaaS"].includes(project.title)
                          ? "invert(1) drop-shadow(0 8px 32px rgba(0,0,0,0.4))"
                          : "drop-shadow(0 8px 32px rgba(0,0,0,0.4))",
                      }}
                    />
                  </motion.div>
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
                        fontSize: "1.05rem",
                        fontWeight: 700,
                        fontFamily: "'Syne', sans-serif",
                      }}
                    >
                      {project.title}
                    </h3>
                    <span
                      style={{
                        fontSize: "0.65rem",
                        fontWeight: 700,
                        padding: "0.2rem 0.55rem",
                        borderRadius: 6,
                        background: s.bg,
                        color: s.color,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      {project.statusLabel}
                    </span>
                    <StatusDot projectId={project.id} isLive={isLive} />
                  </div>

                  <p
                    style={{
                      color: "var(--muted)",
                      fontSize: "0.82rem",
                      lineHeight: 1.7,
                      marginBottom: "1rem",
                      flex: 1,
                    }}
                  >
                    {project.desc}
                  </p>

                  {/* Tags */}
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "0.35rem",
                      marginBottom: "1rem",
                    }}
                  >
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        style={{
                          fontSize: "0.68rem",
                          padding: "0.18rem 0.5rem",
                          borderRadius: 5,
                          background: "rgba(108,99,255,0.1)",
                          color: "var(--muted)",
                          border: "1px solid rgba(108,99,255,0.15)",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Links */}
                  <div style={{ display: "flex", gap: "0.75rem", marginTop: "auto" }}>
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          fontSize: "0.78rem",
                          color: "var(--accent)",
                          textDecoration: "none",
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        ↗ {project.linkLabel}
                      </a>
                    )}
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          fontSize: "0.78rem",
                          color: "var(--muted)",
                          textDecoration: "none",
                        }}
                      >
                        ⌥ GitHub
                      </a>
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