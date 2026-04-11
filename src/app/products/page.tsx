"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"

const products = [
  {
    id: "linkedin-bot",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linkedin/linkedin-original.svg",
    name: "LinkedInForge AI",
    tagline: "Automate B2B outreach at scale",
    description: "AI-powered LinkedIn automation that sends personalized connection requests, follow-ups, and DMs. Built for agencies and B2B sales teams who want to 10x their pipeline without the manual grind.",
    features: [
      "Automated connection requests with AI personalization",
      "Smart follow-up sequences (3-touch cadence)",
      "Personalized DM templates using prospect data",
      "Campaign analytics & reply tracking",
      "Safe sending limits to avoid LinkedIn bans",
      "CRM export (CSV / HubSpot)",
    ],
    plans: [
      { name: "Starter", price: 49, period: "mo", requests: "100 connections/mo", highlight: false },
      { name: "Pro", price: 99, period: "mo", requests: "500 connections/mo", highlight: true },
      { name: "Agency", price: 199, period: "mo", requests: "Unlimited", highlight: false },
    ],
    status: "waitlist",
    color: "#0077b5",
    gradient: "from-[#003d5c] to-[#0077b5]",
    badge: "🔥 High Demand",
  },
  {
    id: "support-bot",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
    name: "SupportForge AI",
    tagline: "White-label AI support for any business",
    description: "Deploy a fully trained AI customer support chatbot on any website in minutes. Handles FAQs, ticket routing, and order queries. White-label it and resell to your clients.",
    features: [
      "Train on your own docs, FAQs, and knowledge base",
      "Embeddable widget (1 line of code)",
      "Ticket escalation to human agents",
      "Multi-language support",
      "Analytics dashboard",
      "White-label reseller programme",
    ],
    plans: [
      { name: "Startup", price: 29, period: "mo", requests: "1,000 conversations/mo", highlight: false },
      { name: "Business", price: 79, period: "mo", requests: "10,000 conversations/mo", highlight: true },
      { name: "Enterprise", price: 199, period: "mo", requests: "Unlimited + white-label", highlight: false },
    ],
    status: "waitlist",
    color: "#6c63ff",
    gradient: "from-[#1a1035] to-[#2d1b69]",
    badge: "⚡ Coming Soon",
  },
  {
    id: "scheduler-bot",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
    name: "ScheduleForge AI",
    tagline: "Post once. Publish everywhere.",
    description: "The lightweight content scheduler for solo creators and small businesses. Write one post, auto-repurpose it into LinkedIn, Twitter, Instagram, and Facebook formats, then schedule across all platforms.",
    features: [
      "Auto-repurpose one post into 6 platform formats",
      "Schedule across LinkedIn, Twitter, Instagram, Facebook",
      "AI caption + hashtag generator",
      "Optimal posting time suggestions",
      "Content calendar view",
      "Analytics per platform",
    ],
    plans: [
      { name: "Creator", price: 19, period: "mo", requests: "30 posts/mo", highlight: false },
      { name: "Growth", price: 39, period: "mo", requests: "100 posts/mo", highlight: true },
      { name: "Agency", price: 79, period: "mo", requests: "Unlimited posts", highlight: false },
    ],
    status: "buy",
    color: "#f7971e",
    gradient: "from-[#2d1f05] to-[#4a3010]",
    badge: "✅ Available Now",
    stripeLinks: {
      Creator: "https://buy.stripe.com/placeholder-creator",
      Growth: "https://buy.stripe.com/placeholder-growth",
      Agency: "https://buy.stripe.com/placeholder-agency",
    },
  },
  {
    id: "email-bot",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg",
    name: "OutreachForge AI",
    tagline: "Hyper-personalized cold emails at scale",
    description: "AI cold email automation that scrapes lead data, drafts personalized emails using LLM, sends via your SMTP/SendGrid, and tracks opens, clicks, and replies in real time.",
    features: [
      "Lead scraping from LinkedIn, Apollo, and CSV",
      "AI-generated hyper-personalized emails",
      "SMTP + SendGrid integration",
      "Open, click, and reply tracking",
      "A/B test subject lines",
      "Follow-up sequences (7-touch)",
    ],
    plans: [
      { name: "Founder", price: 49, period: "mo", requests: "500 emails/mo", highlight: false },
      { name: "Scale", price: 99, period: "mo", requests: "5,000 emails/mo", highlight: true },
      { name: "Agency", price: 249, period: "mo", requests: "50,000 emails/mo", highlight: false },
    ],
    status: "waitlist",
    color: "#ff6584",
    gradient: "from-[#2d0a14] to-[#4a1020]",
    badge: "🔥 High Demand",
  },
  {
    id: "ecom-bot",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/shopify/shopify-original.svg",
    name: "ShopForge AI",
    tagline: "Bulk AI product descriptions for Shopify & WooCommerce",
    description: "Upload your product CSV and get SEO-optimized product descriptions, meta titles, meta descriptions, and alt text generated in bulk. Works with Shopify, WooCommerce, and any e-commerce platform.",
    features: [
      "Bulk CSV upload (1,000+ products at once)",
      "SEO-optimized descriptions + meta tags",
      "Alt text generation for all images",
      "Brand tone customization",
      "Shopify & WooCommerce direct export",
      "Multi-language support",
    ],
    plans: [
      { name: "Store", price: 29, period: "mo", requests: "500 products/mo", highlight: false },
      { name: "Growth", price: 59, period: "mo", requests: "2,000 products/mo", highlight: true },
      { name: "Agency", price: 129, period: "mo", requests: "Unlimited products", highlight: false },
    ],
    status: "buy",
    color: "#43e97b",
    gradient: "from-[#0a2010] to-[#0f3520]",
    badge: "✅ Available Now",
    stripeLinks: {
      Store: "https://buy.stripe.com/placeholder-store",
      Growth: "https://buy.stripe.com/placeholder-growth2",
      Agency: "https://buy.stripe.com/placeholder-agency2",
    },
  },
]

