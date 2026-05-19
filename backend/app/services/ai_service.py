"""
SkillBridge AI — Production AI Service
Supports: OpenAI (primary) | Gemini (dev/testing) | Mock (always-available fallback)

Security: API keys are ONLY used here, inside the backend. Never exposed to frontend.
Scoring: Numeric scores are computed by scoring_service first. AI only enriches text fields.
"""
import json
import hashlib
import logging
from typing import Optional

from app.config import settings
from app.services.cache_service import cache_get, cache_set

logger = logging.getLogger(__name__)

# ─── Stable cache key ────────────────────────────────────────────────────────

def _make_cache_key(resume_text: str, job_text: str, company_name: str, provider: str, model: str) -> str:
    raw = f"{resume_text[:500]}|{job_text[:300]}|{company_name}|{provider}|{model}"
    h = hashlib.sha256(raw.encode()).hexdigest()[:32]
    return f"ai_enrichment:{h}"

# ─── System + user prompt builders ───────────────────────────────────────────

SYSTEM_PROMPT = """You are an expert career intelligence engine for SkillBridge AI.
You analyze resume-to-job alignment. You do NOT guarantee hiring outcomes.
You only assess role fit, skill gaps, ATS alignment, interview readiness, project relevance, and improvement suggestions.
You must respond with valid JSON only — no markdown, no explanation, no preamble."""

def _build_user_prompt(
    resume_text: str,
    job_text: str,
    company_name: str,
    role_title: str,
    scores: dict,
    matched_skills: list,
    missing_skills: list,
) -> str:
    max_chars = settings.AI_MAX_INPUT_CHARS
    resume_snippet = resume_text[:max_chars // 2]
    job_snippet = job_text[:max_chars // 4] if job_text else "Not provided"

    return f"""Analyze this resume-to-job alignment and return ONLY a JSON object.

RESUME:
{resume_snippet}

JOB DESCRIPTION:
{job_snippet}

TARGET COMPANY: {company_name or 'Not specified'}
TARGET ROLE: {role_title or 'Not specified'}

NUMERIC SCORES (already computed — do NOT change these):
- Final Fit Score: {scores.get('final_fit_score', 0):.1f}%
- ATS Score: {scores.get('ats_score', 0):.1f}%
- Skill Match: {scores.get('skill_match_score', 0):.1f}%
- Semantic Match: {scores.get('semantic_match_score', 0):.1f}%
- Project Relevance: {scores.get('project_relevance_score', 0):.1f}%
- Experience Depth: {scores.get('experience_depth_score', 0):.1f}%
- Interview Readiness: {scores.get('interview_readiness_score', 0):.1f}%

MATCHED SKILLS: {', '.join(matched_skills[:12]) if matched_skills else 'None'}
MISSING SKILLS: {', '.join(missing_skills[:10]) if missing_skills else 'None'}

Return ONLY this JSON (no markdown, no extra text):
{{
  "improved_bullets": [
    {{"original": "weak bullet text", "improved": "strong quantified bullet", "why": "reason for improvement"}},
    {{"original": "...", "improved": "...", "why": "..."}}
  ],
  "missing_skills_explanation": "2-3 sentences explaining why the missing skills matter for this role",
  "company_fit_explanation": "2-3 sentences on how well this profile fits {company_name or 'the target company'} culture and expectations",
  "interview_questions": [
    {{"question": "...", "category": "Technical", "difficulty": "Medium", "answer_hint": "..."}},
    {{"question": "...", "category": "Behavioral", "difficulty": "Easy", "answer_hint": "..."}},
    {{"question": "...", "category": "System Design", "difficulty": "Hard", "answer_hint": "..."}},
    {{"question": "...", "category": "Company-Specific", "difficulty": "Medium", "answer_hint": "..."}}
  ],
  "project_suggestions": [
    {{"title": "...", "tech_stack": ["tech1", "tech2"], "description": "...", "resume_bullet": "...", "difficulty": "Intermediate"}},
    {{"title": "...", "tech_stack": ["tech1", "tech2"], "description": "...", "resume_bullet": "...", "difficulty": "Advanced"}}
  ],
  "learning_roadmap": [
    {{"skill": "...", "resource": "...", "time_estimate": "2 weeks", "priority": "high"}},
    {{"skill": "...", "resource": "...", "time_estimate": "1 month", "priority": "medium"}}
  ],
  "recruiter_summary": "3-sentence professional summary of this candidate for a recruiter reviewing this role",
  "role_alignment_summary": "2-sentence assessment of overall alignment with this specific role and company"
}}"""

# ─── Safe JSON parser ─────────────────────────────────────────────────────────

def _safe_parse(raw: str) -> Optional[dict]:
    try:
        raw = raw.strip()
        # Strip markdown fences if present
        if raw.startswith("```"):
            raw = raw.split("```")[1]
            if raw.startswith("json"):
                raw = raw[4:]
        return json.loads(raw.strip())
    except Exception as e:
        logger.warning(f"AI response JSON parse failed: {e}")
        return None

# ─── OpenAI provider ──────────────────────────────────────────────────────────

def _call_openai(user_prompt: str) -> Optional[dict]:
    try:
        from openai import OpenAI
        import httpx

        client = OpenAI(
            api_key=settings.OPENAI_API_KEY,
            timeout=settings.AI_REQUEST_TIMEOUT_SECONDS,
        )
        response = client.chat.completions.create(
            model=settings.OPENAI_MODEL,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_prompt},
            ],
            max_tokens=settings.AI_MAX_OUTPUT_TOKENS,
            temperature=0.3,
            response_format={"type": "json_object"},
        )
        raw = response.choices[0].message.content
        return _safe_parse(raw)
    except Exception as e:
        logger.warning(f"OpenAI call failed ({type(e).__name__}): {e}")
        return None

