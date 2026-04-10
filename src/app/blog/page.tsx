"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { blogPosts, categories } from "../data/blog"

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("All")
  const [search, setSearch] = useState("")

  const featured = blogPosts.find((p) => p.featured)
  const rest = blogPosts.filter((p) => !p.featured)

  const filtered = useMemo(() => {
    return rest.filter((post) => {
      const matchCat = activeCategory === "All" || post.category === activeCategory
      const matchSearch =
        search === "" ||
        post.title.toLowerCase().includes(search.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(search.toLowerCase()) ||
        post.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
      return matchCat && matchSearch
    })
  }, [activeCategory, search, rest])

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)" }}>
      {/* Nav */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: "rgba(10,10,15,0.92)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid var(--border)",
          padding: "0 2rem",
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Link
            href="/"
            style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 800,
              fontSize: "1.2rem",
              background: "linear-gradient(135deg, var(--accent), var(--accent2))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textDecoration: "none",
            }}
          >
            MH.
          </Link>
          <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
            <Link href="/#projects" style={{ color: "var(--muted)", fontSize: "0.875rem", textDecoration: "none" }}>
              Projects
            </Link>
            <Link href="/blog" style={{ color: "var(--text)", fontSize: "0.875rem", fontWeight: 600, textDecoration: "none" }}>
              Blog
            </Link>
            <Link
              href="mailto:mithun_2k2@yahoo.co.uk"
              style={{
                background: "var(--accent)",
                color: "#fff",
                padding: "0.45rem 1.1rem",
                borderRadius: 8,
                fontSize: "0.82rem",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Hire Me
            </Link>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "4rem 2rem" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ marginBottom: "3rem" }}
        >
          <p
            style={{
              fontSize: "0.72rem",
              textTransform: "uppercase",
              letterSpacing: "0.18em",
              color: "var(--accent)",
              fontWeight: 600,
              marginBottom: "0.6rem",
            }}
          >
            Technical Writing
          </p>
          <h1
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 800,
              marginBottom: "0.5rem",
            }}
          >
            Blog
          </h1>
          <p style={{ color: "var(--muted)", fontSize: "1rem", maxWidth: 520 }}>
            Deep dives into AI engineering, SaaS architecture, and data science — from real production experience.
          </p>
        </motion.div>

        {/* Featured Post */}
        {featured && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{ marginBottom: "3rem" }}
          >
            <Link href={`/blog/${featured.slug}`} style={{ textDecoration: "none" }}>
              <motion.div
                whileHover={{ y: -4, borderColor: "var(--accent)" }}
                style={{
                  background: `linear-gradient(135deg, ${featured.coverGradient.replace("from-[", "").replace("] via-[", ", ").replace("] to-[", ", ").replace("]", "")})`,
                  border: "1px solid var(--border)",
                  borderRadius: 20,
                  padding: "2.5rem",
                  cursor: "pointer",
                  transition: "border-color 0.25s",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    background: "var(--accent)",
                    color: "#fff",
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    padding: "0.3rem 0.8rem",
                    borderBottomLeftRadius: 12,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  Featured
                </div>
                <img src={featured.icon} alt={featured.title} width={52} height={52} style={{ objectFit: "contain", marginBottom: "1rem", filter: featured.title.includes("Next") ? "invert(1)" : "none" }} />
                <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.75rem", flexWrap: "wrap" }}>
                  <span
                    style={{
                      background: "rgba(108,99,255,0.2)",
                      color: "var(--accent)",
                      fontSize: "0.7rem",
                      padding: "0.2rem 0.6rem",
                      borderRadius: 6,
                      fontWeight: 600,
                    }}
                  >
                    {featured.category}
                  </span>
                  <span style={{ color: "var(--muted)", fontSize: "0.75rem", alignSelf: "center" }}>
                    {featured.readTime} min read · {formatDate(featured.date)}
                  </span>
                </div>
                <h2
                  style={{
                    fontFamily: "'Syne', sans-serif",
                    fontSize: "clamp(1.3rem, 2.5vw, 1.8rem)",
                    fontWeight: 800,
                    marginBottom: "0.75rem",
                    lineHeight: 1.2,
                    color: "var(--text)",
                  }}
                >
                  {featured.title}
                </h2>
                <p style={{ color: "var(--muted)", fontSize: "0.95rem", lineHeight: 1.7, maxWidth: 680 }}>
                  {featured.excerpt}
                </p>
                <div style={{ display: "flex", gap: "0.4rem", marginTop: "1.25rem", flexWrap: "wrap" }}>
                  {featured.tags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        background: "rgba(255,255,255,0.06)",
                        border: "1px solid var(--border)",
                        color: "var(--muted)",
                        fontSize: "0.65rem",
                        padding: "0.2rem 0.55rem",
                        borderRadius: 6,
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            </Link>
          </motion.div>
        )}

        {/* Search + Filter */}
        <div
          style={{
            display: "flex",
            gap: "1rem",
            marginBottom: "2rem",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <input
            type="text"
            placeholder="Search posts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              padding: "0.55rem 1rem",
              color: "var(--text)",
              fontSize: "0.875rem",
              width: 240,
              outline: "none",
            }}
          />
          <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
            {categories.map((cat) => (
              <motion.button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  padding: "0.4rem 0.9rem",
                  borderRadius: 8,
                  border: "1px solid",
                  borderColor: activeCategory === cat ? "var(--accent)" : "var(--border)",
                  background: activeCategory === cat ? "rgba(108,99,255,0.15)" : "var(--surface)",
                  color: activeCategory === cat ? "var(--accent)" : "var(--muted)",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                {cat}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Posts Grid */}
        <motion.div
          layout
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "1.5rem",
          }}
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((post, i) => (
              <motion.div
                key={post.slug}
                layout
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <Link href={`/blog/${post.slug}`} style={{ textDecoration: "none" }}>
                  <motion.div
                    whileHover={{ y: -6, borderColor: "var(--accent)" }}
                    style={{
                      background: "var(--surface)",
                      border: "1px solid var(--border)",
                      borderRadius: 16,
                      overflow: "hidden",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      transition: "border-color 0.25s",
                      cursor: "pointer",
                    }}
                  >
                    {/* Card header */}
                    <div
                      style={{
                        height: 100,
                        background: `linear-gradient(135deg, ${post.coverGradient.replace("from-[", "").replace("] via-[", ", ").replace("] to-[", ", ").replace("]", "")})`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "2.5rem",
                      }}
                    >
                      {post.icon}
                    </div>

                    <div style={{ padding: "1.25rem", flex: 1, display: "flex", flexDirection: "column" }}>
                      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.6rem", alignItems: "center" }}>
                        <span
                          style={{
                            background: "rgba(108,99,255,0.15)",
                            color: "var(--accent)",
                            fontSize: "0.65rem",
                            padding: "0.2rem 0.5rem",
                            borderRadius: 6,
                            fontWeight: 700,
                          }}
                        >
                          {post.category}
                        </span>
                        <span style={{ color: "var(--muted)", fontSize: "0.7rem" }}>
                          {post.readTime} min read
                        </span>
                      </div>

                      <h3
                        style={{
                          fontFamily: "'Syne', sans-serif",
                          fontSize: "1rem",
                          fontWeight: 700,
                          marginBottom: "0.5rem",
                          lineHeight: 1.3,
                          color: "var(--text)",
                        }}
                      >
                        {post.title}
                      </h3>

                      <p
                        style={{
                          color: "var(--muted)",
                          fontSize: "0.82rem",
                          lineHeight: 1.65,
                          flex: 1,
                          marginBottom: "1rem",
                        }}
                      >
                        {post.excerpt.slice(0, 120)}...
                      </p>

                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: "0.7rem", color: "var(--muted)" }}>
                          {formatDate(post.date)}
                        </span>
                        <span style={{ fontSize: "0.78rem", color: "var(--accent)", fontWeight: 600 }}>
                          Read →
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "4rem 0", color: "var(--muted)" }}>
            No posts found for "{search}" in {activeCategory}
          </div>
        )}
      </div>
    </main>
  )
}