type Product = typeof products[0]

function WaitlistForm({ product, onClose }: { product: Product; onClose: () => void }) {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!email.includes("@")) return
    setLoading(true)
    try {
      await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: "55b5229e-b19b-4dc2-a6f0-da181d2915d8",
          subject: `Waitlist: ${product.name}`,
          email,
          message: `New waitlist signup for ${product.name}`,
        }),
      })
      setSubmitted(true)
    } catch {
      setSubmitted(true)
    }
    setLoading(false)
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)", zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          onClick={e => e.stopPropagation()}
          style={{ background: "var(--bg)", border: "1px solid rgba(108,99,255,0.3)", borderRadius: 20, padding: "2.5rem", width: "min(480px, 92vw)", boxShadow: "0 24px 80px rgba(0,0,0,0.6)" }}
        >
          <img src={product.icon} alt={product.name} width={52} height={52} style={{ objectFit: "contain", marginBottom: "0.75rem" }} />
          <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.4rem", fontWeight: 800, marginBottom: "0.5rem" }}>
            Join the {product.name} Waitlist
          </h3>
          <p style={{ color: "var(--muted)", fontSize: "0.875rem", lineHeight: 1.6, marginBottom: "1.5rem" }}>
            Be first to access {product.name} when it launches. Early adopters get 40% off for life.
          </p>

          {submitted ? (
            <div style={{ textAlign: "center", padding: "1.5rem 0" }}>
              <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>🎉</div>
              <p style={{ fontWeight: 700, marginBottom: "0.5rem" }}>You're on the list!</p>
              <p style={{ color: "var(--muted)", fontSize: "0.875rem" }}>We'll email you the moment {product.name} launches.</p>
              <button onClick={onClose} style={{ marginTop: "1.25rem", background: "var(--accent)", color: "#fff", border: "none", padding: "0.6rem 1.4rem", borderRadius: 10, fontWeight: 600, cursor: "pointer" }}>
                Close
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                onKeyDown={e => e.key === "Enter" && handleSubmit()}
                style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: "0.75rem 1rem", color: "var(--text)", fontSize: "0.9rem", outline: "none" }}
              />
              <button onClick={handleSubmit} disabled={loading}
                style={{ background: "linear-gradient(135deg, var(--accent), var(--accent2))", color: "#fff", border: "none", padding: "0.75rem", borderRadius: 10, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", fontSize: "0.9rem", opacity: loading ? 0.7 : 1 }}>
                {loading ? "Joining..." : "Join Waitlist — Get 40% Off 🚀"}
              </button>
              <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: "0.8rem" }}>
                Maybe later
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default function ProductsPage() {
  const [waitlistProduct, setWaitlistProduct] = useState<Product | null>(null)
  const [expandedPlan, setExpandedPlan] = useState<string | null>(null)

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)" }}>
      {waitlistProduct && <WaitlistForm product={waitlistProduct} onClose={() => setWaitlistProduct(null)} />}

      {/* Nav */}
      <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(10,10,15,0.95)", backdropFilter: "blur(20px)", borderBottom: "1px solid var(--border)", padding: "0 2rem" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1.2rem", background: "linear-gradient(135deg, var(--accent), var(--accent2))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", textDecoration: "none" }}>MH.</Link>
          <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
            <Link href="/" style={{ color: "var(--muted)", fontSize: "0.875rem", textDecoration: "none" }}>Portfolio</Link>
            <Link href="/blog" style={{ color: "var(--muted)", fontSize: "0.875rem", textDecoration: "none" }}>Blog</Link>
            <Link href="/contact" style={{ color: "var(--text)", fontSize: "0.875rem", fontWeight: 600, textDecoration: "none" }}>Contact</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "4rem 2rem 2rem", textAlign: "center" }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <p style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.18em", color: "var(--accent)", fontWeight: 600, marginBottom: "0.75rem" }}>AI SaaS Products</p>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 900, marginBottom: "1rem", lineHeight: 1.1 }}>
            Production-Grade AI Tools<br />
            <span style={{ background: "linear-gradient(135deg, var(--accent), var(--accent2))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Built for Real Businesses
            </span>
          </h1>
          <p style={{ color: "var(--muted)", fontSize: "1rem", maxWidth: 560, margin: "0 auto 2rem", lineHeight: 1.7 }}>
            5 AI-powered SaaS products for lead generation, content, customer support, and e-commerce. Join the waitlist or buy directly.
          </p>

          {/* Stats */}
          <div style={{ display: "flex", gap: "2rem", justifyContent: "center", flexWrap: "wrap", marginBottom: "3rem" }}>
            {[
              { value: "5", label: "AI Products" },
              { value: "2", label: "Available Now" },
              { value: "3", label: "Launching Soon" },
              { value: "£0", label: "Setup Fee" },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.8rem", fontWeight: 800, color: "var(--accent)" }}>{s.value}</div>
                <div style={{ fontSize: "0.75rem", color: "var(--muted)" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Products grid */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 2rem 5rem" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>
          {products.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 20,
                overflow: "hidden",
              }}
            >
              {/* Product header */}
              <div style={{
                padding: "2rem",
                background: `linear-gradient(135deg, ${product.gradient.replace("from-[", "").replace("] to-[", ", ").replace("]", "")})`,
                display: "flex",
                gap: "1.5rem",
                alignItems: "flex-start",
                flexWrap: "wrap",
              }}>
                <img src={product.icon} alt={product.name} width={56} height={56} style={{ objectFit: "contain", filter: product.id === "linkedin-bot" ? "none" : "none" }} />
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.4rem", flexWrap: "wrap" }}>
                    <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.5rem", fontWeight: 800, color: "#fff" }}>{product.name}</h2>
                    <span style={{ fontSize: "0.7rem", background: "rgba(255,255,255,0.15)", color: "#fff", padding: "0.2rem 0.65rem", borderRadius: 999, fontWeight: 600 }}>{product.badge}</span>
                  </div>
                  <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.95rem", marginBottom: "0.5rem" }}>{product.tagline}</p>
                  <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.85rem", lineHeight: 1.6 }}>{product.description}</p>
                </div>
              </div>

              {/* Features + Plans */}
              <div style={{ padding: "2rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }} className="product-grid">
                {/* Features */}
                <div>
                  <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: "0.75rem", fontWeight: 700, color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1rem" }}>
                    What's included
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                    {product.features.map((f, fi) => (
                      <div key={fi} style={{ display: "flex", alignItems: "flex-start", gap: "0.6rem", fontSize: "0.875rem", color: "var(--muted)", lineHeight: 1.5 }}>
                        <span style={{ color: "var(--accent3)", flexShrink: 0, marginTop: "0.1rem" }}>✓</span>
                        {f}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Plans */}
                <div>
                  <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: "0.75rem", fontWeight: 700, color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1rem" }}>
                    Pricing
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    {product.plans.map((plan) => (
                      <div key={plan.name} style={{
                        background: plan.highlight ? "rgba(108,99,255,0.1)" : "var(--surface2)",
                        border: `1px solid ${plan.highlight ? "rgba(108,99,255,0.4)" : "var(--border)"}`,
                        borderRadius: 12,
                        padding: "1rem 1.25rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "1rem",
                        flexWrap: "wrap",
                      }}>
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <span style={{ fontWeight: 700, fontSize: "0.9rem" }}>{plan.name}</span>
                            {plan.highlight && <span style={{ fontSize: "0.6rem", background: "var(--accent)", color: "#fff", padding: "0.1rem 0.4rem", borderRadius: 4, fontWeight: 700 }}>POPULAR</span>}
                          </div>
                          <div style={{ fontSize: "0.75rem", color: "var(--muted)", marginTop: "0.15rem" }}>{plan.requests}</div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                          <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1.1rem", color: plan.highlight ? "var(--accent)" : "var(--text)" }}>
                            ${plan.price}<span style={{ fontSize: "0.7rem", fontWeight: 400, color: "var(--muted)" }}>/{plan.period}</span>
                          </span>
                          {product.status === "buy" ? (
                            <a
                              href={(product as any).stripeLinks?.[plan.name] || "#"}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                background: plan.highlight ? "var(--accent)" : "var(--surface)",
                                color: plan.highlight ? "#fff" : "var(--text)",
                                border: plan.highlight ? "none" : "1px solid var(--border)",
                                padding: "0.4rem 0.9rem",
                                borderRadius: 8,
                                fontSize: "0.78rem",
                                fontWeight: 600,
                                textDecoration: "none",
                                whiteSpace: "nowrap",
                              }}
                            >
                              Buy Now
                            </a>
                          ) : (
                            <button
                              onClick={() => setWaitlistProduct(product)}
                              style={{
                                background: plan.highlight ? "var(--accent)" : "var(--surface)",
                                color: plan.highlight ? "#fff" : "var(--text)",
                                border: plan.highlight ? "none" : "1px solid var(--border)",
                                padding: "0.4rem 0.9rem",
                                borderRadius: 8,
                                fontSize: "0.78rem",
                                fontWeight: 600,
                                cursor: "pointer",
                                whiteSpace: "nowrap",
                              }}
                            >
                              Join Waitlist
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .product-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  )
}