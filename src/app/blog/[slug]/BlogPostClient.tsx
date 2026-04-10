"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { blogPosts } from "../../../data/blog"

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
}

function formatInline(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong style="color:var(--text);font-weight:600">$1</strong>')
    .replace(/`(.*?)`/g, '<code style="background:#1a1a2e;color:#a78bfa;padding:0.1rem 0.35rem;border-radius:4px;font-size:0.85em;font-family:monospace">$1</code>')
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" style="color:var(--accent);text-decoration:underline" target="_blank">$1</a>')
}

function renderContent(content: string) {
  const lines = content.trim().split("\n")
  const elements: React.ReactNode[] = []
  let i = 0
  let keyCounter = 0

  while (i < lines.length) {
    const line = lines[i]
    const key = keyCounter++

    if (line.trim().startsWith("```")) {
      const lang = line.trim().slice(3)
      const codeLines: string[] = []
      i++
      while (i < lines.length && !lines[i].trim().startsWith("```")) { codeLines.push(lines[i]); i++ }
      elements.push(
        <div key={key} style={{ margin: "1.5rem 0", borderRadius: 12, overflow: "hidden", border: "1px solid var(--border)" }}>
          {lang && <div style={{ background: "var(--surface2)", padding: "0.4rem 1rem", fontSize: "0.72rem", color: "var(--accent)", fontWeight: 600, borderBottom: "1px solid var(--border)", fontFamily: "monospace" }}>{lang}</div>}
          <pre style={{ background: "#0d0d14", padding: "1.25rem", overflowX: "auto", margin: 0, fontSize: "0.82rem", lineHeight: 1.7, fontFamily: "monospace", color: "#e2e8f0" }}>
            <code>{codeLines.join("\n")}</code>
          </pre>
        </div>
      )
      i++; continue
    }

    if (line.includes("|") && line.trim().startsWith("|")) {
      const tableLines: string[] = [line]; i++
      while (i < lines.length && lines[i].includes("|")) { tableLines.push(lines[i]); i++ }
      const rows = tableLines.filter((l) => !l.match(/^\|[-| ]+\|$/))
      elements.push(
        <div key={key} style={{ overflowX: "auto", margin: "1.5rem 0" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem" }}>
            {rows.map((row, ri) => {
              const cells = row.split("|").filter((c) => c.trim())
              return <tr key={ri} style={{ borderBottom: "1px solid var(--border)" }}>
                {cells.map((cell, ci) => ri === 0
                  ? <th key={ci} style={{ padding: "0.6rem 1rem", textAlign: "left", color: "var(--text)", fontWeight: 700, background: "var(--surface2)" }}>{cell.trim()}</th>
                  : <td key={ci} style={{ padding: "0.6rem 1rem", color: "var(--muted)" }}>{cell.trim()}</td>
                )}
              </tr>
            })}
          </table>
        </div>
      ); continue
    }

    if (line.startsWith("## ")) { elements.push(<h2 key={key} style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", fontWeight: 800, margin: "2.5rem 0 0.75rem", color: "var(--text)" }}>{line.slice(3)}</h2>); i++; continue }
    if (line.startsWith("### ")) { elements.push(<h3 key={key} style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.15rem", fontWeight: 700, margin: "1.75rem 0 0.5rem", color: "var(--text)" }}>{line.slice(4)}</h3>); i++; continue }

    if (/^\d+\./.test(line.trim())) {
      const items: string[] = []
      while (i < lines.length && /^\d+\./.test(lines[i].trim())) { items.push(lines[i].trim().replace(/^\d+\.\s*/, "")); i++ }
      elements.push(<ol key={key} style={{ margin: "1rem 0", paddingLeft: "1.5rem" }}>{items.map((item, idx) => <li key={idx} style={{ color: "var(--muted)", fontSize: "0.95rem", lineHeight: 1.8, marginBottom: "0.25rem" }} dangerouslySetInnerHTML={{ __html: formatInline(item) }} />)}</ol>)
      continue
    }

    if (line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
      const items: string[] = []
      while (i < lines.length && (lines[i].trim().startsWith("- ") || lines[i].trim().startsWith("* "))) { items.push(lines[i].trim().slice(2)); i++ }
      elements.push(<ul key={key} style={{ margin: "1rem 0", paddingLeft: "1.5rem" }}>{items.map((item, idx) => <li key={idx} style={{ color: "var(--muted)", fontSize: "0.95rem", lineHeight: 1.8, marginBottom: "0.25rem" }} dangerouslySetInnerHTML={{ __html: formatInline(item) }} />)}</ul>)
      continue
    }

    if (line.trim() === "") { i++; continue }

    elements.push(<p key={key} style={{ color: "var(--muted)", fontSize: "0.98rem", lineHeight: 1.85, margin: "0.75rem 0" }} dangerouslySetInnerHTML={{ __html: formatInline(line) }} />)
    i++
  }
  return elements
}

export default function BlogPostClient({ slug }: { slug: string }) {
  const post = blogPosts.find((p) => p.slug === slug)
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement
      setScrollProgress(Math.min(1, el.scrollTop / (el.scrollHeight - el.clientHeight)))
    }
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  if (!post) return <div style={{ padding: "4rem", color: "var(--muted)", textAlign: "center" }}>Post not found</div>

  const related = blogPosts
    .filter((p) => p.slug !== post.slug && (p.category === post.category || p.tags.some((t) => post.tags.includes(t))))
    .slice(0, 2)

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <div style={{ position: "fixed", top: 0, left: 0, height: 3, width: `${scrollProgress * 100}%`, background: "linear-gradient(90deg, var(--accent), var(--accent2))", zIndex: 200 }} />

      <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(10,10,15,0.92)", backdropFilter: "blur(16px)", borderBottom: "1px solid var(--border)", padding: "0 2rem" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1.2rem", background: "linear-gradient(135deg, var(--accent), var(--accent2))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", textDecoration: "none" }}>MH.</Link>
          <Link href="/blog" style={{ color: "var(--muted)", fontSize: "0.875rem", textDecoration: "none" }}>← Back to Blog</Link>
        </div>
      </nav>

      <article style={{ maxWidth: 760, margin: "0 auto", padding: "3rem 2rem 5rem" }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div style={{ display: "flex", gap: "0.6rem", marginBottom: "1.5rem", flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ background: "rgba(108,99,255,0.15)", color: "var(--accent)", fontSize: "0.72rem", padding: "0.25rem 0.65rem", borderRadius: 6, fontWeight: 700 }}>{post.category}</span>
            <span style={{ color: "var(--muted)", fontSize: "0.78rem" }}>{post.readTime} min read · {formatDate(post.date)}</span>
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 3.5vw, 3rem)", fontWeight: 900, lineHeight: 1.15, marginBottom: "1.25rem" }}>{post.title}</h1>
          <p style={{ color: "var(--muted)", fontSize: "1.05rem", lineHeight: 1.75, marginBottom: "1.5rem", borderLeft: "3px solid var(--accent)", paddingLeft: "1rem" }}>{post.excerpt}</p>
          <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginBottom: "2.5rem" }}>
            {post.tags.map((tag) => <span key={tag} style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--muted)", fontSize: "0.68rem", padding: "0.2rem 0.6rem", borderRadius: 6 }}>{tag}</span>)}
          </div>
          <div style={{ height: 1, background: "var(--border)", marginBottom: "2.5rem" }} />
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.2 }}>
          {renderContent(post.content)}
        </motion.div>

        <div style={{ marginTop: "3rem", padding: "1.5rem", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, display: "flex", gap: "1rem", alignItems: "center" }}>
          <div style={{ width: 52, height: 52, borderRadius: "50%", background: "linear-gradient(135deg, var(--accent), var(--accent2))", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1.1rem", color: "#fff", flexShrink: 0 }}>MH</div>
          <div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1rem" }}>Mahmudul Hassan Mithun</div>
            <div style={{ color: "var(--muted)", fontSize: "0.8rem", marginTop: "0.2rem" }}>AI SaaS Builder · BSc Data Science & AI, UEL · Building ContentForge AI</div>
          </div>
        </div>

        {related.length > 0 && (
          <div style={{ marginTop: "3rem" }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.15rem", fontWeight: 700, marginBottom: "1rem" }}>Related Posts</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" }}>
              {related.map((rp) => (
                <Link key={rp.slug} href={`/blog/${rp.slug}`} style={{ textDecoration: "none" }}>
                  <motion.div whileHover={{ y: -3, borderColor: "var(--accent)" }} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "1.25rem", cursor: "pointer", transition: "border-color 0.2s" }}>
                    <img src={rp.icon} alt={rp.title} width={40} height={40} style={{ objectFit: "contain", marginBottom: "0.5rem", filter: rp.title.includes("Next") || rp.title.includes("Windows") ? "invert(1)" : "none" }} />
                    <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "0.9rem", marginBottom: "0.3rem", color: "var(--text)" }}>{rp.title}</div>
                    <div style={{ color: "var(--accent)", fontSize: "0.78rem", fontWeight: 600 }}>{rp.readTime} min read →</div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </main>
  )
}
