"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

const PLATFORM_COLORS: Record<string, string> = {
  linkedin:  "#0077b5",
  twitter:   "#000000",
  instagram: "#e1306c",
  facebook:  "#1877f2",
}

const PLATFORM_ICONS: Record<string, string> = {
  linkedin: "in", twitter: "𝕏", instagram: "◉", facebook: "f",
}

type Post = {
  id: number
  master_content: string
  platforms: string
  status: string
  scheduled_at: string | null
  created_at: string
}

export default function Dashboard() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("http://localhost:8000/posts/1")
      .then(r => r.json())
      .then(data => { setPosts(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const statusColor: Record<string, string> = {
    draft:     "#6b7a99",
    scheduled: "#f97316",
    published: "#22c55e",
    failed:    "#ef4444",
  }

  return (
    <div style={{ minHeight: "100vh", background: "#080c14", fontFamily: "'DM Sans', sans-serif", color: "#e8edf5" }}>
      <nav style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "0 32px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", background: "#0c1120" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: "#f97316", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>⚡</div>
          <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 16, color: "#fff" }}>ScheduleForge</span>
        </div>
        <div style={{ display: "flex", gap: 16, fontSize: 14 }}>
          <Link href="/compose" style={{ color: "#6b7a99", textDecoration: "none" }}>Compose</Link>
          <Link href="/calendar" style={{ color: "#6b7a99", textDecoration: "none" }}>Calendar</Link>
          <Link href="/connect" style={{ color: "#6b7a99", textDecoration: "none" }}>Connect</Link>
        </div>
        <Link href="/compose" style={{ background: "#f97316", color: "#fff", borderRadius: 8, padding: "8px 16px", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
          + New post
        </Link>
      </nav>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
          <div>
            <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 26, fontWeight: 800, color: "#fff", marginBottom: 4 }}>Your posts</h1>
            <p style={{ color: "#6b7a99", fontSize: 14 }}>{posts.length} total · {posts.filter(p => p.status === "scheduled").length} scheduled</p>
          </div>
        </div>

        {loading && <p style={{ color: "#6b7a99" }}>Loading...</p>}

        {!loading && posts.length === 0 && (
          <div style={{ textAlign: "center", padding: "80px 24px", background: "#0e1520", borderRadius: 16, border: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>✍️</div>
            <h3 style={{ fontFamily: "'Syne', sans-serif", color: "#fff", marginBottom: 8 }}>No posts yet</h3>
            <p style={{ color: "#6b7a99", marginBottom: 24 }}>Create your first post and publish to all platforms at once.</p>
            <Link href="/compose" style={{ background: "#f97316", color: "#fff", borderRadius: 8, padding: "10px 24px", fontSize: 14, fontWeight: 600, textDecoration: "none" }}>
              ⚡ Create first post
            </Link>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {posts.map(post => (
            <div key={post.id} style={{ background: "#0e1520", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "20px 24px", display: "flex", alignItems: "flex-start", gap: 16 }}>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14, color: "#c8d0e0", lineHeight: 1.6, marginBottom: 12, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                  {post.master_content}
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 11, color: statusColor[post.status] || "#6b7a99", background: `${statusColor[post.status]}15`, border: `1px solid ${statusColor[post.status]}30`, borderRadius: 100, padding: "2px 10px", textTransform: "capitalize" }}>
                    {post.status}
                  </span>
                  <div style={{ display: "flex", gap: 4 }}>
                    {post.platforms.split(",").map(pid => (
                      <span key={pid} style={{ fontSize: 11, background: `${PLATFORM_COLORS[pid]}20`, color: "#fff", borderRadius: 4, padding: "2px 8px" }}>
                        {PLATFORM_ICONS[pid]} {pid}
                      </span>
                    ))}
                  </div>
                  {post.scheduled_at && (
                    <span style={{ fontSize: 12, color: "#6b7a99" }}>
                      📅 {new Date(post.scheduled_at).toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500&display=swap');`}</style>
    </div>
  )
}
