"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"

type FormState = "idle" | "loading" | "success" | "error"

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" })
  const [state, setState] = useState<FormState>("idle")
  const [errorMsg, setErrorMsg] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.subject || !form.message) {
      setErrorMsg("Please fill in all fields.")
      return
    }
    setState("loading")
    setErrorMsg("")

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: "55b5229e-b19b-4dc2-a6f0-da181d2915d8",
          name: form.name,
          email: form.email,
          subject: `[Portfolio] ${form.subject} — from ${form.name}`,
          message: form.message,
        }),
      })

      if (res.ok) {
        setState("success")
        setForm({ name: "", email: "", subject: "", message: "" })
      } else {
        setState("error")
        setErrorMsg("Something went wrong. Please email me directly.")
      }
    } catch {
      setState("error")
      setErrorMsg("Network error. Please try again.")
    }
  }

  const subjects = [
    "Internship Opportunity",
    "Freelance Project",
    "SaaS Collaboration",
    "Technical Question",
    "Speaking / Interview",
    "Other",
  ]

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)" }}>
      {/* Nav */}
      <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(10,10,15,0.92)", backdropFilter: "blur(16px)", borderBottom: "1px solid var(--border)", padding: "0 2rem" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1.2rem", background: "linear-gradient(135deg, var(--accent), var(--accent2))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", textDecoration: "none" }}>MH.</Link>
          <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
            <Link href="/#projects" style={{ color: "var(--muted)", fontSize: "0.875rem", textDecoration: "none" }}>Projects</Link>
            <Link href="/blog" style={{ color: "var(--muted)", fontSize: "0.875rem", textDecoration: "none" }}>Blog</Link>
            <Link href="/contact" style={{ color: "var(--text)", fontSize: "0.875rem", fontWeight: 600, textDecoration: "none" }}>Contact</Link>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "4rem 2rem" }}>
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ marginBottom: "3rem", textAlign: "center" }}>
          <p style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.18em", color: "var(--accent)", fontWeight: 600, marginBottom: "0.6rem" }}>Get In Touch</p>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(2rem, 4vw, 2.8rem)", fontWeight: 800, marginBottom: "0.75rem" }}>Let's Work Together</h1>
          <p style={{ color: "var(--muted)", fontSize: "1rem", maxWidth: 520, margin: "0 auto" }}>
            Open to internships, freelance SaaS projects, and collaborations. I usually respond within 24 hours.
          </p>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: "2.5rem", alignItems: "start" }}>

          {/* Left: info cards */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {[
              { icon: "✉️", label: "Email", value: "hello@mhassanmithun.com", href: "mailto:hello@mhassanmithun.com" },
              { icon: "💼", label: "LinkedIn", value: "mahmudul-hassan", href: "https://linkedin.com/in/mahmudul-hassan-9725226a" },
              { icon: "⌥", label: "GitHub", value: "github.com/mithun2k2", href: "https://github.com/mithun2k2" },
              { icon: "🌐", label: "Portfolio", value: "mhassanmithun.com", href: "https://mhassanmithun.com" },
            ].map((item, i) => (
              <motion.a key={i} href={item.href} target={item.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" whileHover={{ y: -3, borderColor: "var(--accent)" }}
                style={{ display: "flex", alignItems: "center", gap: "0.75rem", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "1rem 1.25rem", textDecoration: "none", transition: "border-color 0.2s" }}>
                <span style={{ fontSize: "1.2rem" }}>{item.icon}</span>
                <div>
                  <div style={{ fontSize: "0.7rem", color: "var(--muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>{item.label}</div>
                  <div style={{ fontSize: "0.85rem", color: "var(--text)", fontWeight: 500 }}>{item.value}</div>
                </div>
              </motion.a>
            ))}

            {/* Availability badge */}
            <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "1rem 1.25rem", marginTop: "0.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.4rem" }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--accent3)", display: "inline-block", animation: "pulse 2s infinite" }} />
                <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--accent3)" }}>Available</span>
              </div>
              <p style={{ fontSize: "0.8rem", color: "var(--muted)", lineHeight: 1.6 }}>
                Actively seeking <strong style={{ color: "var(--text)" }}>summer 2026 internships</strong> and open to freelance SaaS work.
              </p>
            </div>
          </motion.div>

          {/* Right: contact form */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.15 }}
            style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: "2rem" }}>

            {state === "success" ? (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: "center", padding: "2rem 0" }}>
                <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>✅</div>
                <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.3rem", fontWeight: 700, marginBottom: "0.5rem" }}>Message Sent!</h3>
                <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>Thanks for reaching out. I'll get back to you within 24 hours.</p>
                <motion.button onClick={() => setState("idle")} whileHover={{ opacity: 0.85 }} style={{ marginTop: "1.5rem", background: "var(--accent)", color: "#fff", border: "none", padding: "0.6rem 1.4rem", borderRadius: 8, fontWeight: 600, cursor: "pointer", fontSize: "0.875rem" }}>
                  Send Another
                </motion.button>
              </motion.div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.2rem", fontWeight: 700, marginBottom: "0.25rem" }}>Send a Message</h2>

                {/* Name + Email row */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div>
                    <label style={{ fontSize: "0.75rem", color: "var(--muted)", fontWeight: 600, display: "block", marginBottom: "0.4rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>Your Name</label>
                    <input name="name" value={form.name} onChange={handleChange} placeholder="Hassan Mithun"
                      style={{ width: "100%", background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 8, padding: "0.65rem 0.9rem", color: "var(--text)", fontSize: "0.875rem", outline: "none", boxSizing: "border-box" }} />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.75rem", color: "var(--muted)", fontWeight: 600, display: "block", marginBottom: "0.4rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>Your Email</label>
                    <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@company.com"
                      style={{ width: "100%", background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 8, padding: "0.65rem 0.9rem", color: "var(--text)", fontSize: "0.875rem", outline: "none", boxSizing: "border-box" }} />
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label style={{ fontSize: "0.75rem", color: "var(--muted)", fontWeight: 600, display: "block", marginBottom: "0.4rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>Subject</label>
                  <select name="subject" value={form.subject} onChange={handleChange}
                    style={{ width: "100%", background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 8, padding: "0.65rem 0.9rem", color: form.subject ? "var(--text)" : "var(--muted)", fontSize: "0.875rem", outline: "none", cursor: "pointer" }}>
                    <option value="">Select a subject...</option>
                    {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label style={{ fontSize: "0.75rem", color: "var(--muted)", fontWeight: 600, display: "block", marginBottom: "0.4rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>Message</label>
                  <textarea name="message" value={form.message} onChange={handleChange} placeholder="Tell me about your project, opportunity, or question..." rows={6}
                    style={{ width: "100%", background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 8, padding: "0.65rem 0.9rem", color: "var(--text)", fontSize: "0.875rem", outline: "none", resize: "vertical", fontFamily: "inherit", boxSizing: "border-box" }} />
                </div>

                {errorMsg && (
                  <p style={{ color: "var(--accent2)", fontSize: "0.82rem" }}>{errorMsg}</p>
                )}

                <motion.button onClick={handleSubmit} disabled={state === "loading"}
                  whileHover={{ opacity: state === "loading" ? 1 : 0.9 }}
                  whileTap={{ scale: state === "loading" ? 1 : 0.97 }}
                  style={{ background: "var(--accent)", color: "#fff", border: "none", padding: "0.8rem", borderRadius: 10, fontWeight: 700, fontSize: "0.95rem", cursor: state === "loading" ? "not-allowed" : "pointer", opacity: state === "loading" ? 0.7 : 1, fontFamily: "'Syne', sans-serif" }}>
                  {state === "loading" ? "Sending..." : "Send Message →"}
                </motion.button>

                <p style={{ fontSize: "0.72rem", color: "var(--muted)", textAlign: "center" }}>
                  Or email directly: <a href="mailto:hello@mhassanmithun.com" style={{ color: "var(--accent)" }}>hello@mhassanmithun.com</a>
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </main>
  )
}
