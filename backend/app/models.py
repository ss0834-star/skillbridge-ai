from sqlalchemy import Column, Integer, String, Float, Text, DateTime, ForeignKey, JSON, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    email = Column(String(200), unique=True, index=True, nullable=False)
    password_hash = Column(String(500))
    role = Column(String(50), default="user")
    is_demo = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    resumes = relationship("Resume", back_populates="user", cascade="all, delete-orphan")
    job_descriptions = relationship("JobDescription", back_populates="user", cascade="all, delete-orphan")
    analysis_results = relationship("AnalysisResult", back_populates="user", cascade="all, delete-orphan")
    activity_logs = relationship("ActivityLog", back_populates="user", cascade="all, delete-orphan")

class Resume(Base):
    __tablename__ = "resumes"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    filename = Column(String(500), nullable=False)
    extracted_text = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    user = relationship("User", back_populates="resumes")
    analysis_results = relationship("AnalysisResult", back_populates="resume")

class JobDescription(Base):
    __tablename__ = "job_descriptions"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    company_name = Column(String(200))
    role_title = Column(String(200))
    description = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    user = relationship("User", back_populates="job_descriptions")
    analysis_results = relationship("AnalysisResult", back_populates="job_description")

class CompanyTemplate(Base):
    __tablename__ = "company_templates"
    id = Column(Integer, primary_key=True, index=True)
    company_name = Column(String(200), unique=True, index=True)
    role_family = Column(String(200))
    required_skills = Column(JSON)
    preferred_skills = Column(JSON)
    project_expectations = Column(JSON)
    interview_focus = Column(JSON)
    logo_color = Column(String(50))
    industry = Column(String(100))

class AnalysisResult(Base):
    __tablename__ = "analysis_results"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    resume_id = Column(Integer, ForeignKey("resumes.id"))
    job_description_id = Column(Integer, ForeignKey("job_descriptions.id"))
    company_name = Column(String(200))
    role_title = Column(String(200))
    final_fit_score = Column(Float)
    ats_score = Column(Float)
    skill_match_score = Column(Float)
    semantic_match_score = Column(Float)
    project_relevance_score = Column(Float)
    experience_depth_score = Column(Float)
    interview_readiness_score = Column(Float)
    matched_skills = Column(JSON)
    missing_skills = Column(JSON)
    improved_bullets = Column(JSON)
    summary = Column(Text)
    recommendations = Column(JSON)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    user = relationship("User", back_populates="analysis_results")
    resume = relationship("Resume", back_populates="analysis_results")
    job_description = relationship("JobDescription", back_populates="analysis_results")
    interview_questions = relationship("InterviewQuestion", back_populates="analysis", cascade="all, delete-orphan")
    project_suggestions = relationship("ProjectSuggestion", back_populates="analysis", cascade="all, delete-orphan")

class InterviewQuestion(Base):
    __tablename__ = "interview_questions"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    analysis_id = Column(Integer, ForeignKey("analysis_results.id"))
    question = Column(Text)
    category = Column(String(100))
    difficulty = Column(String(50))
    answer_hint = Column(Text)
    analysis = relationship("AnalysisResult", back_populates="interview_questions")

class ProjectSuggestion(Base):
    __tablename__ = "project_suggestions"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    analysis_id = Column(Integer, ForeignKey("analysis_results.id"))
    title = Column(String(300))
    tech_stack = Column(JSON)
    description = Column(Text)
    resume_bullet = Column(Text)
    difficulty = Column(String(50))
    analysis = relationship("AnalysisResult", back_populates="project_suggestions")

class ActivityLog(Base):
    __tablename__ = "activity_logs"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    action = Column(String(200))
    log_data = Column(JSON)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    user = relationship("User", back_populates="activity_logs")
