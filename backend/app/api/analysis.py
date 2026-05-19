from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User, Resume, JobDescription, AnalysisResult, InterviewQuestion, ProjectSuggestion, ActivityLog
from app.schemas import AnalysisRequest, AnalysisResultOut, InterviewQuestionOut, ProjectSuggestionOut
from app.api.auth import auth_required
from app.services.scoring_service import (
    extract_skills, compute_skill_match, compute_ats_score,
    compute_experience_depth, compute_project_relevance,
    compute_critical_skill_match, compute_semantic_similarity_capped,
    get_fit_label, get_recruiter_realism_note
)
from app.services.semantic_service import compute_semantic_similarity
from app.services.ai_service import enrich_analysis
from app.utils.mock_data import COMPANY_TEMPLATES
from typing import List
import logging

logger = logging.getLogger(__name__)
router = APIRouter()


def run_scoring(resume_text: str, job_text: str, company_name: str = None) -> dict:
    """
    Production scoring — recruiter-realistic with critical skill penalties.
    
    Formula:
      35% critical skill match
      25% required skill match
      15% semantic match (capped)
      10% project relevance
      10% experience depth
       5% ATS formatting
    """
    # Extract skills
    resume_skills = extract_skills(resume_text)
    job_skills = extract_skills(job_text) if job_text else []

    if company_name and company_name in COMPANY_TEMPLATES:
        template = COMPANY_TEMPLATES[company_name]
        job_skills = [s.lower() for s in template["required_skills"]]
        if not job_text:
            job_text = " ".join(template["required_skills"] + template["preferred_skills"])

    # Step 1: Critical skill match + penalty
    critical_data = compute_critical_skill_match(resume_skills, company_name, job_skills)
    critical_score = critical_data["critical_score"]
    score_cap = critical_data["score_cap"]

    # Step 2: Required skill match
    skill_score, matched, missing = compute_skill_match(resume_skills, job_skills)

    # Step 3: Semantic match (with caps)
    raw_semantic = compute_semantic_similarity(resume_text, job_text) if job_text else 40.0
    semantic_score = compute_semantic_similarity_capped(
        raw_semantic, skill_score, critical_data["missing_ratio"], resume_text
    )

    # Step 4: Other scores
    ats_score = compute_ats_score(resume_text, resume_skills)
    exp_depth = compute_experience_depth(resume_text)
    proj_rel = compute_project_relevance(resume_text, company_name)

    # Step 5: Final weighted score
    raw_final = round(
        0.35 * critical_score +
        0.25 * skill_score +
        0.15 * semantic_score +
        0.10 * proj_rel +
        0.10 * exp_depth +
        0.05 * ats_score, 1
    )

    # Apply score cap from critical penalty
    final_score = min(raw_final, score_cap)

    interview_readiness = round(min((critical_score * 0.5 + skill_score * 0.5), score_cap), 1)

    # Build explanation fields
    fit_label = get_fit_label(final_score)
    recruiter_note = get_recruiter_realism_note(
        final_score, critical_data["caps_applied"], company_name
    )

    # All matched/missing (union of critical + required)
    all_matched = list(set(matched + critical_data["critical_matched"]))
    all_missing = list(set(missing + critical_data["critical_missing"]))

    return {
        "final_fit_score": final_score,
        "ats_score": ats_score,
        "skill_match_score": skill_score,
        "semantic_match_score": semantic_score,
        "project_relevance_score": proj_rel,
        "experience_depth_score": exp_depth,
        "interview_readiness_score": interview_readiness,
        "matched_skills": all_matched[:12],
        "missing_skills": all_missing[:12],
        # Extra realism fields stored in recommendations
        "_fit_label": fit_label,
        "_recruiter_note": recruiter_note,
        "_critical_matched": critical_data["critical_matched"],
        "_critical_missing": critical_data["critical_missing"],
        "_caps_applied": critical_data["caps_applied"],
        "_penalty_reason": critical_data["penalty_reason"],
        "_score_cap": score_cap,
        "_critical_score": critical_score,
    }


