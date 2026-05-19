# SkillBridge AI 🚀

**Real-time Career Intelligence Platform** — Resume analysis, company-fit prediction, skill gap detection, and AI-powered career coaching. Built for engineers targeting top-tier tech companies.

---

## Problem Statement

Talented engineers get rejected not because they lack skills, but because:
- They don't know what skills they're actually missing
- Their resumes don't pass ATS scanners
- They can't quantify how well they match a specific company
- They have no targeted roadmap to close the gap

## Solution

SkillBridge AI gives engineers a **precise, data-driven career fit report** — in under 30 seconds. Upload a resume, pick a target company, and get:
- Overall career-fit score (0–100)
- ATS compatibility score
- Semantic match with job requirements
- Skill gap analysis with learning roadmap
- AI-rewritten resume bullets
- Company-specific interview questions
- Tailored project suggestions

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                   Docker Compose                     │
│                                                     │
│  ┌──────────┐    ┌──────────┐    ┌──────────────┐   │
│  │ Next.js  │───▶│ FastAPI  │───▶│  PostgreSQL  │   │
│  │ Frontend │    │ Backend  │    │   Database   │   │
│  │  :3000   │    │  :8000   │    │    :5432     │   │
│  └──────────┘    └──────────┘    └──────────────┘   │
│                       │                             │
│                  ┌────▼─────┐                       │
│                  │  Redis   │                       │
│                  │  Cache   │                       │
│                  │  :6379   │                       │
│                  └──────────┘                       │
└─────────────────────────────────────────────────────┘
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, TypeScript, Tailwind CSS, Recharts, Framer Motion |
| Backend | FastAPI, Python, SQLAlchemy, Pydantic |
| Database | PostgreSQL 16 |
| Cache | Redis 7 |
| AI/NLP | scikit-learn TF-IDF, sentence-transformers (optional), mock mode |
| Auth | JWT (python-jose), bcrypt |
| Infra | Docker, Docker Compose |

---

## Quick Start

### Prerequisites
- Docker & Docker Compose installed
- Git

### 1. Clone & Setup
```bash
git clone https://github.com/yourname/skillbridge-ai
cd skillbridge-ai
cp .env.example .env
```

### 2. Run (single command)
```bash
docker compose up --build
```

Wait ~2 minutes for first build. After that:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

---

## Demo Login Credentials

| User | Email | Password | Profile |
|------|-------|----------|---------|
| Demo Login | *(click Demo button)* | — | AI/ML Student |
| Alex Chen | demo@skillbridge.ai | demo123 | AI/ML Student |
| Priya Patel | priya@skillbridge.ai | demo123 | Robotics Student |
| Jordan Kim | jordan@skillbridge.ai | demo123 | Full-Stack Student |
| Admin | admin@skillbridge.ai | admin123 | Platform Admin |

---

## Demo Flow for Judges

1. Open http://localhost:3000
2. Click **Demo Login** (instant, no signup)
3. View the pre-populated **Dashboard** with charts and metrics
4. Go to **Analyze Resume** — click **Analyze Now** (resume pre-populated)
5. Select **NVIDIA** as company, click **Analyze Now**
6. View the full career-fit report: scores, skill gaps, bullet rewrites
7. Go to **Interview Prep** — see AI-generated questions
8. Go to **Projects** — see tailored project suggestions
9. Go to **Company Fit** — explore all 8 company profiles
10. Login as admin and view **Admin Analytics** dashboard

---

## Scoring Formula

```
Final Fit Score = 
  30% × Skill Match Score        (exact + normalized skill overlap)
  25% × Semantic Match Score     (TF-IDF cosine similarity)
  20% × Project Relevance Score  (role-relevant project detection)
  15% × Experience Depth Score   (quantified impact detection)
  10% × ATS Format Score         (section coverage + keyword density)
```

---

## API Endpoints

```
Auth
  POST /auth/register         Create account
  POST /auth/login            Email/password login
  POST /auth/demo-login       Instant demo access
  GET  /auth/me               Current user info

Resumes
  POST /resumes/upload        Upload PDF/DOCX/TXT
  GET  /resumes               List user resumes
  GET  /resumes/{id}          Get resume by ID

Jobs
  POST /jobs                  Create job description
  GET  /jobs                  List job descriptions
  GET  /jobs/{id}             Get job by ID

Analysis
  POST /analysis/run          Run career fit analysis
  GET  /analysis              List all analyses
  GET  /analysis/{id}         Get analysis by ID
  GET  /analysis/{id}/interview-questions
  GET  /analysis/{id}/projects

Companies
  GET  /companies             List all company templates
  GET  /companies/{name}      Get company profile

Dashboard
  GET  /dashboard/summary     User dashboard data
  GET  /dashboard/activity    Recent activity feed
  GET  /dashboard/charts      Chart data

Admin
  GET  /admin/metrics         Platform metrics
  GET  /admin/users           All users
  GET  /admin/analyses        All analyses

System
  GET  /health                Health check
  GET  /docs                  Interactive API docs
```

