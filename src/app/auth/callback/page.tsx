"use client"

import { Suspense } from "react"
import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"

function CallbackHandler() {
  const router       = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const token = searchParams.get("token")
    if (token) {
      localStorage.setItem("sf_token", token)
      router.push("/compose")
    } else {
      router.push("/login")
    }
  }, [])

  return (
    <div style={{ minHeight: "100vh", background: "#080c14", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: "sans-serif" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 32, marginBottom: 16 }}>⚡</div>
        <p>Signing you in...</p>
      </div>
    </div>
  )
}

export default function AuthCallback() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: "100vh", background: "#080c14", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 32, marginBottom: 16 }}>⚡</div>
          <p>Loading...</p>
        </div>
      </div>
    }>
      <CallbackHandler />
    </Suspense>
  )
}