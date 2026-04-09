# Mahmudul Hassan Mithun — Portfolio

Built with **Next.js 15**, **Framer Motion**, and **TypeScript**.

## Stack
- Next.js 15 (App Router, static export)
- Framer Motion 11 (card animations, scroll triggers, hover effects)
- TypeScript
- Google Fonts (Syne + DM Sans)

## Project Structure
```
src/
  app/
    layout.tsx       # Root layout + metadata
    page.tsx         # Main page
    globals.css      # CSS variables, base styles
  components/
    Navbar.tsx       # Sticky nav with scroll-aware styling
    Hero.tsx         # Animated hero + stats row
    Skills.tsx       # Animated skill cards + progress bars
    Projects.tsx     # Filterable project cards with Framer Motion
    Experience.tsx   # Timeline + recommendations
    Contact.tsx      # Contact links + footer
  data/
    index.ts         # All content: projects, skills, timeline, recs
```

## Local Development
```bash
npm install
npm run dev
# → http://localhost:3000
```

## Build & Deploy

### Option 1: Vercel (recommended — free)
1. Push this folder to a GitHub repo
2. Go to vercel.com → Import Project → select repo
3. Set Root Directory to `.` (or wherever you push it)
4. Deploy → add your custom domain `mhassanmithun.com` in Vercel settings

### Option 2: Static export (for cPanel / shared hosting)
```bash
npm run build
# Outputs to /out folder
```
Upload the contents of `/out` to your hosting's `public_html` folder via cPanel File Manager or FTP.

### Option 3: Railway
1. Push to GitHub
2. New Railway project → Deploy from GitHub
3. Set start command: `npm run start`
4. Add custom domain in Railway settings

## Updating Content
All project/skill/timeline data lives in `src/data/index.ts`.
Edit that file to add new projects, update skills, etc. — no component changes needed.

## Adding a New Project
In `src/data/index.ts`, add to the `projects` array:
```ts
{
  id: "my-new-project",
  emoji: "🚀",
  gradient: "from-[#0a0f20] to-[#10182e]",
  title: "My New Project",
  status: "live",        // "live" | "building" | "academic"
  statusLabel: "Live",
  desc: "Description here.",
  tags: ["Next.js", "FastAPI"],
  link: "https://myproject.com",
  linkLabel: "myproject.com",
  github: "https://github.com/mithun2k2/my-project",
}
```
