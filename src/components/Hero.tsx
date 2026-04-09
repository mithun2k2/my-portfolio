"use client"

import { motion } from "framer-motion"

const floatingChips = [
  { label: "FastAPI + LangGraph", color: "var(--accent3)", top: "15%", right: "-5%", delay: 0.6 },
  { label: "Next.js 15", color: "var(--accent)", top: "55%", left: "-8%", delay: 0.8 },
  { label: "AI / ML", color: "var(--accent2)", bottom: "20%", right: "5%", delay: 1.0 },
]

export default function Hero() {
  return (
    <section
      id="top"
      style={{ maxWidth: 1100, margin: "0 auto", padding: "5rem 2rem 4rem" }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "4rem",
          alignItems: "center",
        }}
      >
        {/* Left: text */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "var(--surface2)",
              border: "1px solid var(--border)",
              borderRadius: 999,
              padding: "0.35rem 1rem",
              fontSize: "0.75rem",
              color: "var(--accent)",
              marginBottom: "1.5rem",
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "var(--accent3)",
                display: "inline-block",
                animation: "pulse 2s infinite",
              }}
            />
            <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}`}</style>
            Open to internships &amp; collaboration
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{
              fontSize: "clamp(2.4rem, 4.5vw, 3.6rem)",
              fontWeight: 800,
              lineHeight: 1.05,
              marginBottom: "1rem",
            }}
          >
            Mahmudul
            <br />
            <span
              style={{
                background: "linear-gradient(135deg, var(--accent), var(--accent2))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Hassan
            </span>
            <br />
            Mithun
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{
              color: "var(--muted)",
              lineHeight: 1.8,
              fontSize: "1rem",
              maxWidth: 460,
              marginBottom: "2rem",
            }}
          >
            AI-powered SaaS builder &amp; Data Science student at University of East London.
            I build production-grade AI applications, multi-tenant SaaS platforms, and
            intelligent automation tools — from concept to live deployment.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}
          >
            <motion.a
              href="#projects"
              whileHover={{ opacity: 0.85, y: -2 }}
              whileTap={{ scale: 0.97 }}
              style={{
                background: "var(--accent)",
                color: "#fff",
                padding: "0.75rem 1.8rem",
                borderRadius: 10,
                fontWeight: 600,
                fontSize: "0.9rem",
              }}
            >
              View Projects
            </motion.a>
            <motion.a
              href="https://github.com/mithun2k2"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ borderColor: "var(--accent)", y: -2 }}
              whileTap={{ scale: 0.97 }}
              style={{
                border: "1px solid var(--border)",
                color: "var(--text)",
                padding: "0.75rem 1.8rem",
                borderRadius: 10,
                fontWeight: 600,
                fontSize: "0.9rem",
                transition: "border-color 0.2s",
              }}
            >
              GitHub ↗
            </motion.a>
            <motion.a
              href="/Hassan_CV_2026.pdf"
              download="Hassan_CV_2026.pdf"
              whileHover={{ borderColor: "var(--accent2)", y: -2 }}
              whileTap={{ scale: 0.97 }}
              style={{
                border: "1px solid var(--accent2)",
                color: "var(--accent2)",
                padding: "0.75rem 1.8rem",
                borderRadius: 10,
                fontWeight: 600,
                fontSize: "0.9rem",
                transition: "border-color 0.2s",
              }}
            >
              ↓ Download CV
            </motion.a>
          </motion.div>
        </div>

        {/* Right: avatar visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          style={{ position: "relative", display: "flex", justifyContent: "center", alignItems: "center" }}
        >
          {/* Spinning ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            style={{
              width: 260,
              height: 260,
              borderRadius: "50%",
              background: "linear-gradient(135deg, var(--accent), var(--accent2), var(--accent3))",
              padding: 3,
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #1a1a2e, #16213e)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "4.5rem",
              }}
            >
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" alt="AI" width={110} height={110} style={{ objectFit: "contain" }} />
            </div>
          </motion.div>

          {/* Floating chips */}
          {floatingChips.map((chip, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: chip.delay, duration: 0.4 }}
              style={{
                position: "absolute",
                ...(chip.top ? { top: chip.top } : {}),
                ...(chip.bottom ? { bottom: chip.bottom } : {}),
                ...(chip.right ? { right: chip.right } : {}),
                ...(chip.left ? { left: chip.left } : {}),
                background: "var(--surface2)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                padding: "0.4rem 0.8rem",
                fontSize: "0.72rem",
                fontWeight: 600,
                color: chip.color,
                whiteSpace: "nowrap",
              }}
            >
              ✦ {chip.label}
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Stats row */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: "1rem",
          marginTop: "4rem",
        }}
      >
        {[
          { num: "5+", label: "Live SaaS Products" },
          { num: "10+", label: "Projects Built" },
          { num: "94%", label: "YOLOv8 Accuracy" },
          { num: "BSc", label: "Data Science & AI, UEL" },
        ].map((stat, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -4, borderColor: "var(--accent)" }}
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 12,
              padding: "1.5rem",
              textAlign: "center",
              transition: "border-color 0.2s",
            }}
          >
            <div
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: "2rem",
                fontWeight: 800,
                background: "linear-gradient(135deg, var(--accent), var(--accent2))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {stat.num}
            </div>
            <div style={{ fontSize: "0.78rem", color: "var(--muted)", marginTop: "0.25rem" }}>
              {stat.label}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
