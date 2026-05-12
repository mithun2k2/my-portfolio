"use client"
import { motion } from "framer-motion"

const cvUrl = "/Hassan_Mithun.pdf"

const highlights = [
  { label: "Languages", value: "Python · JavaScript · TypeScript · SQL" },
  { label: "Backend", value: "FastAPI · Node.js · Flask · REST · WebSockets" },
  { label: "Frontend", value: "React · Next.js 15 · Tailwind CSS · Vite" },
  { label: "Cloud", value: "Railway · Vercel · AWS · Docker · Cloudflare" },
  { label: "Databases", value: "PostgreSQL · Redis · Prisma · SQLAlchemy" },
  { label: "AI / ML", value: "Claude API · LangGraph · PyTorch · YOLOv8" },
  { label: "Integrations", value: "Stripe · Twilio · Auth0 · Google OAuth" },
]

const experience = [
  {
    role: "Founding Engineer",
    org: "ContentForge AI",
    period: "2024 – Present",
    bullets: [
      "7-agent AI pipeline · FastAPI · React · PostgreSQL · Railway",
      "Stripe live-mode billing · WebSocket real-time streaming",
      "ML pipeline: PyTorch Brand Drift Detector · sentence-transformers",
    ],
  },
  {
    role: "Founding Engineer",
    org: "BookingForge AI",
    period: "2025 – Present",
    bullets: [
      "LangGraph multi-agent orchestration · Twilio WhatsApp API",
      "FastAPI backend · PostgreSQL/Prisma · Next.js dashboard",
    ],
  },
  {
    role: "Founding Engineer",
    org: "Enterprise Headless SaaS",
    period: "2024 – Present",
    bullets: [
      "Next.js 15 · Auth0 v4 · Stripe · Cloudflare R2 · Upstash Redis",
      "4 vertical packages: Agency · Commerce · Enterprise · Franchise",
    ],
  },
  {
    role: "Computer Lab Technician",
    org: "University of East London",
    period: "2024 – 2025",
    bullets: [
      "VMware virtualised infrastructure · Windows Server 2022 AD DS",
      "IT asset audit · Ubuntu LAMP · ACE Support Portal",
    ],
  },
]

export default function Resume() {
  return (
    <section
      id="resume"
      style={{
        padding: "5rem 1.5rem",
        maxWidth: 900,
        margin: "0 auto",
        fontFamily: "'Syne', sans-serif",
      }}
    >
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        style={{ marginBottom: "3rem", textAlign: "center" }}
      >
        <p style={{ color: "var(--accent)", fontSize: "0.8rem", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "0.5rem" }}>
          Curriculum Vitae
        </p>
        <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 800, color: "#fff", margin: 0, lineHeight: 1.1 }}>
          Resume
        </h2>
        <p style={{ color: "#888", marginTop: "0.75rem", fontSize: "0.95rem", maxWidth: 480, margin: "0.75rem auto 0" }}>
          ATS-optimised · keyword-rich · built for founding engineer roles
        </p>
      </motion.div>

      {/* Download Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        style={{
          background: "linear-gradient(135deg, rgba(var(--accent-rgb, 99,102,241),0.12) 0%, rgba(255,255,255,0.03) 100%)",
          border: "1px solid rgba(var(--accent-rgb, 99,102,241),0.25)",
          borderRadius: 16,
          padding: "2rem",
          marginBottom: "2.5rem",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1.5rem",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
            <span style={{ fontSize: "1.5rem" }}>📄</span>
            <span style={{ color: "#fff", fontWeight: 700, fontSize: "1.1rem" }}>
              Hassan_Mithun_CV.pdf
            </span>
            <span style={{
              background: "rgba(34,197,94,0.15)",
              border: "1px solid rgba(34,197,94,0.3)",
              color: "#4ade80",
              fontSize: "0.7rem",
              padding: "2px 8px",
              borderRadius: 20,
              fontWeight: 600,
              letterSpacing: "0.05em",
            }}>
              ATS READY
            </span>
          </div>
          <p style={{ color: "#888", fontSize: "0.85rem", margin: 0 }}>
            Founding Engineer · Full-Stack · AI Systems · London, UK
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <motion.a
            href={cvUrl}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ y: -2, opacity: 0.9 }}
            whileTap={{ scale: 0.97 }}
            style={{
              background: "var(--accent)",
              color: "#fff",
              padding: "0.65rem 1.4rem",
              borderRadius: 10,
              fontWeight: 600,
              fontSize: "0.875rem",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Download CV
          </motion.a>
          <motion.a
            href={cvUrl}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            style={{
              border: "1px solid rgba(255,255,255,0.15)",
              color: "#ccc",
              padding: "0.65rem 1.4rem",
              borderRadius: 10,
              fontWeight: 600,
              fontSize: "0.875rem",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
            Preview
          </motion.a>
        </div>
      </motion.div>

      {/* Skills Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.15 }}
        style={{ marginBottom: "2.5rem" }}
      >
        <h3 style={{ color: "var(--accent)", fontSize: "0.75rem", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "1rem", fontWeight: 600 }}>
          Core Stack
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {highlights.map((row, i) => (
            <motion.div
              key={row.label}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05 * i }}
              style={{
                display: "grid",
                gridTemplateColumns: "110px 1fr",
                gap: "1rem",
                alignItems: "start",
                padding: "0.5rem 0.75rem",
                borderRadius: 8,
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <span style={{ color: "#666", fontSize: "0.78rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", paddingTop: 2 }}>
                {row.label}
              </span>
              <span style={{ color: "#ccc", fontSize: "0.88rem", lineHeight: 1.5 }}>
                {row.value}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Experience Snapshot */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h3 style={{ color: "var(--accent)", fontSize: "0.75rem", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "1rem", fontWeight: 600 }}>
          Experience Snapshot
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {experience.map((job, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.07 * i }}
              style={{
                padding: "1rem 1.25rem",
                borderRadius: 12,
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderLeft: "3px solid var(--accent)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "0.25rem", marginBottom: "0.5rem" }}>
                <div>
                  <span style={{ color: "#fff", fontWeight: 700, fontSize: "0.95rem" }}>{job.role}</span>
                  <span style={{ color: "var(--accent)", fontSize: "0.85rem", marginLeft: "0.5rem" }}>· {job.org}</span>
                </div>
                <span style={{ color: "#555", fontSize: "0.78rem" }}>{job.period}</span>
              </div>
              <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                {job.bullets.map((b, j) => (
                  <li key={j} style={{ color: "#888", fontSize: "0.82rem", paddingLeft: "0.75rem", position: "relative", marginBottom: "0.2rem" }}>
                    <span style={{ position: "absolute", left: 0, color: "var(--accent)" }}>›</span>
                    {b}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Bottom CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        style={{ textAlign: "center", marginTop: "2.5rem" }}
      >
        <p style={{ color: "#555", fontSize: "0.82rem" }}>
          Want the full version?
          <a
            href={cvUrl}
            download
            style={{ color: "var(--accent)", marginLeft: "0.4rem", textDecoration: "underline", fontWeight: 600 }}
          >
            Download the complete ATS CV →
          </a>
        </p>
      </motion.div>
    </section>
  )
}