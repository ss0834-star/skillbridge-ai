from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.models import User, AnalysisResult, ActivityLog
from app.api.auth import auth_required
from app.services.cache_service import cache_get, cache_set

router = APIRouter()

@router.get("/summary")
def dashboard_summary(db: Session = Depends(get_db), current_user: User = Depends(auth_required)):
    cache_key = f"dashboard:summary:{current_user.id}"
    cached = cache_get(cache_key)
    if cached:
        return cached
    
    analyses = db.query(AnalysisResult).filter(AnalysisResult.user_id == current_user.id).order_by(AnalysisResult.created_at.desc()).all()
    
    total = len(analyses)
    avg_score = round(sum(a.final_fit_score or 0 for a in analyses) / total, 1) if total else 0
    top_company = analyses[0].company_name if analyses else None
    missing_count = sum(len(a.missing_skills or []) for a in analyses)
    
    recent = []
    for a in analyses[:5]:
        recent.append({
            "id": a.id, "company_name": a.company_name, "role_title": a.role_title,
            "final_fit_score": a.final_fit_score, "created_at": a.created_at.isoformat()
        })
    
    trend = []
    for a in reversed(analyses[-8:]):
        trend.append({"date": a.created_at.strftime("%b %d"), "score": a.final_fit_score or 0, "company": a.company_name})
    
    result = {
        "total_analyses": total, "avg_fit_score": avg_score,
        "top_company": top_company, "missing_skills_count": missing_count,
        "recent_analyses": recent, "score_trend": trend
    }
    cache_set(cache_key, result, ttl=300)
    return result

@router.get("/activity")
def dashboard_activity(db: Session = Depends(get_db), current_user: User = Depends(auth_required)):
    logs = db.query(ActivityLog).filter(ActivityLog.user_id == current_user.id).order_by(ActivityLog.created_at.desc()).limit(10).all()
    return [{"action": l.action, "metadata": l.log_data, "created_at": l.created_at.isoformat()} for l in logs]

@router.get("/charts")
def dashboard_charts(db: Session = Depends(get_db), current_user: User = Depends(auth_required)):
    analyses = db.query(AnalysisResult).filter(AnalysisResult.user_id == current_user.id).all()
    
    company_scores = {}
    all_missing = {}
    
    for a in analyses:
        if a.company_name:
            if a.company_name not in company_scores:
                company_scores[a.company_name] = []
            company_scores[a.company_name].append(a.final_fit_score or 0)
        for s in (a.missing_skills or []):
            all_missing[s] = all_missing.get(s, 0) + 1
    
    company_bar = [{"company": k, "score": round(sum(v)/len(v), 1)} for k, v in company_scores.items()]
    missing_chart = sorted([{"skill": k, "count": v} for k, v in all_missing.items()], key=lambda x: -x["count"])[:8]
    
    if analyses:
        latest = analyses[-1]
        radar_data = [
            {"subject": "Skill Match", "score": latest.skill_match_score or 0},
            {"subject": "Semantic", "score": latest.semantic_match_score or 0},
            {"subject": "Projects", "score": latest.project_relevance_score or 0},
            {"subject": "Experience", "score": latest.experience_depth_score or 0},
            {"subject": "ATS", "score": latest.ats_score or 0},
            {"subject": "Interview", "score": latest.interview_readiness_score or 0},
        ]
    else:
        radar_data = []
    
    return {"company_bar": company_bar, "missing_skills": missing_chart, "radar": radar_data}
