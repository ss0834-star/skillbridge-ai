from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User, Resume, ActivityLog
from app.schemas import ResumeOut
from app.api.auth import auth_required
from app.services.resume_parser import parse_resume_text
from typing import List

router = APIRouter()

@router.post("/upload", response_model=ResumeOut)
async def upload_resume(file: UploadFile = File(...), db: Session = Depends(get_db), current_user: User = Depends(auth_required)):
    content = await file.read()
    extracted = parse_resume_text(content, file.filename)
    resume = Resume(user_id=current_user.id, filename=file.filename, extracted_text=extracted)
    db.add(resume)
    db.add(ActivityLog(user_id=current_user.id, action="resume_upload", log_data={"filename": file.filename}))
    db.commit()
    db.refresh(resume)
    return resume

@router.get("", response_model=List[ResumeOut])
def list_resumes(db: Session = Depends(get_db), current_user: User = Depends(auth_required)):
    return db.query(Resume).filter(Resume.user_id == current_user.id).order_by(Resume.created_at.desc()).all()

@router.get("/{resume_id}", response_model=ResumeOut)
def get_resume(resume_id: int, db: Session = Depends(get_db), current_user: User = Depends(auth_required)):
    resume = db.query(Resume).filter(Resume.id == resume_id, Resume.user_id == current_user.id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    return resume
