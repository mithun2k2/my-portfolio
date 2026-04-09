"use client"

import { motion } from "framer-motion"

const contactLinks = [
  { label: "mithun_2k2@yahoo.co.uk", href: "mailto:mithun_2k2@yahoo.co.uk", icon: "✉️", primary: true },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/mahmudul-hassan-9725226a/", icon: "💼", primary: false },
  { label: "GitHub", href: "https://github.com/mithun2k2", icon: "⌥", primary: false },
  { label: "Portfolio", href: "https://mhassanmithun.com", icon: "🌐", primary: false },
  { label: "+44 7732 504855", href: "tel:+447732504855", icon: "📞", primary: false },
]

export default function Contact() {
  return (
    <>
      <section id="contact" className="section-wrapper">
        <p className="section-label">Let&apos;s Talk</p>
        <h2 className="section-title">Get in Touch</h2>
        <p className="section-sub">
          Open to internships, collaborations, and freelance SaaS work. Based in London (UEL).
        </p>

        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          {contactLinks.map((link, i) => (
            <motion.a
              key={i}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -3, opacity: 0.9 }}
              whileTap={{ scale: 0.97 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.75rem 1.6rem",
                borderRadius: 10,
                fontWeight: 600,
                fontSize: "0.9rem",
                background: link.primary ? "var(--accent)" : "var(--surface)",
                border: link.primary ? "none" : "1px solid var(--border)",
                color: link.primary ? "#fff" : "var(--text)",
                cursor: "pointer",
              }}
            >
              <span>{link.icon}</span>
              {link.label}
            </motion.a>
          ))}
        </div>

        {/* Availability badge */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          style={{
            marginTop: "2.5rem",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.75rem",
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 12,
            padding: "1rem 1.5rem",
          }}
        >
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: "var(--accent3)",
              display: "inline-block",
              animation: "pulse 2s infinite",
            }}
          />
          <span style={{ fontSize: "0.88rem", color: "var(--muted)" }}>
            Currently available for{" "}
            <strong style={{ color: "var(--text)" }}>summer 2026 internships</strong> &amp;{" "}
            <strong style={{ color: "var(--text)" }}>freelance SaaS projects</strong>
          </span>
        </motion.div>
      </section>

      <footer
        style={{
          borderTop: "1px solid var(--border)",
          padding: "2.5rem 2rem",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "2rem",
              marginBottom: "1rem",
              flexWrap: "wrap",
            }}
          >
            {[
              { label: "Email", href: "mailto:mithun_2k2@yahoo.co.uk" },
              { label: "LinkedIn", href: "https://www.linkedin.com/in/mahmudul-hassan-9725226a/" },
              { label: "GitHub", href: "https://github.com/mithun2k2" },
              { label: "ContentForge AI", href: "https://contentforge.net" },
              { label: "Portfolio", href: "https://mhassanmithun.com" },
            ].map((l) => (
              <motion.a
                key={l.label}
                href={l.href}
                target={l.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                whileHover={{ color: "var(--accent)" }}
                style={{ color: "var(--muted)", fontSize: "0.85rem", transition: "color 0.2s" }}
              >
                {l.label}
              </motion.a>
            ))}
          </div>
          <p style={{ fontSize: "0.75rem", color: "var(--muted)" }}>
            © 2026 Mahmudul Hassan Mithun · Built with Next.js 15 + Framer Motion
          </p>
        </div>
      </footer>
    </>
  )
}
