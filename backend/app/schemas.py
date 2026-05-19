from pydantic import BaseModel, EmailStr
from typing import Optional, List, Any, Dict
from datetime import datetime

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: int
    name: str
    email: str
    role: str
    created_at: datetime
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserOut

class ResumeOut(BaseModel):
    id: int
    filename: str
    extracted_text: Optional[str]
    created_at: datetime
    class Config:
        from_attributes = True

class JobDescriptionCreate(BaseModel):
    company_name: Optional[str]
    role_title: Optional[str]
    description: str

class JobDescriptionOut(BaseModel):
    id: int
    company_name: Optional[str]
    role_title: Optional[str]
    description: str
    created_at: datetime
    class Config:
        from_attributes = True

class AnalysisRequest(BaseModel):
    resume_id: Optional[int] = None
    job_description_id: Optional[int] = None
    resume_text: Optional[str] = None
    job_description_text: Optional[str] = None
    company_name: Optional[str] = None
    role_title: Optional[str] = None

class AnalysisResultOut(BaseModel):
    id: int
    company_name: Optional[str]
    role_title: Optional[str]
    final_fit_score: Optional[float]
    ats_score: Optional[float]
    skill_match_score: Optional[float]
    semantic_match_score: Optional[float]
    project_relevance_score: Optional[float]
    experience_depth_score: Optional[float]
    interview_readiness_score: Optional[float]
    matched_skills: Optional[List[str]]
    missing_skills: Optional[List[str]]
    improved_bullets: Optional[List[Dict]]
    summary: Optional[str]
    recommendations: Optional[List[Dict]]
    created_at: datetime
    class Config:
        from_attributes = True

class InterviewQuestionOut(BaseModel):
    id: int
    question: str
    category: str
    difficulty: str
    answer_hint: Optional[str]
    class Config:
        from_attributes = True

class ProjectSuggestionOut(BaseModel):
    id: int
    title: str
    tech_stack: Optional[List[str]]
    description: str
    resume_bullet: Optional[str]
    difficulty: str
    class Config:
        from_attributes = True

class CompanyTemplateOut(BaseModel):
    id: int
    company_name: str
    role_family: str
    required_skills: List[str]
    preferred_skills: List[str]
    project_expectations: List[str]
    interview_focus: List[str]
    logo_color: Optional[str]
    industry: Optional[str]
    class Config:
        from_attributes = True

class DashboardSummary(BaseModel):
    total_analyses: int
    avg_fit_score: float
    top_company: Optional[str]
    missing_skills_count: int
    recent_analyses: List[AnalysisResultOut]
    score_trend: List[Dict]

class AdminMetrics(BaseModel):
    total_users: int
    total_analyses: int
    avg_fit_score: float
    top_companies: List[Dict]
    common_missing_skills: List[Dict]
    recent_activity: List[Dict]
