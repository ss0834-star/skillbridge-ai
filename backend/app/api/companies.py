from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import CompanyTemplate
from app.schemas import CompanyTemplateOut
from app.api.auth import auth_required
from app.services.cache_service import cache_get, cache_set
from app.models import User
from typing import List

router = APIRouter()

@router.get("", response_model=List[CompanyTemplateOut])
def list_companies(db: Session = Depends(get_db)):
    cached = cache_get("companies:all")
    if cached:
        return cached
    companies = db.query(CompanyTemplate).all()
    result = [CompanyTemplateOut.model_validate(c).model_dump() for c in companies]
    cache_set("companies:all", result, ttl=3600)
    return companies

@router.get("/{company_name}", response_model=CompanyTemplateOut)
def get_company(company_name: str, db: Session = Depends(get_db)):
    company = db.query(CompanyTemplate).filter(CompanyTemplate.company_name == company_name).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    return company
