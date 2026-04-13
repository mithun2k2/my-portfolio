"use client"

import { useState } from "react"
import { useAuth } from "@/context/AuthContext"
import Link from "next/link"

export default function SignupPage() {
  const { register, loginWithGoogle } = useAuth()
  const [name,     setName]     = useState("")
  const [email,    setEmail]    = useState("")
  const [password, setPassword] = useState("")
  const [error,    setError]    = useState("")
  const [loading,  setLoading]  = useState(false)

  const handleSignup = async () => {
    if (!name || !email || !password) return
    if (password.length < 8) { setError("Password must be at least 8 characters"); return }
    setLoading(true)
    setError("")
    try {
      await register(name, email, password)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#080c14", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 420 }}>

        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <a href="https://mhassanmithun.com" style={{ display: "inline-flex", alignItems: "center", gap: 10, textDecoration: "none", marginBottom: 8 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "#f97316", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>⚡</div>
            <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 20, color: "#fff" }}>ScheduleForge</span>
          </a>
          <p style={{ color: "#6b7a99", fontSize: 14, marginTop: 8 }}>Create your free account</p>
        </div>

        <div style={{ background: "#0e1520", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 32 }}>

          <button
            onClick={loginWithGoogle}
            style={{ width: "100%", background: "#fff", color: "#1a1a2e", border: "none", borderRadius: 10, padding: "12px 20px", fontSize: 14, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 24, transition: "opacity 0.2s" }}
            onMouseOver={e => (e.currentTarget.style.opacity = "0.9")}
            onMouseOut={e => (e.currentTarget.style.opacity = "1")}
          >
            <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
            Continue with Google
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
            <span style={{ fontSize: 12, color: "#6b7a99" }}>or</span>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              { label: "Full name", value: name, setter: setName, type: "text", placeholder: "Hassan Mithun" },
              { label: "Email", value: email, setter: setEmail, type: "email", placeholder: "you@example.com" },
              { label: "Password", value: password, setter: setPassword, type: "password", placeholder: "Min 8 characters" },
            ].map(({ label, value, setter, type, placeholder }) => (
              <div key={label}>
                <label style={{ fontSize: 12, color: "#6b7a99", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</label>
                <input
                  type={type}
                  value={value}
                  onChange={e => setter(e.target.value)}
                  placeholder={placeholder}
                  style={{ width: "100%", background: "#080c14", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "11px 14px", color: "#e8edf5", fontSize: 14, outline: "none", boxSizing: "border-box" }}
                  onFocus={e => e.target.style.borderColor = "rgba(249,115,22,0.4)"}
                  onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
                  onKeyDown={e => e.key === "Enter" && handleSignup()}
                />
              </div>
            ))}

            {error && <div style={{ fontSize: 13, color: "#f87171", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 8, padding: "10px 14px" }}>{error}</div>}

            <button
              onClick={handleSignup}
              disabled={loading}
              style={{ background: loading ? "rgba(249,115,22,0.5)" : "#f97316", color: "#fff", border: "none", borderRadius: 10, padding: "13px", fontSize: 15, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", marginTop: 4 }}
            >
              {loading ? "Creating account..." : "Create account →"}
            </button>

            <p style={{ fontSize: 12, color: "#6b7a99", textAlign: "center" }}>
              By signing up you agree to our terms. 3 free repurposes included.
            </p>
          </div>
        </div>

        <p style={{ textAlign: "center", fontSize: 14, color: "#6b7a99", marginTop: 20 }}>
          Already have an account?{" "}
          <Link href="/login" style={{ color: "#f97316", textDecoration: "none", fontWeight: 600 }}>Sign in</Link>
        </p>
      </div>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500&display=swap');`}</style>
    </div>
  )
}