---

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| POSTGRES_USER | skillbridge | DB username |
| POSTGRES_PASSWORD | skillbridge | DB password |
| POSTGRES_DB | skillbridge | DB name |
| JWT_SECRET | (see .env.example) | JWT signing key |
| REDIS_URL | redis://redis:6379 | Redis connection |
| NEXT_PUBLIC_API_URL | http://localhost:8000 | API URL for browser |
| MOCK_AI_MODE | true | Use mock AI (no paid API needed) |
| OPENAI_API_KEY | (empty) | Optional: enable real AI |

---

## Docker Commands

```bash
# Start everything
docker compose up --build

# Run in background
docker compose up -d --build

# View logs
docker compose logs -f

# View backend logs only
docker compose logs -f backend

# Stop everything
docker compose down

# Stop and remove all data
docker compose down -v

# Check running containers
docker ps

# Re-seed database
docker compose exec backend python -m app.seed

# Open backend shell
docker compose exec backend bash
```

---

## Folder Structure

```
skillbridge-ai/
├── frontend/                   # Next.js 14 app
│   ├── src/
│   │   ├── app/                # App Router pages
│   │   │   ├── page.tsx        # Landing page
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   ├── dashboard/
│   │   │   ├── analyze/
│   │   │   ├── company-fit/
│   │   │   ├── interview-prep/
│   │   │   ├── projects/
│   │   │   └── admin/
│   │   ├── components/
│   │   │   ├── navigation/     # Sidebar, TopBar
│   │   │   ├── layout/         # DashboardLayout
│   │   │   ├── charts/         # ScoreRing
│   │   │   ├── cards/          # MetricCard, SkillBadge
│   │   │   └── ui/             # Skeleton
│   │   ├── lib/
│   │   │   ├── api.ts          # API client
│   │   │   └── utils.ts        # Helpers
│   │   └── types/index.ts      # TypeScript types
│   ├── Dockerfile
│   └── package.json
│
├── backend/                    # FastAPI app
│   ├── app/
│   │   ├── main.py             # FastAPI app + startup
│   │   ├── config.py           # Settings
│   │   ├── database.py         # SQLAlchemy setup
│   │   ├── models.py           # DB models
│   │   ├── schemas.py          # Pydantic schemas
│   │   ├── seed.py             # Demo data seeder
│   │   ├── api/
│   │   │   ├── auth.py
│   │   │   ├── resumes.py
│   │   │   ├── jobs.py
│   │   │   ├── analysis.py
│   │   │   ├── companies.py
│   │   │   ├── dashboard.py
│   │   │   └── admin.py
│   │   ├── services/
│   │   │   ├── scoring_service.py
│   │   │   ├── semantic_service.py
│   │   │   ├── resume_parser.py
│   │   │   └── cache_service.py
│   │   └── utils/
│   │       ├── mock_data.py
│   │       └── text_cleaner.py
│   ├── Dockerfile
│   └── requirements.txt
│
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## Troubleshooting

**Backend won't start**
```bash
docker compose logs backend
# Usually a DB connection issue — wait for postgres to be healthy
docker compose restart backend
```

**Frontend shows blank page**
```bash
# Check if backend is reachable
curl http://localhost:8000/health
# Check NEXT_PUBLIC_API_URL in .env
```

**Database connection refused**
```bash
docker compose down -v
docker compose up --build
```

**Port already in use**
```bash
# Change ports in docker-compose.yml or kill the process:
lsof -i :3000  # or :8000
kill -9 <PID>
```

**Re-seed demo data**
```bash
docker compose exec backend python -m app.seed
```

---

## Known Limitations

- Semantic similarity uses TF-IDF (not transformer embeddings) in mock mode — accuracy is good but not production-grade
- PDF parsing quality depends on PDF structure (scanned PDFs won't parse well)
- No email verification or password reset in this demo
- Admin page requires the admin role — use admin@skillbridge.ai

## Future Improvements

- [ ] Real-time websocket analysis progress
- [ ] Sentence-transformer embeddings for better semantic match
- [ ] LinkedIn profile import
- [ ] Resume PDF export with improvements applied
- [ ] Collaborative team mode for recruiters
- [ ] GPT-4/Claude API integration for richer bullet rewrites
- [ ] Job board integration (LinkedIn, Glassdoor)
- [ ] Mobile app (React Native)

---

## Hackathon Pitch

SkillBridge AI solves a real, painful problem: engineers apply to hundreds of jobs blind, getting rejected for reasons they don't understand. We built a full-stack, Docker-deployable career intelligence platform that gives instant, data-driven answers to: "Am I a fit for this role?" — and more importantly, "What do I need to do to become one?"

**What makes us different:**
- Not another resume template. Real NLP scoring against real job requirements.
- Not another chatbot. A structured, visual career intelligence dashboard.
- Multi-user, JWT-authenticated, PostgreSQL-backed, Redis-cached — production architecture.
- Runs on any machine with `docker compose up --build`. Zero setup friction.
