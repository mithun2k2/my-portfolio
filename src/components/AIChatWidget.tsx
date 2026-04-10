"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

type Message = { role: "user" | "assistant"; content: string }

const SYSTEM_PROMPT = `You are Hassan's AI assistant on his portfolio website (mhassanmithun.com). You answer questions about Hassan Mithun — an AI & SaaS developer and BSc Data Science & AI student at University of East London.

Key facts about Hassan:
- Builds production AI SaaS products: ContentForge AI (contentforge.net), CanopyCare (canopycare.contentforge.net), Enterprise Headless SaaS (platform.contentforge.net)
- Stack: Python, FastAPI, LangGraph, LangChain, Next.js 15, React, PostgreSQL, Prisma, Supabase, Railway, Vercel
- Academic: BSc Data Science & AI at UEL, BEng Electrical & Electronic Engineering from KUET Bangladesh
- Built YOLOv8 traffic management system at 94% accuracy
- WBL placement as Computer Lab Technician at UEL
- Open to summer 2026 internships and freelance SaaS work
- Email: contact@mhassanmithun.com | LinkedIn: linkedin.com/in/mahmudul-hassan-9725226a
- Location: London, UK

Be concise, friendly and professional. If asked about hiring or collaboration, encourage them to use the contact page or email directly. Keep responses under 150 words unless the question needs more detail.`

