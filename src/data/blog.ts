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
    icon: "🤖",
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
    icon: "🏗️",
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
    icon: "📊",
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
    icon: "🚀",
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
    icon: "🔬",
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
    icon: "🎓",
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
]

export const categories = ["All", "AI/ML", "SaaS Dev", "Data Science", "Career", "Web Dev"]
