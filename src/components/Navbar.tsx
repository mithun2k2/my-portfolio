"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import ThemeToggle from "./ThemeToggle"

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [dropOpen, setDropOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <>
      <style>{`
        .nav-link {
          position: relative;
          color: #8888aa;
          font-size: 0.875rem;
          font-weight: 500;
          text-decoration: none;
          padding: 0.3rem 0.6rem;
          border-radius: 6px;
          transition: all 0.25s;
          letter-spacing: 0.02em;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 2px;
          border-radius: 999px;
          transition: width 0.3s ease, box-shadow 0.3s ease;
        }
        .nav-link:hover::after { width: 80%; }

        .nl-skills:hover { color: #6c63ff; text-shadow: 0 0 10px rgba(108,99,255,0.9), 0 0 20px rgba(108,99,255,0.5); }
        .nl-skills::after { background: #6c63ff; }
        .nl-skills:hover::after { box-shadow: 0 0 8px #6c63ff, 0 0 20px rgba(108,99,255,0.6); }

        .nl-projects:hover { color: #ff6584; text-shadow: 0 0 10px rgba(255,101,132,0.9), 0 0 20px rgba(255,101,132,0.5); }
        .nl-projects::after { background: #ff6584; }
        .nl-projects:hover::after { box-shadow: 0 0 8px #ff6584, 0 0 20px rgba(255,101,132,0.6); }

        .nl-experience:hover { color: #43e97b; text-shadow: 0 0 10px rgba(67,233,123,0.9), 0 0 20px rgba(67,233,123,0.5); }
        .nl-experience::after { background: #43e97b; }
        .nl-experience:hover::after { box-shadow: 0 0 8px #43e97b, 0 0 20px rgba(67,233,123,0.6); }

        .nl-blog:hover { color: #f7971e; text-shadow: 0 0 10px rgba(247,151,30,0.9), 0 0 20px rgba(247,151,30,0.5); }
        .nl-blog::after { background: #f7971e; }
        .nl-blog:hover::after { box-shadow: 0 0 8px #f7971e, 0 0 20px rgba(247,151,30,0.6); }

        .nl-contact:hover { color: #00d2ff; text-shadow: 0 0 10px rgba(0,210,255,0.9), 0 0 20px rgba(0,210,255,0.5); }
        .nl-contact::after { background: #00d2ff; }
        .nl-contact:hover::after { box-shadow: 0 0 8px #00d2ff, 0 0 20px rgba(0,210,255,0.6); }

        .launch-btn {
          background: linear-gradient(135deg, #f97316, #f59e0b);
          color: #fff;
          padding: 0.45rem 1.1rem;
          border-radius: 8px;
          font-size: 0.82rem;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.25s;
          box-shadow: 0 0 12px rgba(249,115,22,0.3);
          font-family: 'Syne', sans-serif;
          display: flex;
          align-items: center;
          gap: 0.3rem;
          cursor: pointer;
          border: none;
          position: relative;
        }
        .launch-btn:hover {
          box-shadow: 0 0 20px rgba(249,115,22,0.7), 0 0 40px rgba(249,115,22,0.3);
          transform: translateY(-2px);
        }
        .launch-dropdown {
          position: absolute;
          top: calc(100% + 10px);
          right: 0;
          background: rgba(10,10,20,0.98);
          border: 1px solid rgba(249,115,22,0.25);
          border-radius: 12px;
          padding: 8px;
          min-width: 220px;
          display: none;
          flex-direction: column;
          gap: 2px;
          box-shadow: 0 16px 40px rgba(0,0,0,0.6);
          backdrop-filter: blur(20px);
          z-index: 200;
        }
        .launch-dropdown.open { display: flex; }
        .drop-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 12px;
          border-radius: 8px;
          text-decoration: none;
          color: #e8edf5;
          font-size: 0.82rem;
          font-weight: 500;
          transition: background 0.2s;
          gap: 8px;
        }
        .drop-item:hover { background: rgba(249,115,22,0.1); }
        .drop-badge {
          font-size: 0.65rem;
          font-weight: 600;
          padding: 2px 7px;
          border-radius: 100px;
          white-space: nowrap;
        }
        .badge-live { background: rgba(34,197,94,0.15); color: #22c55e; border: 1px solid rgba(34,197,94,0.3); }
        .badge-wait { background: rgba(249,115,22,0.15); color: #f97316; border: 1px solid rgba(249,115,22,0.3); }
        .badge-soon { background: rgba(99,179,237,0.15); color: #63b3ed; border: 1px solid rgba(99,179,237,0.3); }
        .hire-btn {
          background: linear-gradient(135deg, #6c63ff, #ff6584);
          color: #fff;
          padding: 0.45rem 1.2rem;
          border-radius: 8px;
          font-size: 0.82rem;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.25s;
          box-shadow: 0 0 12px rgba(108,99,255,0.3);
          font-family: 'Syne', sans-serif;
        }
        .hire-btn:hover {
          box-shadow: 0 0 20px rgba(108,99,255,0.7), 0 0 40px rgba(108,99,255,0.3);
          transform: translateY(-2px);
        }
      `}</style>

      <motion.nav
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: scrolled ? "rgba(10,10,15,0.95)" : "rgba(10,10,15,0.7)",
          backdropFilter: "blur(20px)",
          borderBottom: scrolled ? "1px solid rgba(108,99,255,0.25)" : "1px solid rgba(42,42,62,0.8)",
          transition: "all 0.3s",
          boxShadow: scrolled ? "0 4px 24px rgba(0,0,0,0.5)" : "none",
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 2rem", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <motion.a
            href="#top"
            whileHover={{ scale: 1.08 }}
            style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 800,
              fontSize: "1.25rem",
              background: "linear-gradient(135deg, #6c63ff, #ff6584)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textDecoration: "none",
              filter: "drop-shadow(0 0 10px rgba(108,99,255,0.5))",
            }}
          >
            MH.
          </motion.a>

          <div style={{ display: "flex", gap: "0.1rem", alignItems: "center" }}>
            <a href="#skills" className="nav-link nl-skills">Skills</a>
            <a href="#projects" className="nav-link nl-projects">Projects</a>
            <a href="#experience" className="nav-link nl-experience">Experience</a>
            <a href="/blog" className="nav-link nl-blog">Blog</a>
            <a href="/products" className="nav-link nl-contact">Products</a>
            <a href="/contact" className="nav-link nl-contact">Contact</a>
            <div style={{ width: "0.75rem" }} />
            <ThemeToggle />
            <div style={{ width: "0.75rem" }} />
            <div style={{ position: "relative" }}>
              <button className="launch-btn" onClick={() => setDropOpen(o => !o)}>
                ⚡ Launch App <span style={{ fontSize: "0.65rem", opacity: 0.8 }}>▾</span>
              </button>
              <div className={`launch-dropdown${dropOpen ? " open" : ""}`}>
                <a href="/compose" className="drop-item" onClick={() => setDropOpen(false)}>
                  <span>📅 ScheduleForge AI</span>
                  <span className="drop-badge badge-live">✅ Live</span>
                </a>
                <a href="/products" className="drop-item" onClick={() => setDropOpen(false)}>
                  <span>🛍️ ShopForge AI</span>
                  <span className="drop-badge badge-live">✅ Live</span>
                </a>
                <a href="/products" className="drop-item" onClick={() => setDropOpen(false)}>
                  <span>🔗 LinkedInForge AI</span>
                  <span className="drop-badge badge-wait">🔥 Waitlist</span>
                </a>
                <a href="/products" className="drop-item" onClick={() => setDropOpen(false)}>
                  <span>✉️ OutreachForge AI</span>
                  <span className="drop-badge badge-wait">🔥 Waitlist</span>
                </a>
                <a href="/products" className="drop-item" onClick={() => setDropOpen(false)}>
                  <span>💬 SupportForge AI</span>
                  <span className="drop-badge badge-soon">⚡ Soon</span>
                </a>
              </div>
            </div>
            <div style={{ width: "0.5rem" }} />
            <a href="mailto:contact@mhassanmithun.com" className="hire-btn">Hire Me</a>
          </div>
        </div>
      </motion.nav>
    </>
  )
}