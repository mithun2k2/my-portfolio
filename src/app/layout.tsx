import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Mahmudul Hassan Mithun · AI & SaaS Developer",
  description:
    "Portfolio of Mahmudul Hassan Mithun — AI-powered SaaS builder, Data Science & AI student at University of East London. Building ContentForge AI, BookingForge AI, and enterprise SaaS platforms.",
  keywords: ["AI", "SaaS", "Next.js", "FastAPI", "LangGraph", "Data Science", "Machine Learning"],
  authors: [{ name: "Mahmudul Hassan Mithun", url: "https://mhassanmithun.com" }],
  openGraph: {
    title: "Mahmudul Hassan Mithun · AI & SaaS Developer",
    description: "AI-powered SaaS builder & Data Science student at University of East London.",
    url: "https://mhassanmithun.com",
    siteName: "Hassan Mithun Portfolio",
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mahmudul Hassan Mithun · AI & SaaS Developer",
    description: "AI-powered SaaS builder & Data Science student at UEL.",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