# ─── Gemini provider ──────────────────────────────────────────────────────────

def _call_gemini(user_prompt: str) -> Optional[dict]:
    try:
        import google.generativeai as genai

        genai.configure(api_key=settings.GEMINI_API_KEY)
        model = genai.GenerativeModel(
            model_name=settings.GEMINI_MODEL,
            system_instruction=SYSTEM_PROMPT,
        )
        full_prompt = f"{user_prompt}\n\nRemember: respond with valid JSON only."
        response = model.generate_content(
            full_prompt,
            generation_config=genai.types.GenerationConfig(
                max_output_tokens=settings.AI_MAX_OUTPUT_TOKENS,
                temperature=0.3,
            ),
            request_options={"timeout": settings.AI_REQUEST_TIMEOUT_SECONDS},
        )
        raw = response.text
        return _safe_parse(raw)
    except Exception as e:
        logger.warning(f"Gemini call failed ({type(e).__name__}): {e}")
        return None

# ─── Mock provider ────────────────────────────────────────────────────────────

def _call_mock(scores: dict, matched_skills: list, missing_skills: list, company_name: str) -> dict:
    from app.utils.mock_data import get_interview_questions, get_project_suggestions
    iq = get_interview_questions(company_name, None, missing_skills)
    ps = get_project_suggestions(missing_skills, company_name)

    return {
        "improved_bullets": [
            {"original": "Worked on machine learning model", "improved": f"Designed and deployed BERT-based classification model achieving 91% accuracy, serving 10K+ daily requests via FastAPI with <100ms p95 latency", "why": "Added specific metrics, scale, and performance data"},
            {"original": "Familiar with Docker", "improved": "Containerized 5-service microarchitecture using Docker Compose; reduced deployment time by 70% and enabled zero-downtime blue-green deployments", "why": "Replaced vague 'familiar with' with concrete achievement"},
            {"original": "Improved team efficiency", "improved": "Automated 3 manual data pipelines using Airflow DAGs, freeing 8 engineer-hours/week and reducing error rate from 12% to 0.3%", "why": "Quantified before/after and business impact"},
        ],
        "missing_skills_explanation": f"The missing skills ({', '.join(missing_skills[:3]) if missing_skills else 'none identified'}) are core requirements for this role. Acquiring them through hands-on projects will significantly improve your fit score and interview performance.",
        "company_fit_explanation": f"Your profile shows moderate alignment with {company_name or 'the target company'}. Strengthening your project portfolio with production-deployed systems and quantified outcomes will make your application significantly more competitive.",
        "interview_questions": [{"question": q["question"], "category": q["category"], "difficulty": q["difficulty"], "answer_hint": q.get("answer_hint", "")} for q in iq[:5]],
        "project_suggestions": [{"title": p["title"], "tech_stack": p.get("tech_stack", []), "description": p["description"], "resume_bullet": p.get("resume_bullet", ""), "difficulty": p["difficulty"]} for p in ps[:3]],
        "learning_roadmap": [
            {"skill": missing_skills[0] if missing_skills else "System Design", "resource": "Build a hands-on project using this technology", "time_estimate": "3-4 weeks", "priority": "high"},
            {"skill": missing_skills[1] if len(missing_skills) > 1 else "Cloud Deployment", "resource": "AWS/GCP free tier + official documentation", "time_estimate": "2-3 weeks", "priority": "medium"},
        ],
        "recruiter_summary": f"Candidate demonstrates {scores.get('final_fit_score', 0):.0f}% alignment with the target role. Strong foundational skills in {', '.join(matched_skills[:3]) if matched_skills else 'core technologies'}. Key development areas include {', '.join(missing_skills[:2]) if missing_skills else 'production deployment experience'}.",
        "role_alignment_summary": f"Overall fit score of {scores.get('final_fit_score', 0):.0f}% indicates moderate-to-strong alignment. Focus on closing identified skill gaps and quantifying existing achievements to reach competitive threshold."
    }

