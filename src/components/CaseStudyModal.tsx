"use client"

import { useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { caseStudies } from "@/data"

type Project = {
  id: string
  title: string
  desc: string
  tags: string[]
  emoji: string
  gradient: string
  link: string | null
  linkLabel: string | null
  github: string | null
  status: string
  statusLabel: string
}

export default function CaseStudyModal({
  project,
  onClose,
}: {
  project: Project | null
  onClose: () => void
}) {
  const study = project ? caseStudies[project.id] : null

  useEffect(() => {
    if (project) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => { document.body.style.overflow = "" }
  }, [project])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose])

  return (
    <AnimatePresence>
      {project && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: "fixed", inset: 0,
              background: "rgba(0,0,0,0.75)",
              backdropFilter: "blur(8px)",
              zIndex: 500,
            }}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.96 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              margin: "auto",
              width: "min(760px, 95vw)",
              height: "fit-content",
              maxHeight: "88vh",
              overflowY: "auto",
              background: "var(--bg)",
              border: "1px solid rgba(108,99,255,0.3)",
              borderRadius: 20,
              zIndex: 501,
              boxShadow: "0 24px 80px rgba(0,0,0,0.7), 0 0 60px rgba(108,99,255,0.1)",
            }}
          >
            {/* Header */}
            <div style={{
              height: 160,
              background: `linear-gradient(135deg, ${project.gradient
                .replace("from-[", "").replace("] to-[", ", ").replace("]", "")})`,
              position: "relative",
              display: "flex",
              alignItems: "center",
              padding: "0 2rem",
              gap: "1.25rem",
              flexShrink: 0,
            }}>
              <img src={project.emoji} alt={project.title} width={56} height={56}
                style={{ objectFit: "contain", filter: project.title.includes("Enterprise") ? "invert(1)" : "none" }} />
              <div>
                <div style={{ fontSize: "0.65rem", fontWeight: 700, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.25rem" }}>
                  Case Study
                </div>
                <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.6rem", fontWeight: 800, color: "#fff" }}>
                  {project.title}
                </h2>
                <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.6)", marginTop: "0.25rem" }}>
                  {project.statusLabel} · {project.tags.slice(0, 4).join(" · ")}
                </div>
              </div>

              {/* Close button */}
              <button onClick={onClose} style={{
                position: "absolute", top: "1rem", right: "1rem",
                width: 34, height: 34, borderRadius: "50%",
                background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)",
                color: "#fff", cursor: "pointer", fontSize: "1rem",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>✕</button>
            </div>

            {/* Content */}
            <div style={{ padding: "2rem" }}>

              {/* Metrics row */}
              {study && (
                <div style={{
                  display: "grid",
                  gridTemplateColumns: `repeat(${study.metrics.length}, 1fr)`,
                  gap: "1rem",
                  marginBottom: "2rem",
                }}>
                  {study.metrics.map((m, i) => (
                    <div key={i} style={{
                      background: "var(--surface)",
                      border: "1px solid var(--border)",
                      borderRadius: 12,
                      padding: "1rem",
                      textAlign: "center",
                    }}>
                      <div style={{ fontSize: "1.4rem", fontWeight: 800, fontFamily: "'Syne', sans-serif", color: "var(--accent)", marginBottom: "0.25rem" }}>
                        {m.value}
                      </div>
                      <div style={{ fontSize: "0.68rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                        {m.label}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {study ? (
                <>
                  {/* Problem */}
                  <section style={{ marginBottom: "1.75rem" }}>
                    <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: "0.75rem", fontWeight: 700, color: "var(--accent2)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "0.6rem" }}>
                      🔴 The Problem
                    </h3>
                    <p style={{ color: "var(--muted)", lineHeight: 1.75, fontSize: "0.9rem" }}>{study.problem}</p>
                  </section>

                  {/* Solution */}
                  <section style={{ marginBottom: "1.75rem" }}>
                    <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: "0.75rem", fontWeight: 700, color: "var(--accent3)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "0.6rem" }}>
                      ✅ The Solution
                    </h3>
                    <p style={{ color: "var(--muted)", lineHeight: 1.75, fontSize: "0.9rem" }}>{study.solution}</p>
                  </section>

                  {/* Architecture */}
                  <section style={{ marginBottom: "1.75rem" }}>
                    <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: "0.75rem", fontWeight: 700, color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "0.75rem" }}>
                      🏗️ Architecture
                    </h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                      {study.architecture.map((item, i) => (
                        <div key={i} style={{
                          display: "flex", alignItems: "flex-start", gap: "0.75rem",
                          background: "var(--surface)", border: "1px solid var(--border)",
                          borderRadius: 10, padding: "0.65rem 1rem",
                          fontSize: "0.85rem", color: "var(--text)", lineHeight: 1.5,
                        }}>
                          <span style={{ color: "var(--accent)", fontWeight: 700, flexShrink: 0, fontSize: "0.75rem", marginTop: "0.1rem" }}>
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          {item}
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Challenges */}
                  <section style={{ marginBottom: "2rem" }}>
                    <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: "0.75rem", fontWeight: 700, color: "#f7971e", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "0.75rem" }}>
                      ⚡ Key Challenges
                    </h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                      {study.challenges.map((c, i) => (
                        <div key={i} style={{
                          display: "flex", alignItems: "flex-start", gap: "0.75rem",
                          fontSize: "0.85rem", color: "var(--muted)", lineHeight: 1.6,
                          paddingLeft: "0.5rem",
                          borderLeft: "2px solid rgba(247,151,30,0.3)",
                        }}>
                          {c}
                        </div>
                      ))}
                    </div>
                  </section>
                </>
              ) : (
                <p style={{ color: "var(--muted)", lineHeight: 1.75, fontSize: "0.9rem", marginBottom: "2rem" }}>
                  {project.desc}
                </p>
              )}

              {/* Tags */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "1.5rem" }}>
                {project.tags.map(tag => (
                  <span key={tag} style={{
                    fontSize: "0.72rem", padding: "0.25rem 0.65rem",
                    borderRadius: 6, background: "rgba(108,99,255,0.1)",
                    color: "var(--accent)", border: "1px solid rgba(108,99,255,0.2)",
                  }}>{tag}</span>
                ))}
              </div>

              {/* Links */}
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                {project.link && (
                  <a href={project.link} target="_blank" rel="noopener noreferrer"
                    style={{
                      background: "var(--accent)", color: "#fff",
                      padding: "0.6rem 1.4rem", borderRadius: 10,
                      fontWeight: 600, fontSize: "0.875rem", textDecoration: "none",
                    }}>
                    ↗ View Live
                  </a>
                )}
                {project.github && (
                  <a href={project.github} target="_blank" rel="noopener noreferrer"
                    style={{
                      border: "1px solid var(--border)", color: "var(--text)",
                      padding: "0.6rem 1.4rem", borderRadius: 10,
                      fontWeight: 600, fontSize: "0.875rem", textDecoration: "none",
                    }}>
                    ⌥ GitHub
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}