export default function AIChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hi! I'm Mithun AI — Hassan's personal assistant. Ask me anything about his skills, projects, or how to work with him! 👋" }
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [dots, setDots] = useState(1)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => setDots(d => d === 3 ? 1 : d + 1), 400)
      return () => clearInterval(interval)
    }
  }, [loading])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, loading])

  const sendMessage = async () => {
    if (!input.trim() || loading) return
    const userMsg = input.trim()
    setInput("")
    setMessages(prev => [...prev, { role: "user", content: userMsg }])
    setLoading(true)

    try {
      const res = await fetch("/.netlify/functions/claude-proxy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system: SYSTEM_PROMPT,
          messages: [
            ...messages.filter((m, i) => !(m.role === "assistant" && i === 0)).map(m => ({
              role: m.role,
              content: m.content
            })),
            { role: "user", content: userMsg }
          ]
        })
      })
      const data = await res.json()
      const reply = data.content?.[0]?.text || "Sorry, I couldn't process that. Please try again!"
      setMessages(prev => [...prev, { role: "assistant", content: reply }])
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Sorry, something went wrong. Please email contact@mhassanmithun.com directly!" }])
    } finally {
      setLoading(false)
    }
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const suggestions = ["What projects has Hassan built?", "Is Hassan available for internships?", "What's his tech stack?", "How can I hire Hassan?"]

  return (
    <>
      <style>{`
        .chat-widget-msg-user {
          background: linear-gradient(135deg, #6c63ff, #ff6584);
          color: white;
          border-radius: 18px 18px 4px 18px;
          padding: 0.65rem 1rem;
          font-size: 0.875rem;
          line-height: 1.5;
          max-width: 80%;
          align-self: flex-end;
          word-wrap: break-word;
        }
        .chat-widget-msg-ai {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.9);
          border-radius: 18px 18px 18px 4px;
          padding: 0.65rem 1rem;
          font-size: 0.875rem;
          line-height: 1.5;
          max-width: 85%;
          align-self: flex-start;
          word-wrap: break-word;
        }
        .chat-pulse {
          animation: chatPulse 2s ease-in-out infinite;
        }
        @keyframes chatPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(108,99,255,0.4), 0 4px 24px rgba(0,0,0,0.4); }
          50% { box-shadow: 0 0 0 8px rgba(108,99,255,0), 0 4px 24px rgba(108,99,255,0.3); }
        }
        .chat-input:focus { outline: none; border-color: rgba(108,99,255,0.6) !important; }
        .chat-send:hover { background: linear-gradient(135deg, #5a52e0, #e0506e) !important; }
      `}</style>

      {/* Floating button */}
      <motion.button
        onClick={() => setOpen(o => !o)}
        className="chat-pulse"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        style={{
          position: "fixed",
          bottom: "2rem",
          right: "2rem",
          width: 58,
          height: 58,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #6c63ff, #ff6584)",
          border: "none",
          cursor: "pointer",
          zIndex: 999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.4rem",
        }}
      >
        {open ? "✕" : "✦"}
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            style={{
              position: "fixed",
              bottom: "5.5rem",
              right: "2rem",
              width: 360,
              maxHeight: 520,
              background: "rgba(12,12,20,0.97)",
              border: "1px solid rgba(108,99,255,0.3)",
              borderRadius: 20,
              boxShadow: "0 20px 60px rgba(0,0,0,0.6), 0 0 40px rgba(108,99,255,0.1)",
              backdropFilter: "blur(20px)",
              zIndex: 998,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <div style={{
              padding: "1rem 1.25rem",
              borderBottom: "1px solid rgba(255,255,255,0.08)",
              background: "linear-gradient(135deg, rgba(108,99,255,0.15), rgba(255,101,132,0.08))",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: "50%",
                background: "linear-gradient(135deg, #6c63ff, #ff6584)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "1rem", flexShrink: 0,
              }}>✦</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "white", fontFamily: "'Syne', sans-serif" }}>Mithun AI</div>
                <div style={{ fontSize: "0.7rem", color: "#43e97b", display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#43e97b", display: "inline-block" }} />
                  Online
                </div>
              </div>
              <div style={{ marginLeft: "auto", fontSize: "0.7rem", color: "rgba(255,255,255,0.35)" }}>Powered by Claude</div>
            </div>

            {/* Messages */}
            <div style={{
              flex: 1,
              overflowY: "auto",
              padding: "1rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
              minHeight: 0,
            }}>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={msg.role === "user" ? "chat-widget-msg-user" : "chat-widget-msg-ai"}
                >
                  {msg.content}
                </motion.div>
              ))}
              {loading && (
                <div className="chat-widget-msg-ai" style={{ color: "rgba(255,255,255,0.5)" }}>
                  {"Thinking" + ".".repeat(dots)}
                </div>
              )}

              {/* Suggestions — only show at start */}
              {messages.length === 1 && !loading && (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", marginTop: "0.25rem" }}>
                  {suggestions.map((s, i) => (
                    <button key={i} onClick={() => { setInput(s); }} style={{
                      background: "rgba(108,99,255,0.1)",
                      border: "1px solid rgba(108,99,255,0.25)",
                      borderRadius: 10,
                      padding: "0.4rem 0.75rem",
                      color: "rgba(255,255,255,0.7)",
                      fontSize: "0.75rem",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "all 0.15s",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(108,99,255,0.5)")}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(108,99,255,0.25)")}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div style={{
              padding: "0.75rem 1rem",
              borderTop: "1px solid rgba(255,255,255,0.08)",
              display: "flex",
              gap: "0.5rem",
              alignItems: "flex-end",
            }}>
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Ask me anything..."
                rows={1}
                className="chat-input"
                style={{
                  flex: 1,
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 12,
                  padding: "0.6rem 0.85rem",
                  color: "white",
                  fontSize: "0.875rem",
                  resize: "none",
                  fontFamily: "inherit",
                  lineHeight: 1.5,
                  maxHeight: 80,
                  overflowY: "auto",
                  transition: "border-color 0.2s",
                }}
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || loading}
                className="chat-send"
                style={{
                  width: 38, height: 38,
                  borderRadius: 10,
                  background: "linear-gradient(135deg, #6c63ff, #ff6584)",
                  border: "none",
                  cursor: input.trim() && !loading ? "pointer" : "not-allowed",
                  opacity: input.trim() && !loading ? 1 : 0.4,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "1rem",
                  flexShrink: 0,
                  transition: "all 0.2s",
                }}
              >
                →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
