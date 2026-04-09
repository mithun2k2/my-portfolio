"use client"

import { motion } from "framer-motion"
import { skills } from "@/data"

export default function Skills() {
  return (
    <section id="skills" className="section-wrapper">
      <p className="section-label">Tech Stack</p>
      <h2 className="section-title">Skills &amp; Technologies</h2>
      <p className="section-sub">
        Production-tested across multiple SaaS platforms, agentic AI systems, and academic projects.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
          gap: "1rem",
        }}
      >
        {skills.map((skill, i) => (
          <motion.div
            key={skill.name}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.4, delay: i * 0.04 }}
            whileHover={{ y: -5, borderColor: "var(--accent)" }}
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 12,
              padding: "1.25rem",
              textAlign: "center",
              cursor: "default",
              transition: "border-color 0.25s",
            }}
          >
            <div style={{ fontSize: "1.8rem", marginBottom: "0.5rem" }}>{skill.icon}</div>
            <div
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: "0.8rem",
                fontWeight: 700,
                marginBottom: "0.2rem",
              }}
            >
              {skill.name}
            </div>
            <div style={{ fontSize: "0.68rem", color: "var(--muted)", marginBottom: "0.6rem" }}>
              {skill.level}
            </div>
            <div
              style={{
                width: "100%",
                height: 3,
                background: "var(--border)",
                borderRadius: 999,
                overflow: "hidden",
              }}
            >
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${skill.pct}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.04 + 0.2, ease: "easeOut" }}
                style={{
                  height: "100%",
                  borderRadius: 999,
                  background: "linear-gradient(90deg, var(--accent), var(--accent2))",
                }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
