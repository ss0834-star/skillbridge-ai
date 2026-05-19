"""
Celery worker for background AI analysis tasks.
Offloads heavy AI processing from the main API thread.
"""
from celery import Celery
from app.config import settings

celery_app = Celery(
    "skillbridge",
    broker=settings.REDIS_URL,
    backend=settings.REDIS_URL,
    include=["app.services.tasks"]
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    task_track_started=True,
    task_acks_late=True,
    worker_prefetch_multiplier=1,
    task_routes={
        "app.services.tasks.run_ai_analysis": {"queue": "ai_analysis"},
        "app.services.tasks.run_quick_task": {"queue": "quick"},
    },
    task_time_limit=120,
    task_soft_time_limit=90,
)