@router.post("/run", response_model=AnalysisResultOut)
def run_analysis_endpoint(
    request: AnalysisRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(auth_required)
):
    # Resolve resume text
    resume_text = request.resume_text or ""
    job_text = request.job_description_text or ""

    if request.resume_id:
        resume = db.query(Resume).filter(
            Resume.id == request.resume_id,
            Resume.user_id == current_user.id
        ).first()
        if resume:
            resume_text = resume.extracted_text or ""

    if request.job_description_id:
        job = db.query(JobDescription).filter(
            JobDescription.id == request.job_description_id,
            JobDescription.user_id == current_user.id
        ).first()
        if job:
            job_text = job.description or ""

    if not resume_text.strip():
        raise HTTPException(status_code=400, detail="Resume text is required")

    # Step 1: Realistic scoring
    scores = run_scoring(resume_text, job_text, request.company_name)

    # Extract internal fields
    fit_label = scores.pop("_fit_label")
    recruiter_note = scores.pop("_recruiter_note")
    critical_matched = scores.pop("_critical_matched")
    critical_missing = scores.pop("_critical_missing")
    caps_applied = scores.pop("_caps_applied")
    penalty_reason = scores.pop("_penalty_reason")
    score_cap = scores.pop("_score_cap")
    critical_score = scores.pop("_critical_score")

    # Step 2: AI enrichment
    ai = enrich_analysis(
        resume_text=resume_text,
        job_text=job_text,
        company_name=request.company_name or "",
        role_title=request.role_title or "",
        scores=scores,
        matched_skills=scores["matched_skills"],
        missing_skills=scores["missing_skills"],
    )

    # Step 3: Build summary
    summary_parts = []
    if ai.get("role_alignment_summary"):
        summary_parts.append(ai["role_alignment_summary"])
    if recruiter_note:
        summary_parts.append(recruiter_note)
    summary = " ".join(summary_parts) if summary_parts else recruiter_note

    # Step 4: Build recommendations (include realism fields)
    recommendations = []

    # Always add fit label + penalty as first recommendation
    recommendations.append({
        "type": "realism",
        "title": f"Recruiter Assessment: {fit_label}",
        "description": recruiter_note or "Score reflects resume-to-job alignment.",
        "priority": "high" if score_cap <= 55 else "medium"
    })

    if penalty_reason:
        recommendations.append({
            "type": "critical_gap",
            "title": "Critical Skill Gaps Detected",
            "description": penalty_reason,
            "priority": "high"
        })

    if critical_missing:
        recommendations.append({
            "type": "skill",
            "title": f"Missing Critical Skills: {', '.join(critical_missing[:4])}",
            "description": f"These are non-negotiable requirements for this role. Without them, most recruiters will deprioritize your application regardless of other strengths.",
            "priority": "high"
        })

    if ai.get("missing_skills_explanation"):
        recommendations.append({
            "type": "skill",
            "title": "Skill Gap Analysis",
            "description": ai["missing_skills_explanation"],
            "priority": "high"
        })

    if ai.get("company_fit_explanation"):
        recommendations.append({
            "type": "company",
            "title": "Company Fit Assessment",
            "description": ai["company_fit_explanation"],
            "priority": "medium"
        })

    if ai.get("learning_roadmap"):
        for item in ai["learning_roadmap"][:2]:
            recommendations.append({
                "type": "learning",
                "title": f"Learn {item.get('skill', 'key skill')}",
                "description": f"{item.get('resource', '')} — Est. {item.get('time_estimate', '')}",
                "priority": item.get("priority", "medium")
            })

    # Step 5: Persist
    job_desc_obj = None
    if job_text and not request.job_description_id:
        job_desc_obj = JobDescription(
            user_id=current_user.id,
            company_name=request.company_name,
            role_title=request.role_title,
            description=job_text
        )
        db.add(job_desc_obj)
        db.flush()

    analysis = AnalysisResult(
        user_id=current_user.id,
        resume_id=request.resume_id,
        job_description_id=request.job_description_id or (job_desc_obj.id if job_desc_obj else None),
        company_name=request.company_name,
        role_title=request.role_title,
        improved_bullets=ai.get("improved_bullets", []),
        summary=summary,
        recommendations=recommendations,
        **scores
    )
    db.add(analysis)
    db.flush()

    # Interview questions
    for q in ai.get("interview_questions", [])[:7]:
        db.add(InterviewQuestion(
            user_id=current_user.id,
            analysis_id=analysis.id,
            question=q.get("question", ""),
            category=q.get("category", "Technical"),
            difficulty=q.get("difficulty", "Medium"),
            answer_hint=q.get("answer_hint", "")
        ))

    # Project suggestions
    for p in ai.get("project_suggestions", [])[:4]:
        db.add(ProjectSuggestion(
            user_id=current_user.id,
            analysis_id=analysis.id,
            title=p.get("title", ""),
            tech_stack=p.get("tech_stack", []),
            description=p.get("description", ""),
            resume_bullet=p.get("resume_bullet", ""),
            difficulty=p.get("difficulty", "Intermediate")
        ))

    db.add(ActivityLog(
        user_id=current_user.id,
        action="analysis_run",
        log_data={"company": request.company_name, "score": scores["final_fit_score"], "cap": score_cap}
    ))
    db.commit()
    db.refresh(analysis)
    return analysis


@router.get("", response_model=List[AnalysisResultOut])
def list_analyses(db: Session = Depends(get_db), current_user: User = Depends(auth_required)):
    return db.query(AnalysisResult).filter(
        AnalysisResult.user_id == current_user.id
    ).order_by(AnalysisResult.created_at.desc()).limit(20).all()


@router.get("/{analysis_id}", response_model=AnalysisResultOut)
def get_analysis(analysis_id: int, db: Session = Depends(get_db), current_user: User = Depends(auth_required)):
    a = db.query(AnalysisResult).filter(
        AnalysisResult.id == analysis_id,
        AnalysisResult.user_id == current_user.id
    ).first()
    if not a:
        raise HTTPException(status_code=404, detail="Analysis not found")
    return a


@router.get("/{analysis_id}/interview-questions", response_model=List[InterviewQuestionOut])
def get_interview_qs(analysis_id: int, db: Session = Depends(get_db), current_user: User = Depends(auth_required)):
    a = db.query(AnalysisResult).filter(
        AnalysisResult.id == analysis_id,
        AnalysisResult.user_id == current_user.id
    ).first()
    if not a:
        raise HTTPException(status_code=404, detail="Analysis not found")
    return db.query(InterviewQuestion).filter(InterviewQuestion.analysis_id == analysis_id).all()


@router.get("/{analysis_id}/projects", response_model=List[ProjectSuggestionOut])
def get_projects(analysis_id: int, db: Session = Depends(get_db), current_user: User = Depends(auth_required)):
    a = db.query(AnalysisResult).filter(
        AnalysisResult.id == analysis_id,
        AnalysisResult.user_id == current_user.id
    ).first()
    if not a:
        raise HTTPException(status_code=404, detail="Analysis not found")
    return db.query(ProjectSuggestion).filter(ProjectSuggestion.analysis_id == analysis_id).all()
