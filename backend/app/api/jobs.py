from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User, JobDescription
from app.schemas import JobDescriptionCreate, JobDescriptionOut
from app.api.auth import auth_required
from typing import List

router = APIRouter()

@router.post("", response_model=JobDescriptionOut)
def create_job(data: JobDescriptionCreate, db: Session = Depends(get_db), current_user: User = Depends(auth_required)):
    job = JobDescription(user_id=current_user.id, **data.model_dump())
    db.add(job)
    db.commit()
    db.refresh(job)
    return job

@router.get("", response_model=List[JobDescriptionOut])
def list_jobs(db: Session = Depends(get_db), current_user: User = Depends(auth_required)):
    return db.query(JobDescription).filter(JobDescription.user_id == current_user.id).order_by(JobDescription.created_at.desc()).all()

@router.get("/{job_id}", response_model=JobDescriptionOut)
def get_job(job_id: int, db: Session = Depends(get_db), current_user: User = Depends(auth_required)):
    job = db.query(JobDescription).filter(JobDescription.id == job_id, JobDescription.user_id == current_user.id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job description not found")
    return job
