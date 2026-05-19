"""Celery background tasks for heavy AI processing."""
from app.services.worker import celery_app
import logging

logger = logging.getLogger(__name__)

@celery_app.task(bind=True, max_retries=2, default_retry_delay=5)
def run_ai_analysis(self, resume_text: str, job_text: str, company_name: str,
                     role_title: str, scores: dict, matched_skills: list, missing_skills: list):
    """Run AI enrichment as a background task."""
    try:
        from app.services.ai_service import enrich_analysis
        result = enrich_analysis(
            resume_text=resume_text,
            job_text=job_text,
            company_name=company_name,
            role_title=role_title,
            scores=scores,
            matched_skills=matched_skills,
            missing_skills=missing_skills,
        )
        return result
    except Exception as exc:
        logger.error(f"AI analysis task failed: {exc}")
        raise self.retry(exc=exc)
