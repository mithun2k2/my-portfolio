import Navbar from "@/components/Navbar"
import Hero from "@/components/Hero"
import Skills from "@/components/Skills"
import Projects from "@/components/Projects"
import Experience from "@/components/Experience"
import Contact from "@/components/Contact"
import AIChatWidget from "@/components/AIChatWidget"

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <div className="divider" />
      <Skills />
      <div className="divider" />
      <Projects />
      <div className="divider" />
      <Experience />
      <div className="divider" />
      <Contact />
      <AIChatWidget />
    </main>
  )
}
