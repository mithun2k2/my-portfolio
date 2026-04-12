"use client"

import Link from "next/link"

const PLATFORMS = [
  {
    id: "linkedin", label: "LinkedIn", color: "#0077b5", icon: "in",
    desc: "Post articles, updates and connect with professionals.",
    authUrl: "https://scheduleforge-ai.onrender.com/auth/linkedin",
  },
  {
    id: "twitter", label: "Twitter / X", color: "#000", icon: "𝕏",
    desc: "Post threads and tweets to your followers.",
    authUrl: "#", soon: true,
  },
  {
    id: "instagram", label: "Instagram", color: "#e1306c", icon: "◉",
    desc: "Share captions and stories to your audience.",
    authUrl: "#", soon: true,
  },
  {
    id: "facebook", label: "Facebook", color: "#1877f2", icon: "f",
    desc: "Post to your page and groups automatically.",
    authUrl: "#", soon: true,
  },
]

export default function Connect() {
  return (
    <div style={{ minHeight: "100vh", background: "#080c14", fontFamily: "'DM Sans', sans-serif", color: "#e8edf5" }}>
      <nav style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "0 32px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", background: "#0c1120" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: "#f97316", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>⚡</div>
          <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 16, color: "#fff" }}>ScheduleForge</span>
        </div>
        <div style={{ display: "flex", gap: 16, fontSize: 14 }}>
          <Link href="/compose"   style={{ color: "#6b7a99", textDecoration: "none" }}>Compose</Link>
          <Link href="/dashboard" style={{ color: "#6b7a99", textDecoration: "none" }}>Dashboard</Link>
        </div>
      </nav>

      <div style={{ maxWidth: 700, margin: "0 auto", padding: "48px 24px" }}>
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 26, fontWeight: 800, color: "#fff", marginBottom: 8 }}>
          Connect your accounts
        </h1>
        <p style={{ color: "#6b7a99", marginBottom: 36, fontSize: 15 }}>
          Connect at least one platform to start publishing automatically.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {PLATFORMS.map(p => (
            <div key={p.id} style={{ background: "#0e1520", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: "20px 24px", display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: `${p.color}20`, border: `1px solid ${p.color}40`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 16, color: "#fff", flexShrink: 0 }}>
                {p.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span style={{ fontWeight: 600, fontSize: 15, color: "#fff" }}>{p.label}</span>
                  {p.soon && <span style={{ fontSize: 10, background: "rgba(249,115,22,0.15)", color: "#f97316", border: "1px solid rgba(249,115,22,0.3)", borderRadius: 100, padding: "1px 8px", fontWeight: 600 }}>SOON</span>}
                </div>
                <p style={{ fontSize: 13, color: "#6b7a99", margin: 0 }}>{p.desc}</p>
              </div>
              <a
                href={p.authUrl}
                style={{
                  background: p.soon ? "transparent" : p.color,
                  border: p.soon ? "1px solid rgba(255,255,255,0.1)" : "none",
                  color: p.soon ? "#6b7a99" : "#fff",
                  borderRadius: 8, padding: "8px 18px", fontSize: 13,
                  fontWeight: 600, textDecoration: "none", whiteSpace: "nowrap",
                  cursor: p.soon ? "not-allowed" : "pointer",
                  opacity: p.soon ? 0.5 : 1,
                  pointerEvents: p.soon ? "none" : "auto",
                }}
              >
                {p.soon ? "Coming soon" : "Connect →"}
              </a>
            </div>
          ))}
        </div>
      </div>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500&display=swap');`}</style>
    </div>
  )
}