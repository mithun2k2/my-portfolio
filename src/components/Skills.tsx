"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { skills } from "@/data"

// Radar chart data — 8 key skill categories
const radarData = [
  { label: "AI / ML", value: 88 },
  { label: "Backend", value: 90 },
  { label: "Frontend", value: 85 },
  { label: "Data Science", value: 78 },
  { label: "DevOps", value: 72 },
  { label: "Databases", value: 82 },
  { label: "Cloud", value: 85 },
  { label: "Java / OOP", value: 70 },
]

function RadarChart() {
  const [animated, setAnimated] = useState(false)
  const [hovered, setHovered] = useState<number | null>(null)
  const ref = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setAnimated(true) },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  const size = 320
  const cx = size / 2
  const cy = size / 2
  const maxR = 105
  const levels = 5
  const n = radarData.length

  const angle = (i: number) => (Math.PI * 2 * i) / n - Math.PI / 2

  const toXY = (i: number, r: number) => ({
    x: cx + r * Math.cos(angle(i)),
    y: cy + r * Math.sin(angle(i)),
  })

  // Web polygon points
  const points = radarData.map((d, i) => {
    const r = animated ? (d.value / 100) * maxR : 0
    return toXY(i, r)
  })

  const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") + " Z"

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
      <svg
        ref={ref}
        width={size}
        height={size}
        style={{ overflow: "visible" }}
      >
        {/* Grid levels */}
        {Array.from({ length: levels }).map((_, lvl) => {
          const r = (maxR * (lvl + 1)) / levels
          const pts = Array.from({ length: n }, (_, i) => toXY(i, r))
          const d = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") + " Z"
          return (
            <path
              key={lvl}
              d={d}
              fill="none"
              stroke="rgba(108,99,255,0.12)"
              strokeWidth={1}
            />
          )
        })}

        {/* Axis lines */}
        {radarData.map((_, i) => {
          const end = toXY(i, maxR)
          return (
            <line
              key={i}
              x1={cx} y1={cy}
              x2={end.x} y2={end.y}
              stroke="rgba(108,99,255,0.15)"
              strokeWidth={1}
            />
          )
        })}

        {/* Data polygon */}
        <motion.path
          d={pathD}
          fill="rgba(108,99,255,0.15)"
          stroke="url(#radarGrad)"
          strokeWidth={2.5}
          strokeLinejoin="round"
          initial={{ opacity: 0, scale: 0 }}
          animate={animated ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{ transformOrigin: `${cx}px ${cy}px` }}
        />

        {/* Gradient def */}
        <defs>
          <linearGradient id="radarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6c63ff" />
            <stop offset="100%" stopColor="#ff6584" />
          </linearGradient>
        </defs>

        {/* Data points */}
        {points.map((p, i) => (
          <motion.circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={hovered === i ? 7 : 5}
            fill={hovered === i ? "#ff6584" : "#6c63ff"}
            stroke="rgba(12,12,20,0.8)"
            strokeWidth={2}
            initial={{ opacity: 0, scale: 0 }}
            animate={animated ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.8 + i * 0.05 }}
            style={{ cursor: "pointer", transformOrigin: `${p.x}px ${p.y}px` }}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          />
        ))}

        {/* Labels */}
        {radarData.map((d, i) => {
          const labelR = maxR + 28
          const pos = toXY(i, labelR)
          const isHovered = hovered === i
          return (
            <g key={i}>
              <text
                x={pos.x}
                y={pos.y + 4}
                textAnchor="middle"
                fontSize={isHovered ? "11" : "10"}
                fontWeight={isHovered ? "700" : "500"}
                fill={isHovered ? "#6c63ff" : "rgba(255,255,255,0.6)"}
                fontFamily="'DM Sans', sans-serif"
                style={{ transition: "all 0.2s" }}
              >
                {d.label}
              </text>
              {isHovered && (
                <text
                  x={pos.x}
                  y={pos.y + 16}
                  textAnchor="middle"
                  fontSize="9"
                  fill="#ff6584"
                  fontFamily="'DM Sans', sans-serif"
                  fontWeight="700"
                >
                  {d.value}%
                </text>
              )}
            </g>
          )
        })}

        {/* Center label */}
        <text x={cx} y={cy - 6} textAnchor="middle" fontSize="11" fill="rgba(255,255,255,0.4)" fontFamily="'DM Sans', sans-serif">Skills</text>
        <text x={cx} y={cy + 8} textAnchor="middle" fontSize="9" fill="rgba(108,99,255,0.6)" fontFamily="'DM Sans', sans-serif">Radar</text>
      </svg>

      {/* Legend */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", justifyContent: "center", maxWidth: 300 }}>
        {radarData.map((d, i) => (
          <div
            key={i}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            style={{
              display: "flex", alignItems: "center", gap: 5,
              fontSize: "0.68rem", color: hovered === i ? "#6c63ff" : "rgba(255,255,255,0.5)",
              cursor: "pointer", transition: "color 0.2s",
              fontWeight: hovered === i ? 700 : 400,
            }}
          >
            <div style={{
              width: 6, height: 6, borderRadius: "50%",
              background: hovered === i ? "#ff6584" : "#6c63ff",
              transition: "background 0.2s",
            }} />
            {d.label} <span style={{ color: hovered === i ? "#ff6584" : "rgba(255,255,255,0.3)" }}>{d.value}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Skills() {
  return (
    <section id="skills" className="section-wrapper">
      <p className="section-label">Tech Stack</p>
      <h2 className="section-title">Skills &amp; Technologies</h2>
      <p className="section-sub">
        Production-tested across multiple SaaS platforms, agentic AI systems, and academic projects.
      </p>

      {/* Layout: radar + skill cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "300px 1fr",
        gap: "3rem",
        alignItems: "start",
        marginBottom: "1rem",
      }}
      className="skills-grid"
      >
        {/* Radar chart */}
        <div style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 16,
          padding: "1.5rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.5rem",
          position: "sticky",
          top: "5rem",
        }}>
          <p style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--accent)", fontWeight: 600, marginBottom: "0.25rem" }}>
            Skill Profile
          </p>
          <RadarChart />
        </div>

        {/* Skill cards grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
          gap: "1rem",
        }}>
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
              <div style={{ marginBottom: "0.6rem", display: "flex", justifyContent: "center" }}>
                <img
                  src={skill.icon}
                  alt={skill.name}
                  width={44}
                  height={44}
                  style={{
                    objectFit: "contain",
                    filter: ["React / Next.js", "Railway / Vercel", "Prisma / Supabase"].includes(skill.name)
                      ? "invert(1)"
                      : "none",
                  }}
                />
              </div>
              <div style={{ fontSize: "0.78rem", fontWeight: 600, marginBottom: "0.2rem" }}>{skill.name}</div>
              <div style={{ fontSize: "0.65rem", color: "var(--muted)", marginBottom: "0.6rem" }}>{skill.level}</div>
              <div style={{ height: 3, borderRadius: 2, background: "var(--border)", overflow: "hidden" }}>
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${skill.pct}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: i * 0.04, ease: "easeOut" }}
                  style={{
                    height: "100%",
                    borderRadius: 2,
                    background: "linear-gradient(90deg, var(--accent), var(--accent2))",
                  }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .skills-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  )
}