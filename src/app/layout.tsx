import type { Metadata } from "next"
import "./globals.css"
import PageTransition from "@/components/PageTransition"

export const metadata: Metadata = {
  metadataBase: new URL("https://mhassanmithun.com"),
  title: {
    default: "Mahmudul Hassan Mithun · AI & SaaS Developer",
    template: "%s · Hassan Mithun",
  },
  description:
    "Portfolio of Mahmudul Hassan Mithun — AI-powered SaaS builder and Data Science & AI student at University of East London. Building ContentForge AI, BookingForge AI, and enterprise SaaS platforms with FastAPI, Next.js, LangGraph and more.",
  keywords: [
    "AI developer", "SaaS developer", "LangGraph", "FastAPI", "Next.js",
    "Data Science", "Machine Learning", "Python", "React", "University of East London",
    "ContentForge AI", "CanopyCare", "BookingForge AI", "internship 2026",
    "AI engineer London", "full stack developer London",
  ],
  authors: [{ name: "Mahmudul Hassan Mithun", url: "https://mhassanmithun.com" }],
  creator: "Mahmudul Hassan Mithun",
  publisher: "Mahmudul Hassan Mithun",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    title: "Mahmudul Hassan Mithun · AI & SaaS Developer",
    description:
      "AI-powered SaaS builder & Data Science student at University of East London. 5 live products including ContentForge AI and CanopyCare.",
    url: "https://mhassanmithun.com",
    siteName: "Hassan Mithun Portfolio",
    locale: "en_GB",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Mahmudul Hassan Mithun — AI & SaaS Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mahmudul Hassan Mithun · AI & SaaS Developer",
    description: "AI-powered SaaS builder & Data Science student at UEL.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://mhassanmithun.com",
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Mahmudul Hassan Mithun",
  url: "https://mhassanmithun.com",
  email: "contact@mhassanmithun.com",
  telephone: "+447732504855",
  jobTitle: "AI & SaaS Developer",
  description: "AI-powered SaaS builder and Data Science & AI student at University of East London.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "London",
    addressCountry: "GB",
  },
  alumniOf: [
    { "@type": "CollegeOrUniversity", name: "University of East London" },
    { "@type": "CollegeOrUniversity", name: "KUET" },
  ],
  sameAs: [
    "https://github.com/mithun2k2",
    "https://www.linkedin.com/in/mahmudul-hassan-9725226a/",
    "https://contentforge.net",
  ],
  knowsAbout: [
    "Python", "FastAPI", "LangGraph", "LangChain", "Next.js",
    "React", "PostgreSQL", "Machine Learning", "YOLOv8",
    "SaaS Development", "AI Agents", "Data Science",
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <PageTransition>{children}</PageTransition>
      </body>
    </html>
  )
}
