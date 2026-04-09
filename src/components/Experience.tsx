"use client"

import { motion } from "framer-motion"
import { timeline, recommendations } from "@/data"

export default function Experience() {
  return (
    <>
      {/* Timeline */}
      <section id="experience" className="section-wrapper">
        <p className="section-label">Journey</p>
        <h2 className="section-title">Experience &amp; Education</h2>
        <p className="section-sub">From engineering roots in Bangladesh to building live AI SaaS products in London.</p>

        <div style={{ position: "relative", paddingLeft: "2rem" }}>
          {/* Vertical line */}
          <div
            style={{
              position: "absolute",
              left: "0.45rem",
              top: 0,
              bottom: 0,
              width: 1,
              background: "var(--border)",
            }}
          />

          {timeline.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              style={{
                position: "relative",
                paddingLeft: "1.5rem",
                marginBottom: "2.25rem",
              }}
            >
              {/* Dot */}
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.1 + 0.1 }}
                style={{
                  position: "absolute",
                  left: "-1.75rem",
                  top: "0.3rem",
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: "var(--accent)",
                  border: "2px solid var(--bg)",
                }}
              />

              <div
                style={{
                  fontSize: "0.72rem",
                  color: "var(--accent)",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: "0.2rem",
                }}
              >
                {item.icon} {item.date}
              </div>
              <div
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: "1rem",
                  fontWeight: 700,
                  marginBottom: "0.2rem",
                }}
              >
                {item.title}
              </div>
              <div style={{ fontSize: "0.83rem", color: "var(--muted)" }}>{item.sub}</div>
            </motion.div>
          ))}
        </div>
      </section>

      <div className="divider" />

      {/* Recommendations */}
      <section className="section-wrapper">
        <p className="section-label">Social Proof</p>
        <h2 className="section-title">Recommendations</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "1rem",
          }}
        >
          {recommendations.map((rec, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              whileHover={{ y: -4, borderColor: "var(--border-hover)" }}
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 12,
                padding: "1.5rem",
                transition: "border-color 0.2s",
              }}
            >
              <div
                style={{
                  fontSize: "1.5rem",
                  marginBottom: "0.75rem",
                  color: "var(--accent)",
                  fontFamily: "Georgia, serif",
                  lineHeight: 1,
                }}
              >
                "
              </div>
              <p
                style={{
                  fontSize: "0.88rem",
                  color: "var(--muted)",
                  lineHeight: 1.75,
                  fontStyle: "italic",
                  marginBottom: "1rem",
                }}
              >
                {rec.quote}
              </p>
              <div style={{ fontSize: "0.78rem", fontWeight: 600 }}>— {rec.author}</div>
            </motion.div>
          ))}
        </div>
      </section>
    </>
  )
}
