from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import engine
from app.models import Base
from app.api import auth, resumes, jobs, analysis, companies, dashboard, admin
from app.services.cache_service import redis_health

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="SkillBridge AI",
    description="Real-time Career Intelligence Platform",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(resumes.router, prefix="/resumes", tags=["Resumes"])
app.include_router(jobs.router, prefix="/jobs", tags=["Jobs"])
app.include_router(analysis.router, prefix="/analysis", tags=["Analysis"])
app.include_router(companies.router, prefix="/companies", tags=["Companies"])
app.include_router(dashboard.router, prefix="/dashboard", tags=["Dashboard"])
app.include_router(admin.router, prefix="/admin", tags=["Admin"])

@app.get("/health")
def health_check():
    from sqlalchemy import text
    from app.database import SessionLocal
    db_status = "disconnected"
    try:
        db = SessionLocal()
        db.execute(text("SELECT 1"))
        db.close()
        db_status = "connected"
    except Exception:
        pass
    return {"status": "ok", "database": db_status, "redis": redis_health(), "version": "1.0.0"}

@app.get("/")
def root():
    return {"message": "SkillBridge AI API", "docs": "/docs", "health": "/health"}

# Auto-seed on startup if DB is empty
@app.on_event("startup")
def startup_seed():
    try:
        from app.database import SessionLocal
        from app.models import User
        db = SessionLocal()
        count = db.query(User).count()
        db.close()
        if count == 0:
            print("📦 No users found. Running seed...")
            from app.seed import seed
            seed()
    except Exception as e:
        print(f"⚠️ Startup seed failed (non-fatal): {e}")
