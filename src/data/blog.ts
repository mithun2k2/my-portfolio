export type BlogPost = {
  slug: string
  title: string
  excerpt: string
  content: string
  category: string
  tags: string[]
  date: string
  readTime: number
  featured: boolean
  coverGradient: string
  icon: string
}

export const blogPosts: BlogPost[] = [
  {
    slug: "building-multi-agent-ai-pipeline-langchain",
    title: "Building a Production Multi-Agent AI Pipeline with LangChain & FastAPI",
    excerpt:
      "How I built ContentForge AI's 6-agent content repurposing pipeline — from YouTube transcript extraction to 27-page deep research reports — and the lessons learned shipping it to real users.",
    category: "AI/ML",
    tags: ["LangChain", "FastAPI", "Python", "Agents", "Production"],
    date: "2026-03-15",
    readTime: 12,
    featured: true,
    coverGradient: "from-[#1a1035] via-[#2d1b69] to-[#1a0f2e]",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
    content: `
## The Problem With Simple LLM Wrappers

Most tutorials show you how to call GPT-4 and get a response. That's fine for demos. But when you're building a product that needs to reliably process YouTube videos, research topics across 30 web sources, apply brand voice, and export polished Word documents — a single LLM call doesn't cut it.

This is what I learned building ContentForge AI's content repurposing pipeline.

## The Architecture

The pipeline uses 6 specialised agents chained together:

\`\`\`python
from langchain.agents import AgentExecutor
from langchain_openai import ChatOpenAI

class ContentPipeline:
    def __init__(self):
        self.transcript_agent = TranscriptAgent()
        self.research_agent = DeepResearchAgent()
        self.writer_agent = WriterAgent()
        self.qa_agent = QAAgent()
        self.brand_agent = BrandVaultAgent()
        self.competitor_agent = CompetitorAgent()
    
    async def run(self, youtube_url: str, platform: str) -> dict:
        # Stage 1: Extract transcript
        transcript = await self.transcript_agent.extract(youtube_url)
        
        # Stage 2: Parallel research (6 web searches simultaneously)
        research = await self.research_agent.research(transcript.topics)
        
        # Stage 3: Write platform-specific content
        draft = await self.writer_agent.write(transcript, research, platform)
        
        # Stage 4: QA check
        reviewed = await self.qa_agent.review(draft)
        
        # Stage 5: Apply brand voice
        branded = await self.brand_agent.apply(reviewed)
        
        return branded
\`\`\`

## The YouTube Proxy Problem

Railway's IPs are blocked by YouTube. I spent 3 days debugging this before discovering Webshare residential proxies:

\`\`\`python
import yt_dlp

def extract_transcript(url: str) -> str:
    ydl_opts = {
        'proxy': f'http://{WEBSHARE_USER}:{WEBSHARE_PASS}@proxy.webshare.io:80',
        'writeautomaticsub': True,
        'subtitleslangs': ['en'],
        'skip_download': True,
    }
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(url, download=False)
        return info.get('subtitles', {})
\`\`\`

## WebSocket Stability

The pipeline takes 2-4 minutes. Users need real-time progress updates. I use FastAPI WebSockets with heartbeats:

\`\`\`python
@app.websocket("/ws/pipeline/{task_id}")
async def pipeline_ws(websocket: WebSocket, task_id: str):
    await websocket.accept()
    
    async def send_progress(stage: str, pct: int):
        await websocket.send_json({
            "stage": stage, 
            "progress": pct,
            "timestamp": datetime.utcnow().isoformat()
        })
    
    try:
        result = await pipeline.run(task_id, progress_callback=send_progress)
        await websocket.send_json({"status": "complete", "result": result})
    except Exception as e:
        await websocket.send_json({"status": "error", "message": str(e)})
    finally:
        await websocket.close()
\`\`\`

## Key Lessons

1. **Always add retry logic** — LLM APIs fail. Wrap every call with exponential backoff.
2. **Parallel where possible** — Research across 6 topics simultaneously cuts time by 70%.
3. **Cache aggressively** — Same YouTube URL shouldn't re-process. Use Redis with a URL hash as key.
4. **Separate concerns** — Each agent has one job. Don't let the writer agent also do research.
5. **Log everything** — When something fails at 3am, you need to know exactly which agent failed and why.

The full ContentForge AI pipeline is live at contentforge.net. It's processing hundreds of videos weekly with ~94% success rate.
    `,
  },
  {
    slug: "nextjs-15-multi-tenant-saas-architecture",
    title: "Multi-Tenant SaaS Architecture with Next.js 15, Prisma & Auth0",
    excerpt:
      "A deep dive into how I architected the Enterprise Headless SaaS platform — handling 4 vertical packages, tenant isolation, Stripe billing, and Cloudflare R2 storage in a single Next.js 15 codebase.",
    category: "SaaS Dev",
    tags: ["Next.js", "Prisma", "Auth0", "Stripe", "Architecture"],
    date: "2026-02-28",
    readTime: 15,
    featured: false,
    coverGradient: "from-[#0f0a2e] via-[#1a1035] to-[#0a0f1e]",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
    content: `
## What Is Multi-Tenancy?

A multi-tenant SaaS serves multiple customers (tenants) from a single deployment. Each tenant sees only their data — even though they share the same database and application code.

## Tenant Isolation with Prisma

Every model in the schema has a \`tenantId\`:

\`\`\`prisma
model Project {
  id        String   @id @default(cuid())
  tenantId  String
  name      String
  createdAt DateTime @default(now())
  
  tenant    Tenant   @relation(fields: [tenantId], references: [id])
  
  @@index([tenantId])
}
\`\`\`

Then a middleware automatically injects the tenant filter:

\`\`\`typescript
// middleware/tenant.ts
export function withTenant(handler: NextApiHandler): NextApiHandler {
  return async (req, res) => {
    const session = await getSession(req, res)
    if (!session?.user?.tenantId) {
      return res.status(401).json({ error: 'Unauthorized' })
    }
    req.tenantId = session.user.tenantId
    return handler(req, res)
  }
}

// Usage in API route
export default withTenant(async (req, res) => {
  const projects = await prisma.project.findMany({
    where: { tenantId: req.tenantId } // Always filtered
  })
  res.json(projects)
})
\`\`\`

## The 4 Vertical Packages

Each vertical (Agency, Commerce, Enterprise, Franchise) has different feature flags:

\`\`\`typescript
export const PACKAGE_FEATURES = {
  agency: {
    maxProjects: 10,
    customDomain: true,
    whiteLabel: true,
    apiAccess: false,
  },
  enterprise: {
    maxProjects: Infinity,
    customDomain: true,
    whiteLabel: true,
    apiAccess: true,
    sso: true,
  },
}

// Check feature in component
const { tenant } = useTenant()
const features = PACKAGE_FEATURES[tenant.plan]

if (!features.apiAccess) {
  return <UpgradePrompt feature="API Access" />
}
\`\`\`

## Stripe Webhook Pipeline

\`\`\`typescript
// app/api/webhooks/stripe/route.ts
export async function POST(req: Request) {
  const sig = req.headers.get('stripe-signature')!
  const body = await req.text()
  
  const event = stripe.webhooks.constructEvent(
    body, sig, process.env.STRIPE_WEBHOOK_SECRET!
  )
  
  switch (event.type) {
    case 'customer.subscription.updated':
      await prisma.tenant.update({
        where: { stripeCustomerId: event.data.object.customer as string },
        data: { plan: getPlanFromPriceId(event.data.object.items.data[0].price.id) }
      })
      break
    case 'invoice.payment_failed':
      await sendPaymentFailedEmail(event.data.object)
      break
  }
  
  return Response.json({ received: true })
}
\`\`\`

The platform is live at platform.contentforge.net handling all 4 verticals from a single Railway deployment.
    `,
  },
  {
    slug: "power-bi-dax-advanced-patterns",
    title: "Advanced DAX Patterns for Enterprise Power BI Dashboards",
    excerpt:
      "The DAX measures, time intelligence patterns, and data modelling techniques I used to build production Power BI dashboards for my CN5026 coursework — applicable to any enterprise reporting scenario.",
    category: "Data Science",
    tags: ["Power BI", "DAX", "Data Modelling", "Analytics", "ETL"],
    date: "2026-02-10",
    readTime: 10,
    featured: false,
    coverGradient: "from-[#0a1525] via-[#0f2540] to-[#051020]",
    icon: "https://upload.wikimedia.org/wikipedia/commons/c/cf/New_Power_BI_Logo.svg",
    content: `
## Why DAX Still Matters

Despite the rise of Python and SQL for analytics, Power BI with DAX remains the dominant tool in enterprise BI. Understanding DAX deeply separates analysts who build slow, fragile reports from those who build fast, maintainable dashboards.

## The Star Schema Foundation

Every good Power BI model starts with a proper star schema:

- **Fact tables** — transactional data (Sales, Orders, Events)
- **Dimension tables** — descriptive data (Date, Customer, Product)
- **Never use flat tables** — they kill performance

\`\`\`
FactSales ──────── DimDate
    |
    ├──────────── DimCustomer  
    |
    └──────────── DimProduct
\`\`\`

## Time Intelligence Patterns

The most common requirement in any dashboard is period-over-period comparison:

\`\`\`dax
-- Year-to-date sales
Sales YTD = 
CALCULATE(
    [Total Sales],
    DATESYTD(DimDate[Date])
)

-- Same period last year
Sales SPLY = 
CALCULATE(
    [Total Sales],
    SAMEPERIODLASTYEAR(DimDate[Date])
)

-- Year-over-year growth %
YoY Growth % = 
DIVIDE(
    [Total Sales] - [Sales SPLY],
    [Sales SPLY],
    0
)
\`\`\`

## Dynamic TOP N with RANKX

\`\`\`dax
Top N Products = 
VAR TopN = SELECTEDVALUE(TopNSelector[N], 10)
RETURN
CALCULATE(
    [Total Sales],
    FILTER(
        ALL(DimProduct[ProductName]),
        RANKX(
            ALL(DimProduct[ProductName]),
            [Total Sales],
            ,
            DESC,
            Dense
        ) <= TopN
    )
)
\`\`\`

## Conditional Formatting via DAX

Instead of static rules, drive formatting from measures:

\`\`\`dax
KPI Color = 
SWITCH(
    TRUE(),
    [Target Achievement %] >= 1.0, "#22c55e",  -- Green
    [Target Achievement %] >= 0.8, "#f59e0b",  -- Amber  
    "#ef4444"                                   -- Red
)
\`\`\`

Apply this measure in Format → Conditional Formatting → Field value.

## Performance Tips

1. **Avoid calculated columns** — use measures instead
2. **Filter before calculating** — CALCULATE with filters beats FILTER(ALL())
3. **Use DIVIDE not /** — handles divide-by-zero gracefully
4. **Avoid bi-directional relationships** — they cause ambiguity and slow queries
5. **Import mode beats DirectQuery** — for datasets under 1GB, always import

These patterns formed the backbone of my CN5026 multi-page enterprise dashboard, which achieved sub-second query times on 500k+ row datasets.
    `,
  },
  {
    slug: "deploying-fastapi-railway-production",
    title: "Deploying FastAPI to Railway: The Production Checklist",
    excerpt:
      "Every mistake I made deploying ContentForge AI's backend to Railway — and the exact configuration, environment variables, health checks, and monitoring setup that finally made it rock-solid.",
    category: "SaaS Dev",
    tags: ["FastAPI", "Railway", "DevOps", "Python", "Production"],
    date: "2026-01-20",
    readTime: 8,
    featured: false,
    coverGradient: "from-[#0a1a0a] via-[#0f2a10] to-[#051005]",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
    content: `
## Railway Is Great — Until It Isn't

Railway makes deployment easy. Push to GitHub, it builds and deploys. But "deployed" is not the same as "production-ready." Here's what I learned the hard way.

## The Procfile

Always use a Procfile to define your start command:

\`\`\`
web: uvicorn main:app --host 0.0.0.0 --port $PORT --workers 2
\`\`\`

Note \`$PORT\` — Railway injects this. Never hardcode 8000.

## Health Check Endpoint

Railway needs to know your app is alive:

\`\`\`python
@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "version": os.getenv("APP_VERSION", "1.0.0")
    }
\`\`\`

Set this in Railway Settings → Health Check Path → \`/health\`

## Database Connections

Never create a new DB connection per request. Use a connection pool:

\`\`\`python
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker

engine = create_async_engine(
    DATABASE_URL,
    pool_size=5,          # Max 5 connections (Railway free = 10 limit)
    max_overflow=10,
    pool_pre_ping=True,   # Test connection before use
    pool_recycle=3600,    # Recycle after 1 hour
)

AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession)

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session
\`\`\`

## Environment Variables Checklist

\`\`\`bash
DATABASE_URL=postgresql+asyncpg://...   # Use asyncpg for async
SECRET_KEY=<64-char random string>
ENVIRONMENT=production
ALLOWED_ORIGINS=https://yourfrontend.vercel.app
REDIS_URL=redis://...                   # For rate limiting/caching
SENTRY_DSN=https://...                  # Error tracking
\`\`\`

## Rate Limiting with Upstash Redis

\`\`\`python
from upstash_ratelimit import Ratelimit, FixedWindow
from upstash_redis import Redis

ratelimit = Ratelimit(
    redis=Redis.from_env(),
    limiter=FixedWindow(max_requests=20, window=60),
)

@app.middleware("http")
async def rate_limit_middleware(request: Request, call_next):
    identifier = request.client.host
    result = ratelimit.limit(identifier)
    
    if not result.allowed:
        return JSONResponse(
            status_code=429,
            content={"error": "Rate limit exceeded"}
        )
    
    return await call_next(request)
\`\`\`

## Sentry Error Tracking

\`\`\`python
import sentry_sdk
from sentry_sdk.integrations.fastapi import FastApiIntegration

sentry_sdk.init(
    dsn=os.getenv("SENTRY_DSN"),
    integrations=[FastApiIntegration()],
    traces_sample_rate=0.1,  # 10% of requests
    environment=os.getenv("ENVIRONMENT", "development"),
)
\`\`\`

With these in place, ContentForge AI's Railway backend has maintained 99.7% uptime over 3 months.
    `,
  },
  {
    slug: "yolov8-traffic-management-94-accuracy",
    title: "Achieving 94% Accuracy with YOLOv8 for Real-Time Traffic Management",
    excerpt:
      "How I trained a custom YOLOv8 model on traffic footage, implemented adaptive signal control logic, and optimised inference speed for real-time deployment.",
    category: "AI/ML",
    tags: ["YOLOv8", "Computer Vision", "PyTorch", "Python", "OpenCV"],
    date: "2025-12-05",
    readTime: 11,
    featured: false,
    coverGradient: "from-[#0a1f0f] via-[#103520] to-[#051008]",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg",
    content: `
## Why Traffic Management Needs Computer Vision

Traditional traffic signals run on fixed timers — completely blind to actual traffic density. A computer vision system that counts vehicles in real time can adapt signal timing dynamically, reducing average wait times by 30-40%.

## Dataset Preparation

I used a combination of public datasets and custom-annotated footage:

- **UA-DETRAC** — 140k+ annotated frames from Chinese highways
- **Custom footage** — 2,000 frames from UK roundabouts (annotated with Roboflow)
- **Classes** — Car, Truck, Bus, Motorcycle, Cyclist, Pedestrian

\`\`\`python
# Dataset config (data.yaml)
train: datasets/traffic/train
val: datasets/traffic/val
test: datasets/traffic/test

nc: 6
names: ['car', 'truck', 'bus', 'motorcycle', 'cyclist', 'pedestrian']
\`\`\`

## Training YOLOv8

\`\`\`python
from ultralytics import YOLO

model = YOLO('yolov8m.pt')  # Medium model — good speed/accuracy tradeoff

results = model.train(
    data='data.yaml',
    epochs=100,
    imgsz=640,
    batch=16,
    lr0=0.01,
    lrf=0.001,
    augment=True,       # Random flips, crops, colour jitter
    hsv_h=0.015,        # Hue augmentation
    hsv_s=0.7,          # Saturation
    mosaic=1.0,         # Mosaic augmentation
    device='cuda',      # GPU required
    patience=20,        # Early stopping
    save_period=10,
)
\`\`\`

## Real-Time Inference Pipeline

\`\`\`python
import cv2
from ultralytics import YOLO
from collections import defaultdict

model = YOLO('best.pt')
cap = cv2.VideoCapture('traffic_feed.mp4')

# Define counting lines per lane
COUNTING_LINES = {
    'north': [(0, 400), (640, 400)],
    'south': [(0, 200), (640, 200)],
}

vehicle_counts = defaultdict(int)
track_history = defaultdict(list)

while cap.isOpened():
    success, frame = cap.read()
    if not success:
        break
    
    # Track vehicles across frames
    results = model.track(frame, persist=True, classes=[0,1,2,3])
    
    if results[0].boxes.id is not None:
        boxes = results[0].boxes.xywh.cpu()
        track_ids = results[0].boxes.id.int().cpu().tolist()
        
        for box, track_id in zip(boxes, track_ids):
            x, y, w, h = box
            track_history[track_id].append((float(x), float(y)))
            
            # Check if vehicle crossed counting line
            if crossed_line(track_history[track_id], COUNTING_LINES['north']):
                vehicle_counts['north'] += 1
    
    # Adaptive signal logic
    update_signal_timing(vehicle_counts)
\`\`\`

## Adaptive Signal Control

\`\`\`python
def update_signal_timing(counts: dict) -> dict:
    total = sum(counts.values())
    if total == 0:
        return {lane: 30 for lane in counts}  # Default 30s
    
    # Proportional allocation with min/max constraints
    return {
        lane: max(15, min(90, int((count / total) * 120)))
        for lane, count in counts.items()
    }
\`\`\`

## Results

| Metric | Score |
|--------|-------|
| mAP@0.5 | 94.2% |
| mAP@0.5:0.95 | 71.8% |
| Inference speed | 28ms/frame (RTX 3060) |
| FPS | ~35 real-time |

The 94% mAP@0.5 beat the project target of 85% and was achieved largely through the mosaic augmentation and custom UK road footage that improved generalisation.
    `,
  },
  {
    slug: "building-fullstack-booking-saas-react-node-prisma",
    title: "Building a Full-Stack Booking SaaS with React, Node.js & Prisma",
    excerpt:
      "How I built CanopyCare — a production booking system with a 4-step wizard, live slot calendar, budget-to-package quote engine, admin panel, JWT auth, Cloudinary uploads, and SendGrid emails — from scratch to live deployment.",
    category: "Web Dev",
    tags: ["React", "Node.js", "Prisma", "PostgreSQL", "Vite", "Tailwind", "JWT", "Zustand"],
    date: "2026-04-01",
    readTime: 13,
    featured: false,
    coverGradient: "from-[#0a2010] via-[#0f3520] to-[#051008]",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
    content: `
## What We're Building

CanopyCare is a full-stack SaaS booking platform for a canopy cleaning business. Customers can book cleaning slots online, state their budget, and receive an instant package quote. The business owner manages everything through a dedicated admin panel.

Live at: canopycare.contentforge.net

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, Zustand |
| Forms | React Hook Form, Zod |
| Backend | Node.js, Express |
| ORM | Prisma |
| Database | PostgreSQL (Supabase) |
| Auth | JWT + bcryptjs |
| Uploads | Multer + Cloudinary |
| Email | Nodemailer + Resend |

## The 4-Step Booking Wizard

The core UX challenge was making a complex booking flow feel simple. I broke it into 4 clear steps:

1. **Cleaning details** — canopy type, size, grease level, address, photo uploads
2. **Slot picker** — live calendar showing available time slots
3. **Budget selector** — instant package match via quote engine
4. **Review & confirm** — full breakdown with cancellation policy

\`\`\`jsx
// BookingWizard.jsx
const STEPS = ['Details', 'Slot', 'Package', 'Confirm']

export default function BookingWizard() {
  const [step, setStep] = useState(0)
  const { booking, updateBooking } = useBookingStore()

  return (
    <div>
      <StepIndicator steps={STEPS} current={step} />
      {step === 0 && <CleaningDetailsForm onNext={() => setStep(1)} />}
      {step === 1 && <SlotPicker onNext={() => setStep(2)} />}
      {step === 2 && <QuoteCard onNext={() => setStep(3)} />}
      {step === 3 && <BookingConfirm onBack={() => setStep(2)} />}
    </div>
  )
}
\`\`\`

## The Quote Engine

The budget-to-package matching algorithm runs on both frontend and backend (shared logic):

\`\`\`javascript
// quoteEngine.js (shared between frontend and backend)
export function matchPackage(budget, packages) {
  // Sort packages by price ascending
  const sorted = [...packages].sort((a, b) => a.price - b.price)
  
  // Find the best package within budget
  const affordable = sorted.filter(p => p.price <= budget)
  
  if (affordable.length === 0) {
    // Return cheapest package with upgrade prompt
    return { package: sorted[0], upgrade: true }
  }
  
  // Return most expensive affordable package (best value)
  return { package: affordable[affordable.length - 1], upgrade: false }
}
\`\`\`

## JWT Authentication with Role-Based Access

\`\`\`javascript
// auth.middleware.js
export const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ error: 'No token' })
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await prisma.user.findUnique({ where: { id: decoded.id } })
    next()
  } catch {
    res.status(401).json({ error: 'Invalid token' })
  }
}

// role.middleware.js
export const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Admin only' })
  }
  next()
}
\`\`\`

## Cloudinary Photo Uploads

\`\`\`javascript
// upload.service.js
import { v2 as cloudinary } from 'cloudinary'
import { Readable } from 'stream'

export async function uploadToCloudinary(buffer, folder) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image' },
      (error, result) => {
        if (error) reject(error)
        else resolve(result.secure_url)
      }
    )
    Readable.from(buffer).pipe(stream)
  })
}
\`\`\`

## Preventing Double-Bookings

Race conditions are a real problem with slot booking. I used Prisma transactions:

\`\`\`javascript
// bookingUtils.js
export async function createBookingWithSlot(data) {
  return await prisma.$transaction(async (tx) => {
    // Lock the slot row
    const slot = await tx.slot.findUnique({
      where: { id: data.slotId }
    })
    
    if (slot.bookedCount >= slot.capacity) {
      throw new Error('Slot is fully booked')
    }
    
    // Create booking and increment slot count atomically
    const [booking] = await Promise.all([
      tx.booking.create({ data }),
      tx.slot.update({
        where: { id: data.slotId },
        data: { bookedCount: { increment: 1 } }
      })
    ])
    
    return booking
  })
}
\`\`\`

## 24-Hour Cancellation Rule

\`\`\`javascript
export function canCancel(slotDateTime) {
  const hoursUntilSlot = differenceInHours(
    new Date(slotDateTime),
    new Date()
  )
  return hoursUntilSlot >= parseInt(process.env.CANCELLATION_HOURS || '24')
}
\`\`\`

## Deployment Stack

- **Database:** Supabase (free PostgreSQL)
- **Backend:** Render (free Node.js hosting)
- **Frontend:** Vercel (free Vite/React hosting)
- **Domain:** canopycare.contentforge.net (Cloudflare subdomain, free)
- **Photos:** Cloudinary (free tier)
- **Email:** Resend (free tier)

Total monthly cost: **£0**

The full source is split across two repos — canopycare-backend and canopycare-frontend on GitHub.
    `,
  },
  {
    slug: "from-engineering-to-ai-career-pivot",
    title: "From Electrical Engineering to AI SaaS: My Career Pivot Story",
    excerpt:
      "How I transitioned from a BEng in Electrical Engineering at KUET to building production AI SaaS products in London — the skills that transferred, the gaps I had to fill, and what I'd do differently.",
    category: "Career",
    tags: ["Career", "AI", "Learning", "SaaS", "University"],
    date: "2025-11-15",
    readTime: 7,
    featured: false,
    coverGradient: "from-[#1a0f2e] via-[#2d1535] to-[#0a0515]",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg",
    content: `
## The Unexpected Foundation

When I studied Electrical & Electronic Engineering at KUET in Bangladesh, I didn't expect it to be the foundation of an AI career. But looking back, the overlap is significant:

- **Signal processing** → directly maps to time-series ML
- **Control systems** → the feedback loops in RL agents
- **Circuit analysis** → debugging complex system interactions
- **Mathematics** — linear algebra, calculus, differential equations → the backbone of ML

The hard skills transferred. The mindset transferred even more.

## The Gap: Software Engineering

What EE didn't teach me was production software engineering. I knew how to write code that worked on my machine. I didn't know how to:

- Structure a codebase for a team
- Write tests
- Deploy reliably
- Think about scalability
- Handle authentication, payments, user data

I spent the first year at UEL filling these gaps aggressively.

## What Accelerated My Learning

**1. Building real products, not tutorials**

I stopped following tutorials after completing the basics. The moment I started ContentForge AI — with a real goal, real users, and real bugs — my learning compounded.

**2. Reading other people's production code**

Open source repositories (FastAPI, LangChain, Next.js examples) taught me patterns that no tutorial covers.

**3. Virtual experience programmes**

J.P. Morgan and Walmart's virtual programmes gave me exposure to enterprise engineering practices and something concrete to put on a CV.

**4. Embracing failure**

ContentForge AI had 47 production bugs in the first month. Each one taught me something a course never would.

## The Skills That Matter Most (In Order)

1. **Communication** — explaining complex AI systems to non-technical stakeholders
2. **Problem decomposition** — breaking hard problems into solvable pieces
3. **Speed of learning** — the specific tech stack matters less than how fast you learn new ones
4. **Shipping** — a mediocre product that exists beats a perfect product in planning
5. **Technical depth** — eventually you need it, but breadth gets you started

## What I'd Do Differently

- Start building products in year 1, not year 2
- Contribute to open source earlier — it builds reputation and skills simultaneously
- Document everything — this blog is 2 years late

If you're considering a similar pivot: the path from engineering to AI is shorter than you think, and the foundations you already have are more valuable than you realise.
    `,
  },
  {
    slug: "deploying-fullstack-saas-free-supabase-render-vercel",
    title: "Deploying a Full-Stack SaaS for Free: Supabase + Render + Vercel",
    excerpt:
      "How I deployed CanopyCare — a production Node.js + React booking system — at zero monthly cost using Supabase for PostgreSQL, Render for the backend, Vercel for the frontend, and Cloudflare for the custom subdomain.",
    category: "SaaS Dev",
    tags: ["Deployment", "Supabase", "Render", "Vercel", "Cloudflare", "Node.js", "DevOps"],
    date: "2026-04-05",
    readTime: 9,
    featured: false,
    coverGradient: "from-[#0a2010] via-[#0f3520] to-[#051008]",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
    content: `
## The Zero-Cost Stack

When I deployed CanopyCare — a full booking SaaS with auth, photo uploads, email notifications, and an admin panel — I did it without spending a penny. Here's the exact stack:

| Service | Purpose | Free Tier |
|---------|---------|-----------|
| Supabase | PostgreSQL DB | 500MB, 50K MAU |
| Render | Node.js backend | 750 hrs/month |
| Vercel | React frontend | Unlimited deploys |
| Cloudflare | Subdomain DNS | Free |
| Cloudinary | Photo storage | 25GB |
| Resend | Transactional email | 3K/month |

## Step 1 — Database: Supabase

Supabase gives you a full PostgreSQL database with a connection string you can use directly with Prisma:

\`\`\`bash
# .env
DATABASE_URL="postgresql://postgres.xxxx:password@aws-eu-west-1.pooler.supabase.com:5432/postgres"
DIRECT_URL="postgresql://postgres.xxxx:password@aws-eu-west-1.pooler.supabase.com:5432/postgres"
\`\`\`

\`\`\`prisma
// schema.prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
\`\`\`

Run migrations pointing directly at Supabase:

\`\`\`bash
DATABASE_URL="your_supabase_url" npx prisma migrate deploy
\`\`\`

## Step 2 — Backend: Render

Render auto-detects Node.js. The key settings:

- **Build command:** \`npm install && npx prisma generate\`
- **Start command:** \`node src/server.js\`
- **Instance type:** Free

Critical: move \`prisma\` from \`devDependencies\` to \`dependencies\` — Render's production build skips dev deps:

\`\`\`bash
npm install prisma --save
git add package.json && git commit -m "fix: prisma to dependencies" && git push
\`\`\`

Your backend will be live at \`https://your-app.onrender.com\`. Note: free tier spins down after 15 mins of inactivity — first request takes ~30s to wake up.

## Step 3 — Frontend: Vercel

Vercel auto-detects Vite. Add one environment variable:

\`\`\`
VITE_API_URL = https://your-backend.onrender.com/api
\`\`\`

For client-side routing (React Router), add a \`vercel.json\` at the root:

\`\`\`json
{"rewrites":[{"source":"/(.*)", "destination":"/index.html"}]}
\`\`\`

Without this, direct URL access to \`/register\`, \`/dashboard\` etc. returns 404.

## Step 4 — Custom Domain: Cloudflare Subdomain

If you own a domain on Cloudflare, you can create a free subdomain pointing to Vercel:

\`\`\`
Type: CNAME
Name: canopycare
Value: [your-vercel-cname].vercel-dns.com
Proxy: OFF (grey cloud)
\`\`\`

Then add the subdomain in Vercel → Settings → Domains.

## CORS Configuration

The most common production bug: your backend CORS only allows the Vercel URL but you've added a custom domain. Always keep \`FRONTEND_URL\` updated on Render:

\`\`\`javascript
// app.js
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}))
\`\`\`

## Total Monthly Cost: £0

The entire CanopyCare stack — database, backend API, frontend, photo storage, email — runs completely free. For a portfolio project or early-stage startup, this is all you need.
    `,
  },
  {
    slug: "building-agentic-booking-system-langgraph-whatsapp",
    title: "Building an Agentic Booking System with LangGraph & Twilio WhatsApp",
    excerpt:
      "A deep dive into BookingForge AI — a multi-tenant agentic booking SaaS where a LangGraph agent handles the entire booking flow over WhatsApp, from intent detection to slot confirmation.",
    category: "AI/ML",
    tags: ["LangGraph", "Twilio", "WhatsApp", "FastAPI", "Agents", "Multi-tenant"],
    date: "2026-04-08",
    readTime: 14,
    featured: false,
    coverGradient: "from-[#0f2027] via-[#1a3a4a] to-[#051015]",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
    content: `
## Why WhatsApp for Bookings?

Most UK small businesses still take bookings by phone or email. WhatsApp has 2 billion users — building a booking agent that lives in WhatsApp means zero friction for customers. No app download, no account creation. Just message and book.

## The Architecture

\`\`\`
Customer WhatsApp → Twilio → FastAPI Webhook → LangGraph Agent → Supabase
                                                      ↓
                                              Twilio → WhatsApp Reply
\`\`\`

## LangGraph Agent Design

The booking agent uses a state machine with 5 nodes:

\`\`\`python
from langgraph.graph import StateGraph, END
from typing import TypedDict, Optional

class BookingState(TypedDict):
    phone: str
    tenant_id: str
    messages: list
    intent: Optional[str]
    service: Optional[str]
    date: Optional[str]
    slot_id: Optional[int]
    confirmed: bool

def build_booking_graph():
    graph = StateGraph(BookingState)
    
    graph.add_node("detect_intent", detect_intent_node)
    graph.add_node("collect_service", collect_service_node)
    graph.add_node("show_slots", show_slots_node)
    graph.add_node("confirm_booking", confirm_booking_node)
    graph.add_node("handle_cancel", handle_cancel_node)
    
    graph.set_entry_point("detect_intent")
    
    graph.add_conditional_edges("detect_intent", route_intent, {
        "book": "collect_service",
        "cancel": "handle_cancel",
        "unknown": END,
    })
    
    graph.add_edge("collect_service", "show_slots")
    graph.add_edge("show_slots", "confirm_booking")
    graph.add_edge("confirm_booking", END)
    
    return graph.compile()
\`\`\`

## Intent Detection Node

\`\`\`python
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)

async def detect_intent_node(state: BookingState) -> BookingState:
    last_msg = state["messages"][-1]
    
    result = await llm.ainvoke([
        {"role": "system", "content": """
            Classify the user's intent as one of: book, cancel, unknown.
            Reply with just the intent word.
        """},
        {"role": "user", "content": last_msg}
    ])
    
    state["intent"] = result.content.strip().lower()
    return state
\`\`\`

## Twilio WhatsApp Webhook

\`\`\`python
from fastapi import FastAPI, Form
from twilio.rest import Client

app = FastAPI()
twilio_client = Client(TWILIO_SID, TWILIO_TOKEN)

@app.post("/webhook/whatsapp")
async def whatsapp_webhook(
    From: str = Form(...),
    Body: str = Form(...),
    To: str = Form(...),
):
    phone = From.replace("whatsapp:", "")
    tenant_id = get_tenant_from_number(To)
    
    # Get or create conversation state
    state = await get_conversation_state(phone, tenant_id)
    state["messages"].append(Body)
    
    # Run the agent
    agent = build_booking_graph()
    new_state = await agent.ainvoke(state)
    
    # Save state for next message
    await save_conversation_state(phone, tenant_id, new_state)
    
    # Send reply
    reply = generate_reply(new_state)
    twilio_client.messages.create(
        from_=To,
        to=From,
        body=reply
    )
    
    return {"status": "ok"}
\`\`\`

## Multi-Tenancy

Each business gets their own WhatsApp number via Twilio. The \`To\` field in the webhook identifies which tenant the message is for:

\`\`\`python
def get_tenant_from_number(whatsapp_number: str) -> str:
    number = whatsapp_number.replace("whatsapp:", "")
    tenant = db.query(Tenant).filter(
        Tenant.whatsapp_number == number
    ).first()
    return tenant.id if tenant else None
\`\`\`

## Conversation State Persistence

Between messages, state is stored in Redis:

\`\`\`python
import redis
import json

redis_client = redis.from_url(REDIS_URL)

async def get_conversation_state(phone: str, tenant_id: str) -> BookingState:
    key = f"conv:{tenant_id}:{phone}"
    data = redis_client.get(key)
    if data:
        return json.loads(data)
    return BookingState(phone=phone, tenant_id=tenant_id, messages=[], confirmed=False)

async def save_conversation_state(phone: str, tenant_id: str, state: BookingState):
    key = f"conv:{tenant_id}:{phone}"
    redis_client.setex(key, 3600, json.dumps(state))  # 1hr TTL
\`\`\`

## Example Conversation

\`\`\`
Customer: Hi, I want to book a canopy clean
Agent: Hi! I'd love to help you book. What type of service do you need?
       1. Basic Clean (£89)
       2. Commercial Package (£149)
       3. Deep Clean Pro (£249)

Customer: 2
Agent: Great choice! Here are available slots this week:
       • Mon 14 Apr - 9:00 AM
       • Tue 15 Apr - 2:00 PM
       • Wed 16 Apr - 11:00 AM
       Reply with your preferred slot number.

Customer: 1
Agent: Perfect! Confirming your booking:
       Service: Commercial Package (£149)
       Date: Monday 14 April, 9:00 AM
       Reply YES to confirm or NO to cancel.

Customer: YES
Agent: ✅ Booking confirmed! Reference: CC-2026-0042
       You'll receive a reminder 24 hours before your appointment.
\`\`\`

BookingForge AI is currently in active development — the WhatsApp agent is live in testing with 2 pilot businesses.
    `,
  },
  {
    slug: "windows-server-2022-active-directory-vmware",
    title: "Setting Up Windows Server 2022 Active Directory on VMware Workstation",
    excerpt:
      "A complete walkthrough of my CN5009 WBL project: deploying a virtualised enterprise IT infrastructure with Windows Server 2022 Domain Controller, Windows 10 client, and Ubuntu LAMP server on VMware Workstation Pro 17.",
    category: "Web Dev",
    tags: ["VMware", "Windows Server 2022", "Active Directory", "Ubuntu", "LAMP", "DNS", "DHCP"],
    date: "2026-03-20",
    readTime: 11,
    featured: false,
    coverGradient: "from-[#0a0f20] via-[#10182e] to-[#050810]",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/windows8/windows8-original.svg",
    content: `
## Project Overview

For my CN5009 Work-Based Learning placement at the University of East London, I built a complete virtualised enterprise IT infrastructure. The setup mirrors a real small business network:

- **WIN-DC01** — Windows Server 2022 Domain Controller (192.168.1.10)
- **WIN-CLIENT01** — Windows 10 workstation joined to domain
- **UBUNTU-WEB01** — Ubuntu 22.04 LAMP server (192.168.1.30)
- **Domain:** project.local
- **Network:** VMnet1 (Host-only, 192.168.1.0/24)

## VMware Network Configuration

All VMs use **Host-Only** networking on VMnet1. This creates an isolated network with no internet access — perfect for a lab environment.

\`\`\`
VMnet1: 192.168.1.0/24 (Host-only)
├── WIN-DC01:      192.168.1.10 (static)
├── WIN-CLIENT01:  192.168.1.20 (static)
└── UBUNTU-WEB01:  192.168.1.30 (static)
\`\`\`

## Step 1 — Windows Server 2022 Setup

After installing Windows Server 2022, set a static IP:

\`\`\`powershell
# Set static IP
New-NetIPAddress -InterfaceAlias "Ethernet0" \`
  -IPAddress 192.168.1.10 \`
  -PrefixLength 24 \`
  -DefaultGateway 192.168.1.1

# Set DNS to itself (DC will be its own DNS)
Set-DnsClientServerAddress -InterfaceAlias "Ethernet0" \`
  -ServerAddresses 192.168.1.10

# Rename the server
Rename-Computer -NewName "WIN-DC01" -Restart
\`\`\`

## Step 2 — Install Active Directory Domain Services

\`\`\`powershell
# Install AD DS role
Install-WindowsFeature -Name AD-Domain-Services -IncludeManagementTools

# Promote to Domain Controller
Import-Module ADDSDeployment
Install-ADDSForest \`
  -DomainName "project.local" \`
  -DomainNetbiosName "PROJECT" \`
  -ForestMode "WinThreshold" \`
  -DomainMode "WinThreshold" \`
  -InstallDns:$true \`
  -SafeModeAdministratorPassword (ConvertTo-SecureString "P@ssword123!" -AsPlainText -Force) \`
  -Force:$true
\`\`\`

Server will restart automatically and become the DC for project.local.

## Step 3 — Configure DNS & DHCP

\`\`\`powershell
# Install DHCP
Install-WindowsFeature -Name DHCP -IncludeManagementTools

# Create DHCP scope
Add-DhcpServerv4Scope \`
  -Name "project.local scope" \`
  -StartRange 192.168.1.100 \`
  -EndRange 192.168.1.200 \`
  -SubnetMask 255.255.255.0

# Set DHCP options (DNS and gateway)
Set-DhcpServerv4OptionValue \`
  -DnsServer 192.168.1.10 \`
  -Router 192.168.1.1

# Authorise DHCP in AD
Add-DhcpServerInDC -DnsName "WIN-DC01.project.local"
\`\`\`

## Step 4 — Create AD Users and OUs

\`\`\`powershell
# Create OUs
New-ADOrganizationalUnit -Name "Staff" -Path "DC=project,DC=local"
New-ADOrganizationalUnit -Name "IT" -Path "DC=project,DC=local"
New-ADOrganizationalUnit -Name "Computers" -Path "DC=project,DC=local"

# Create users
New-ADUser \`
  -Name "Hassan Mithun" \`
  -GivenName "Hassan" \`
  -Surname "Mithun" \`
  -SamAccountName "hmithun" \`
  -UserPrincipalName "hmithun@project.local" \`
  -Path "OU=IT,DC=project,DC=local" \`
  -AccountPassword (ConvertTo-SecureString "P@ssword123!" -AsPlainText -Force) \`
  -Enabled $true

# Add to Domain Admins
Add-ADGroupMember -Identity "Domain Admins" -Members "hmithun"
\`\`\`

## Step 5 — Join Windows 10 Client to Domain

On WIN-CLIENT01, set DNS to point at the DC:

\`\`\`powershell
Set-DnsClientServerAddress -InterfaceAlias "Ethernet0" -ServerAddresses 192.168.1.10
\`\`\`

Then join the domain:

\`\`\`powershell
Add-Computer -DomainName "project.local" \`
  -Credential (Get-Credential) \`
  -Restart
\`\`\`

Log in with \`PROJECT\\hmithun\` and domain credentials work across the network.

## Step 6 — Ubuntu LAMP Server

\`\`\`bash
# Install LAMP stack
sudo apt update
sudo apt install apache2 mysql-server php php-mysql -y

# Set static IP
sudo nano /etc/netplan/00-installer-config.yaml
\`\`\`

\`\`\`yaml
network:
  version: 2
  ethernets:
    ens33:
      addresses: [192.168.1.30/24]
      gateway4: 192.168.1.1
      nameservers:
        addresses: [192.168.1.10]
\`\`\`

\`\`\`bash
sudo netplan apply

# Test connectivity
ping WIN-DC01.project.local  # Should resolve via AD DNS
\`\`\`

## Lessons Learned

1. **BSOD during AD promotion** — caused by insufficient RAM. Minimum 2GB for Server 2022 — give it 4GB.
2. **DNS is everything** — if DNS fails, nothing works. Always point clients at the DC for DNS first.
3. **Snapshot before promotion** — take a VMware snapshot before promoting to DC. Reverting a misconfigured DC is painful.
4. **Host-only vs NAT** — use Host-only for isolated lab networks. NAT gives internet but breaks domain resolution.

The full lab logs are documented in my CN5009 WBL placement report.
    `,
  },
  {
    slug: "oracle-sql-plsql-fleet-management-system",
    title: "Building a Fleet Management System with Oracle SQL & PL/SQL",
    excerpt:
      "How I designed and built SuperRides RTFMS — a real-time fleet management system for a ride-hailing company using Oracle SQL, complex triggers, stored procedures, and a fully normalised 3NF schema.",
    category: "Data Science",
    tags: ["Oracle SQL", "PL/SQL", "Triggers", "Stored Procedures", "ERD", "Normalisation"],
    date: "2026-03-01",
    readTime: 10,
    featured: false,
    coverGradient: "from-[#0f1a0a] via-[#1a2d10] to-[#050a05]",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/oracle/oracle-original.svg",
    content: `
## Project Overview

SuperRides RTFMS (Real-Time Fleet Management System) is a database-driven system for managing a ride-hailing company's operations. Built for CN5000, it handles drivers, vehicles, bookings, payments, and real-time trip tracking.

## Database Schema Design

The schema has 8 tables in 3NF (Third Normal Form):

\`\`\`sql
-- Core tables
CREATE TABLE drivers (
    driver_id    NUMBER PRIMARY KEY,
    name         VARCHAR2(100) NOT NULL,
    license_no   VARCHAR2(20) UNIQUE NOT NULL,
    phone        VARCHAR2(15),
    status       VARCHAR2(10) DEFAULT 'AVAILABLE'
                 CHECK (status IN ('AVAILABLE','BUSY','OFFLINE')),
    rating       NUMBER(3,2) DEFAULT 5.0,
    created_at   DATE DEFAULT SYSDATE
);

CREATE TABLE vehicles (
    vehicle_id   NUMBER PRIMARY KEY,
    driver_id    NUMBER REFERENCES drivers(driver_id),
    reg_number   VARCHAR2(10) UNIQUE NOT NULL,
    make         VARCHAR2(50),
    model        VARCHAR2(50),
    year         NUMBER(4),
    vehicle_type VARCHAR2(20) CHECK (vehicle_type IN ('STANDARD','PREMIUM','XL'))
);

CREATE TABLE bookings (
    booking_id     NUMBER PRIMARY KEY,
    customer_id    NUMBER REFERENCES customers(customer_id),
    driver_id      NUMBER REFERENCES drivers(driver_id),
    vehicle_id     NUMBER REFERENCES vehicles(vehicle_id),
    pickup_loc     VARCHAR2(200) NOT NULL,
    dropoff_loc    VARCHAR2(200) NOT NULL,
    booking_time   TIMESTAMP DEFAULT SYSTIMESTAMP,
    status         VARCHAR2(15) DEFAULT 'PENDING'
                   CHECK (status IN ('PENDING','CONFIRMED','IN_PROGRESS','COMPLETED','CANCELLED')),
    fare           NUMBER(8,2),
    distance_km    NUMBER(6,2)
);
\`\`\`

## Sequences and Auto-Increment

Oracle doesn't have AUTO_INCREMENT — use sequences:

\`\`\`sql
CREATE SEQUENCE driver_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE booking_seq START WITH 1000 INCREMENT BY 1;

-- Use in insert
INSERT INTO drivers (driver_id, name, license_no)
VALUES (driver_seq.NEXTVAL, 'John Smith', 'DL123456');
\`\`\`

## Triggers

### Auto-update driver status on booking

\`\`\`sql
CREATE OR REPLACE TRIGGER trg_booking_driver_status
AFTER INSERT ON bookings
FOR EACH ROW
BEGIN
    IF :NEW.status = 'CONFIRMED' THEN
        UPDATE drivers
        SET status = 'BUSY'
        WHERE driver_id = :NEW.driver_id;
    END IF;
END;
/
\`\`\`

### Auto-calculate fare on trip completion

\`\`\`sql
CREATE OR REPLACE TRIGGER trg_calculate_fare
BEFORE UPDATE ON bookings
FOR EACH ROW
WHEN (NEW.status = 'COMPLETED')
DECLARE
    v_rate NUMBER;
BEGIN
    SELECT rate_per_km INTO v_rate
    FROM vehicle_rates
    WHERE vehicle_type = (
        SELECT vehicle_type FROM vehicles
        WHERE vehicle_id = :NEW.vehicle_id
    );
    
    :NEW.fare := :NEW.distance_km * v_rate;
    
    -- Free driver after completion
    UPDATE drivers SET status = 'AVAILABLE'
    WHERE driver_id = :NEW.driver_id;
END;
/
\`\`\`

## Stored Procedures

### Assign nearest available driver

\`\`\`sql
CREATE OR REPLACE PROCEDURE assign_driver(
    p_booking_id IN NUMBER,
    p_vehicle_type IN VARCHAR2
) AS
    v_driver_id NUMBER;
    v_vehicle_id NUMBER;
BEGIN
    -- Find available driver with matching vehicle type
    SELECT d.driver_id, v.vehicle_id
    INTO v_driver_id, v_vehicle_id
    FROM drivers d
    JOIN vehicles v ON d.driver_id = v.driver_id
    WHERE d.status = 'AVAILABLE'
    AND v.vehicle_type = p_vehicle_type
    AND ROWNUM = 1
    ORDER BY d.rating DESC;
    
    -- Assign to booking
    UPDATE bookings
    SET driver_id = v_driver_id,
        vehicle_id = v_vehicle_id,
        status = 'CONFIRMED'
    WHERE booking_id = p_booking_id;
    
    COMMIT;
    DBMS_OUTPUT.PUT_LINE('Driver ' || v_driver_id || ' assigned to booking ' || p_booking_id);
    
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        DBMS_OUTPUT.PUT_LINE('No available drivers for vehicle type: ' || p_vehicle_type);
        ROLLBACK;
END assign_driver;
/
\`\`\`

## Complex Analytical Queries

### Revenue report by driver and vehicle type

\`\`\`sql
SELECT 
    d.name AS driver_name,
    v.vehicle_type,
    COUNT(b.booking_id) AS total_trips,
    ROUND(SUM(b.fare), 2) AS total_revenue,
    ROUND(AVG(b.fare), 2) AS avg_fare,
    ROUND(AVG(b.distance_km), 1) AS avg_distance,
    ROUND(AVG(d.rating), 2) AS driver_rating
FROM bookings b
JOIN drivers d ON b.driver_id = d.driver_id
JOIN vehicles v ON b.vehicle_id = v.vehicle_id
WHERE b.status = 'COMPLETED'
AND b.booking_time >= ADD_MONTHS(SYSDATE, -1)
GROUP BY d.name, v.vehicle_type
HAVING COUNT(b.booking_id) >= 5
ORDER BY total_revenue DESC;
\`\`\`

### Peak hours analysis

\`\`\`sql
SELECT 
    TO_CHAR(booking_time, 'HH24') AS hour_of_day,
    COUNT(*) AS booking_count,
    ROUND(AVG(fare), 2) AS avg_fare,
    RANK() OVER (ORDER BY COUNT(*) DESC) AS peak_rank
FROM bookings
WHERE status != 'CANCELLED'
GROUP BY TO_CHAR(booking_time, 'HH24')
ORDER BY booking_count DESC;
\`\`\`

## Key Lessons

1. **Triggers fire for every row** — keep them lightweight. Heavy logic belongs in stored procedures.
2. **COMMIT inside procedures** — always commit explicitly. Oracle doesn't auto-commit like MySQL.
3. **EXCEPTION blocks are mandatory** — \`NO_DATA_FOUND\` will crash your procedure without them.
4. **Use ROWNUM carefully** — \`ROWNUM = 1\` must be used before ORDER BY, or wrap in a subquery.
5. **3NF saves you later** — a well-normalised schema makes complex joins trivial.

The full SuperRides schema, all triggers, stored procedures, and test data are in my CN5000 coursework submission.
    `,
  },
]

export const categories = ["All", "AI/ML", "SaaS Dev", "Data Science", "Career", "Web Dev"]
