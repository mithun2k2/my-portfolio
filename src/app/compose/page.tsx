"use client"

import { useState } from "react"

const PLATFORMS = [
  { id: "linkedin",  label: "LinkedIn",  color: "#0077b5", icon: "in" },
  { id: "twitter",   label: "Twitter/X", color: "#1d9bf0", icon: "𝕏"  },
  { id: "instagram", label: "Instagram", color: "#e1306c", icon: "◉"  },
  { id: "facebook",  label: "Facebook",  color: "#1877f2", icon: "f"  },
]

type Variants = Record<string, string>

export default function Compose() {
  const [content, setContent]       = useState("")
  const [platforms, setPlatforms]   = useState<string[]>(["linkedin", "twitter", "instagram", "facebook"])
  const [variants, setVariants]     = useState<Variants>({})
  const [loading, setLoading]       = useState(false)
  const [scheduling, setScheduling] = useState(false)
  const [scheduled, setScheduled]   = useState(false)
  const [activeTab, setActiveTab]   = useState("linkedin")
  const [scheduleTime, setScheduleTime] = useState("")
  const [step, setStep]             = useState<"compose"|"review"|"schedule">("compose")
  const [editingVariant, setEditingVariant] = useState<string|null>(null)

  const togglePlatform = (id: string) => {
    setPlatforms(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    )
  }

  const repurpose = async () => {
    if (!content.trim() || platforms.length === 0) return
    setLoading(true)
    try {
      const res = await fetch("https://scheduleforge-ai.onrender.com/repurpose/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ master_content: content, platforms }),
      })
      const data = await res.json()
      setVariants(data.variants)
      setActiveTab(platforms[0])
      setStep("review")
    } catch (e) {
      alert("Error connecting to backend. Is it running?")
    } finally {
      setLoading(false)
    }
  }

  const schedulePost = async () => {
    if (!scheduleTime) return
    setScheduling(true)
    try {
      const postRes = await fetch("https://scheduleforge-ai.onrender.com/posts/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: 1,
          master_content: content,
          platforms,
          scheduled_at: new Date(scheduleTime).toISOString(),
        }),
      })
      const post = await postRes.json()
      await fetch("https://scheduleforge-ai.onrender.com/schedule/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          post_id: post.post_id,
          user_id: 1,
          scheduled_at: new Date(scheduleTime).toISOString(),
        }),
      })
      setScheduled(true)
    } catch (e) {
      alert("Error scheduling post.")
    } finally {
      setScheduling(false)
    }
  }

  const charCount = content.length
  const platform  = PLATFORMS.find(p => p.id === activeTab)

  return (
    <div style={{ minHeight: "100vh", background: "#080c14", fontFamily: "'DM Sans', sans-serif", color: "#e8edf5" }}>

      {/* Top nav */}
      <nav style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "0 32px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", background: "#0c1120" }}>
        <a href="https://mhassanmithun.com" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: "#f97316", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>⚡</div>
          <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 16, color: "#fff" }}>ScheduleForge</span>
        </a>
        <div style={{ display: "flex", gap: 8 }}>
          {["compose","review","schedule"].map((s, i) => (
            <div key={s} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{
                width: 24, height: 24, borderRadius: "50%", fontSize: 11, fontWeight: 600,
                display: "flex", alignItems: "center", justifyContent: "center",
                background: step === s ? "#f97316" : (["compose","review","schedule"].indexOf(step) > i ? "rgba(249,115,22,0.3)" : "rgba(255,255,255,0.08)"),
                color: step === s ? "#fff" : (["compose","review","schedule"].indexOf(step) > i ? "#f97316" : "#6b7a99"),
              }}>{i + 1}</div>
              <span style={{ fontSize: 12, color: step === s ? "#f97316" : "#6b7a99", textTransform: "capitalize" }}>{s}</span>
              {i < 2 && <span style={{ color: "rgba(255,255,255,0.15)", marginLeft: 4 }}>›</span>}
            </div>
          ))}
        </div>
        <a href="/dashboard" style={{ fontSize: 13, color: "#6b7a99", textDecoration: "none" }}>Dashboard →</a>
      </nav>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px" }}>

        {/* ── STEP 1: COMPOSE ── */}
        {step === "compose" && (
          <div style={{ animation: "fadeIn 0.3s ease" }}>
            <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 800, color: "#fff", marginBottom: 6 }}>
              Write your master post
            </h1>
            <p style={{ color: "#6b7a99", marginBottom: 32, fontSize: 15 }}>
              Write once — AI adapts it for every platform you select.
            </p>

            {/* Content textarea */}
            <div style={{ position: "relative", marginBottom: 24 }}>
              <textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="What do you want to share with the world today?&#10;&#10;Write your core message here. Don't worry about platform-specific formatting — AI will handle that."
                style={{
                  width: "100%", minHeight: 220, background: "#0e1520",
                  border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12,
                  padding: "20px", color: "#e8edf5", fontSize: 15, lineHeight: 1.7,
                  resize: "vertical", outline: "none", fontFamily: "inherit",
                  boxSizing: "border-box",
                }}
                onFocus={e => e.target.style.borderColor = "rgba(249,115,22,0.4)"}
                onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
              />
              <div style={{ position: "absolute", bottom: 12, right: 16, fontSize: 12, color: charCount > 2000 ? "#ef4444" : "#6b7a99" }}>
                {charCount} chars
              </div>
            </div>

            {/* Platform selector */}
            <div style={{ marginBottom: 32 }}>
              <p style={{ fontSize: 13, color: "#6b7a99", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.08em" }}>Publish to</p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {PLATFORMS.map(p => (
                  <button
                    key={p.id}
                    onClick={() => togglePlatform(p.id)}
                    style={{
                      padding: "10px 18px", borderRadius: 10, fontSize: 14, fontWeight: 500,
                      cursor: "pointer", border: "1px solid",
                      borderColor: platforms.includes(p.id) ? p.color : "rgba(255,255,255,0.1)",
                      background: platforms.includes(p.id) ? `${p.color}20` : "transparent",
                      color: platforms.includes(p.id) ? "#fff" : "#6b7a99",
                      display: "flex", alignItems: "center", gap: 8,
                      transition: "all 0.2s ease",
                    }}
                  >
                    <span style={{ fontWeight: 700, fontSize: 13 }}>{p.icon}</span>
                    {p.label}
                    {platforms.includes(p.id) && <span style={{ color: p.color, fontSize: 12 }}>✓</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Repurpose button */}
            <button
              onClick={repurpose}
              disabled={loading || !content.trim() || platforms.length === 0}
              style={{
                background: loading ? "rgba(249,115,22,0.4)" : "#f97316",
                color: "#fff", border: "none", borderRadius: 10,
                padding: "14px 32px", fontSize: 15, fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", gap: 10,
                transition: "all 0.2s ease",
              }}
            >
              {loading ? (
                <>
                  <span style={{ animation: "spin 1s linear infinite", display: "inline-block" }}>⟳</span>
                  AI is repurposing...
                </>
              ) : (
                <>⚡ Repurpose with AI</>
              )}
            </button>
          </div>
        )}

        {/* ── STEP 2: REVIEW VARIANTS ── */}
        {step === "review" && (
          <div style={{ animation: "fadeIn 0.3s ease" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
              <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 800, color: "#fff" }}>
                Review your variants
              </h1>
              <button onClick={() => setStep("compose")} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "#6b7a99", borderRadius: 8, padding: "6px 14px", fontSize: 13, cursor: "pointer" }}>
                ← Edit original
              </button>
            </div>
            <p style={{ color: "#6b7a99", marginBottom: 28, fontSize: 15 }}>
              Edit any variant before scheduling. Each is optimised for its platform.
            </p>

            {/* Platform tabs */}
            <div style={{ display: "flex", gap: 4, marginBottom: 20, borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: 0 }}>
              {platforms.map(pid => {
                const p = PLATFORMS.find(x => x.id === pid)!
                return (
                  <button
                    key={pid}
                    onClick={() => { setActiveTab(pid); setEditingVariant(null) }}
                    style={{
                      background: "transparent", border: "none", cursor: "pointer",
                      padding: "10px 18px", fontSize: 13, fontWeight: 600,
                      color: activeTab === pid ? "#fff" : "#6b7a99",
                      borderBottom: activeTab === pid ? `2px solid ${p.color}` : "2px solid transparent",
                      marginBottom: -1, transition: "all 0.2s ease",
                    }}
                  >
                    {p.icon} {p.label}
                  </button>
                )
              })}
            </div>

            {/* Variant content */}
            {variants[activeTab] && (
              <div style={{ background: "#0e1520", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: 24, marginBottom: 24 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: platform?.color }} />
                    <span style={{ fontSize: 13, color: "#6b7a99" }}>Optimised for {platform?.label}</span>
                  </div>
                  <button
                    onClick={() => setEditingVariant(editingVariant === activeTab ? null : activeTab)}
                    style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "#6b7a99", borderRadius: 6, padding: "4px 12px", fontSize: 12, cursor: "pointer" }}
                  >
                    {editingVariant === activeTab ? "Done" : "Edit"}
                  </button>
                </div>

                {editingVariant === activeTab ? (
                  <textarea
                    value={variants[activeTab]}
                    onChange={e => setVariants(prev => ({ ...prev, [activeTab]: e.target.value }))}
                    style={{
                      width: "100%", minHeight: 300, background: "#080c14",
                      border: "1px solid rgba(249,115,22,0.3)", borderRadius: 8,
                      padding: 16, color: "#e8edf5", fontSize: 14, lineHeight: 1.7,
                      resize: "vertical", outline: "none", fontFamily: "inherit",
                      boxSizing: "border-box",
                    }}
                  />
                ) : (
                  <div style={{ fontSize: 14, lineHeight: 1.8, color: "#c8d0e0", whiteSpace: "pre-wrap" }}>
                    {variants[activeTab]}
                  </div>
                )}

                <div style={{ marginTop: 16, fontSize: 12, color: "#6b7a99" }}>
                  {variants[activeTab].length} characters
                </div>
              </div>
            )}

            <button
              onClick={() => setStep("schedule")}
              style={{
                background: "#f97316", color: "#fff", border: "none",
                borderRadius: 10, padding: "14px 32px", fontSize: 15,
                fontWeight: 600, cursor: "pointer",
              }}
            >
              Schedule posts →
            </button>
          </div>
        )}

        {/* ── STEP 3: SCHEDULE ── */}
        {step === "schedule" && !scheduled && (
          <div style={{ animation: "fadeIn 0.3s ease", maxWidth: 560 }}>
            <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 800, color: "#fff", marginBottom: 6 }}>
              Schedule your posts
            </h1>
            <p style={{ color: "#6b7a99", marginBottom: 32, fontSize: 15 }}>
              Pick a time and all {platforms.length} platform variants will publish automatically.
            </p>

            {/* Summary */}
            <div style={{ background: "#0e1520", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: 20, marginBottom: 24 }}>
              <p style={{ fontSize: 13, color: "#6b7a99", marginBottom: 12 }}>Publishing to</p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {platforms.map(pid => {
                  const p = PLATFORMS.find(x => x.id === pid)!
                  return (
                    <span key={pid} style={{ background: `${p.color}20`, border: `1px solid ${p.color}40`, color: "#fff", borderRadius: 6, padding: "4px 10px", fontSize: 13 }}>
                      {p.icon} {p.label}
                    </span>
                  )
                })}
              </div>
            </div>

            {/* Date/time picker */}
            <div style={{ marginBottom: 28 }}>
              <label style={{ display: "block", fontSize: 13, color: "#6b7a99", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Schedule for
              </label>
              <input
                type="datetime-local"
                value={scheduleTime}
                onChange={e => setScheduleTime(e.target.value)}
                min={new Date().toISOString().slice(0, 16)}
                style={{
                  background: "#0e1520", border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 10, padding: "12px 16px", color: "#e8edf5",
                  fontSize: 15, outline: "none", width: "100%", boxSizing: "border-box",
                }}
              />
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              <button
                onClick={() => setStep("review")}
                style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "#6b7a99", borderRadius: 10, padding: "14px 24px", fontSize: 15, cursor: "pointer" }}
              >
                ← Back
              </button>
              <button
                onClick={schedulePost}
                disabled={!scheduleTime || scheduling}
                style={{
                  background: !scheduleTime ? "rgba(249,115,22,0.3)" : "#f97316",
                  color: "#fff", border: "none", borderRadius: 10,
                  padding: "14px 32px", fontSize: 15, fontWeight: 600,
                  cursor: !scheduleTime ? "not-allowed" : "pointer", flex: 1,
                }}
              >
                {scheduling ? "Scheduling..." : `⚡ Schedule ${platforms.length} posts`}
              </button>
            </div>
          </div>
        )}

        {/* ── SUCCESS ── */}
        {scheduled && (
          <div style={{ textAlign: "center", padding: "80px 24px", animation: "fadeIn 0.5s ease" }}>
            <div style={{ fontSize: 56, marginBottom: 20 }}>🎉</div>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 32, fontWeight: 800, color: "#fff", marginBottom: 12 }}>
              Posts scheduled!
            </h2>
            <p style={{ color: "#6b7a99", fontSize: 16, marginBottom: 32 }}>
              Your content will publish to {platforms.length} platforms at the scheduled time.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button
                onClick={() => { setStep("compose"); setContent(""); setVariants({}); setScheduled(false); setScheduleTime("") }}
                style={{ background: "#f97316", color: "#fff", border: "none", borderRadius: 10, padding: "12px 28px", fontSize: 15, fontWeight: 600, cursor: "pointer" }}
              >
                ⚡ Create another post
              </button>
              <a href="/calendar" style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "#6b7a99", borderRadius: 10, padding: "12px 28px", fontSize: 15, textDecoration: "none", display: "flex", alignItems: "center" }}>
                View calendar →
              </a>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
        @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        textarea::placeholder { color: #3a4458; }
        input[type="datetime-local"]::-webkit-calendar-picker-indicator { filter: invert(0.5); }
      `}</style>
    </div>
  )
}