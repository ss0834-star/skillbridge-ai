from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.models import User, AnalysisResult, ActivityLog
from app.api.auth import auth_required

router = APIRouter()

@router.get("/metrics")
def admin_metrics(db: Session = Depends(get_db), current_user: User = Depends(auth_required)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    total_users = db.query(func.count(User.id)).scalar()
    total_analyses = db.query(func.count(AnalysisResult.id)).scalar()
    avg_score = db.query(func.avg(AnalysisResult.final_fit_score)).scalar() or 0
    
    analyses = db.query(AnalysisResult).all()
    company_counts = {}
    missing_counts = {}
    for a in analyses:
        if a.company_name:
            company_counts[a.company_name] = company_counts.get(a.company_name, 0) + 1
        for s in (a.missing_skills or []):
            missing_counts[s] = missing_counts.get(s, 0) + 1
    
    top_companies = sorted([{"company": k, "count": v} for k, v in company_counts.items()], key=lambda x: -x["count"])[:8]
    common_missing = sorted([{"skill": k, "count": v} for k, v in missing_counts.items()], key=lambda x: -x["count"])[:10]
    
    logs = db.query(ActivityLog).order_by(ActivityLog.created_at.desc()).limit(20).all()
    recent_activity = [{"action": l.action, "user_id": l.user_id, "created_at": l.created_at.isoformat()} for l in logs]
    
    return {
        "total_users": total_users, "total_analyses": total_analyses,
        "avg_fit_score": round(float(avg_score), 1),
        "top_companies": top_companies, "common_missing_skills": common_missing,
        "recent_activity": recent_activity
    }

@router.get("/users")
def admin_users(db: Session = Depends(get_db), current_user: User = Depends(auth_required)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    users = db.query(User).order_by(User.created_at.desc()).all()
    return [{"id": u.id, "name": u.name, "email": u.email, "role": u.role, "created_at": u.created_at.isoformat()} for u in users]

@router.get("/analyses")
def admin_analyses(db: Session = Depends(get_db), current_user: User = Depends(auth_required)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    analyses = db.query(AnalysisResult).order_by(AnalysisResult.created_at.desc()).limit(50).all()
    return [{"id": a.id, "user_id": a.user_id, "company_name": a.company_name, "final_fit_score": a.final_fit_score, "created_at": a.created_at.isoformat()} for a in analyses]