# ─── Main public function ─────────────────────────────────────────────────────

def enrich_analysis(
    resume_text: str,
    job_text: str,
    company_name: str,
    role_title: str,
    scores: dict,
    matched_skills: list,
    missing_skills: list,
) -> dict:
    """
    Enrich numeric analysis results with AI-generated text content.
    Provider priority: openai → gemini → mock (with automatic fallback).
    Results are cached in Redis to avoid redundant API calls.
    """
    provider = settings.AI_PROVIDER.lower()
    mock_mode = settings.MOCK_AI_MODE

    # Determine active provider and model for cache key
    if mock_mode or provider == "mock":
        active_provider, active_model = "mock", "mock"
    elif provider == "openai" and settings.OPENAI_API_KEY:
        active_provider, active_model = "openai", settings.OPENAI_MODEL
    elif provider == "gemini" and settings.GEMINI_API_KEY:
        active_provider, active_model = "gemini", settings.GEMINI_MODEL
    else:
        active_provider, active_model = "mock", "mock"

    # Check Redis cache first
    cache_key = _make_cache_key(resume_text, job_text or "", company_name or "", active_provider, active_model)
    cached = cache_get(cache_key)
    if cached:
        logger.info(f"AI enrichment cache hit ({active_provider})")
        return cached

    # Call provider
    result = None

    if active_provider == "openai":
        logger.info(f"Calling OpenAI ({settings.OPENAI_MODEL})")
        user_prompt = _build_user_prompt(resume_text, job_text or "", company_name or "", role_title or "", scores, matched_skills, missing_skills)
        result = _call_openai(user_prompt)
        if result is None:
            logger.warning("OpenAI failed — falling back to Mock AI")

    elif active_provider == "gemini":
        logger.info(f"Calling Gemini ({settings.GEMINI_MODEL})")
        user_prompt = _build_user_prompt(resume_text, job_text or "", company_name or "", role_title or "", scores, matched_skills, missing_skills)
        result = _call_gemini(user_prompt)
        if result is None:
            logger.warning("Gemini failed — falling back to Mock AI")

    # Final fallback: mock
    if result is None:
        logger.info("Using Mock AI provider")
        result = _call_mock(scores, matched_skills, missing_skills, company_name or "")

    # Cache result
    ttl = settings.AI_CACHE_TTL_SECONDS
    cache_set(cache_key, result, ttl=ttl)
    logger.info(f"AI enrichment cached for {ttl}s")

    return result
