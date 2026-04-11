"use client"

import { useEffect, useState } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"

export default function CursorGlow() {
  const [visible, setVisible] = useState(false)
  const [clicking, setClicking] = useState(false)
  const [hovering, setHovering] = useState(false)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Smooth spring following
  const springX = useSpring(mouseX, { stiffness: 500, damping: 40 })
  const springY = useSpring(mouseY, { stiffness: 500, damping: 40 })

  // Slower glow blob
  const glowX = useSpring(mouseX, { stiffness: 80, damping: 20 })
  const glowY = useSpring(mouseY, { stiffness: 80, damping: 20 })

  useEffect(() => {
    // Only show on desktop
    if (window.matchMedia("(pointer: coarse)").matches) return

    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
      setVisible(true)
    }

    const onLeave = () => setVisible(false)
    const onDown = () => setClicking(true)
    const onUp = () => setClicking(false)

    const onHoverStart = () => {
      const targets = document.querySelectorAll("a, button, [role='button'], input, textarea, select")
      targets.forEach(el => {
        el.addEventListener("mouseenter", () => setHovering(true))
        el.addEventListener("mouseleave", () => setHovering(false))
      })
    }

    document.addEventListener("mousemove", onMove)
    document.addEventListener("mouseleave", onLeave)
    document.addEventListener("mousedown", onDown)
    document.addEventListener("mouseup", onUp)
    onHoverStart()

    return () => {
      document.removeEventListener("mousemove", onMove)
      document.removeEventListener("mouseleave", onLeave)
      document.removeEventListener("mousedown", onDown)
      document.removeEventListener("mouseup", onUp)
    }
  }, [mouseX, mouseY])

  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) return null

  return (
    <>
      <style>{`
        @media (pointer: fine) {
          * { cursor: none !important; }
        }
      `}</style>

      {/* Glow blob — slow, large */}
      <motion.div
        style={{
          position: "fixed",
          left: glowX,
          top: glowY,
          width: hovering ? 80 : 60,
          height: hovering ? 80 : 60,
          borderRadius: "50%",
          background: hovering
            ? "radial-gradient(circle, rgba(255,101,132,0.2), transparent 70%)"
            : "radial-gradient(circle, rgba(108,99,255,0.2), transparent 70%)",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
          zIndex: 9998,
          opacity: visible ? 1 : 0,
          transition: "width 0.3s, height 0.3s, background 0.3s, opacity 0.3s",
          filter: "blur(8px)",
        }}
      />

      {/* Outer ring — medium speed */}
      <motion.div
        style={{
          position: "fixed",
          left: springX,
          top: springY,
          width: clicking ? 28 : hovering ? 40 : 32,
          height: clicking ? 28 : hovering ? 40 : 32,
          borderRadius: "50%",
          border: `1.5px solid ${hovering ? "rgba(255,101,132,0.6)" : "rgba(108,99,255,0.5)"}`,
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
          zIndex: 9999,
          opacity: visible ? 1 : 0,
          transition: "width 0.2s, height 0.2s, border-color 0.3s, opacity 0.3s",
          boxShadow: hovering
            ? "0 0 12px rgba(255,101,132,0.3)"
            : "0 0 12px rgba(108,99,255,0.3)",
        }}
      />

      {/* Inner dot — fast */}
      <motion.div
        style={{
          position: "fixed",
          left: mouseX,
          top: mouseY,
          width: clicking ? 3 : 5,
          height: clicking ? 3 : 5,
          borderRadius: "50%",
          background: hovering ? "#ff6584" : "#6c63ff",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
          zIndex: 10000,
          opacity: visible ? 1 : 0,
          transition: "width 0.1s, height 0.1s, background 0.3s, opacity 0.3s",
          boxShadow: hovering
            ? "0 0 8px #ff6584"
            : "0 0 8px #6c63ff",
        }}
      />
    </>
  )
}
