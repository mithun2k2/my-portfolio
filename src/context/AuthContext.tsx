"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { useRouter } from "next/navigation"

const API = "https://scheduleforge-ai.onrender.com"

type User = {
  id:    number
  name:  string
  email: string
  plan:  string
}

type AuthContextType = {
  user:     User | null
  token:    string | null
  loading:  boolean
  login:    (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout:   () => void
  loginWithGoogle: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user,    setUser]    = useState<User | null>(null)
  const [token,   setToken]   = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const t = localStorage.getItem("sf_token")
    if (t) {
      setToken(t)
      fetchMe(t)
    } else {
      setLoading(false)
    }
  }, [])

  const fetchMe = async (t: string) => {
    try {
      const res  = await fetch(`${API}/auth/me?token=${t}`)
      if (res.ok) {
        const data = await res.json()
        setUser(data)
      } else {
        localStorage.removeItem("sf_token")
      }
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    const res = await fetch(`${API}/auth/login`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ email, password }),
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.detail || "Login failed")
    }
    const data = await res.json()
    localStorage.setItem("sf_token", data.token)
    setToken(data.token)
    setUser(data.user)
    router.push("/compose")
  }

  const register = async (name: string, email: string, password: string) => {
    const res = await fetch(`${API}/auth/register`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ name, email, password }),
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.detail || "Registration failed")
    }
    const data = await res.json()
    localStorage.setItem("sf_token", data.token)
    setToken(data.token)
    setUser(data.user)
    router.push("/compose")
  }

  const logout = () => {
    localStorage.removeItem("sf_token")
    setToken(null)
    setUser(null)
    router.push("/login")
  }

  const loginWithGoogle = () => {
    window.location.href = `${API}/auth/google`
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, loginWithGoogle }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
