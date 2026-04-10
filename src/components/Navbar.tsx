"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

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
            <a href="/contact" className="nav-link nl-contact">Contact</a>
            <div style={{ width: "1rem" }} />
            <a href="mailto:contact@mhassanmithun.com" className="hire-btn">Hire Me</a>
          </div>
        </div>
      </motion.nav>
    </>
  )
}
