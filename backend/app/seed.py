"""Seed the database with demo data."""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import engine, SessionLocal
from app.models import Base, User, Resume, JobDescription, CompanyTemplate, AnalysisResult, InterviewQuestion, ProjectSuggestion, ActivityLog
from app.api.auth import hash_password
from app.utils.mock_data import COMPANY_TEMPLATES, DEMO_RESUMES, SAMPLE_JOB_DESCRIPTIONS, get_interview_questions, get_project_suggestions
from app.api.analysis import run_scoring as run_analysis
from datetime import datetime, timedelta
import random

def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    try:
        # Clear existing data
        db.query(ProjectSuggestion).delete()
        db.query(InterviewQuestion).delete()
        db.query(AnalysisResult).delete()
        db.query(JobDescription).delete()
        db.query(Resume).delete()
        db.query(ActivityLog).delete()
        db.query(CompanyTemplate).delete()
        db.query(User).delete()
        db.commit()
        
        print("🌱 Seeding users...")
        admin = User(name="Admin User", email="admin@skillbridge.ai", password_hash=hash_password("admin123"), role="admin", is_demo=False)
        demo1 = User(name="Alex Chen", email="demo@skillbridge.ai", password_hash=hash_password("demo123"), role="user", is_demo=True)
        demo2 = User(name="Priya Patel", email="priya@skillbridge.ai", password_hash=hash_password("demo123"), role="user", is_demo=False)
        demo3 = User(name="Jordan Kim", email="jordan@skillbridge.ai", password_hash=hash_password("demo123"), role="user", is_demo=False)
        
        for u in [admin, demo1, demo2, demo3]:
            db.add(u)
        db.commit()
        
        print("🌱 Seeding company templates...")
        for company_name, data in COMPANY_TEMPLATES.items():
            ct = CompanyTemplate(company_name=company_name, **data)
            db.add(ct)
        db.commit()
        
        print("🌱 Seeding resumes...")
        r1 = Resume(user_id=demo1.id, filename="alex_chen_resume.pdf", extracted_text=DEMO_RESUMES["aiml_student"])
        r2 = Resume(user_id=demo2.id, filename="priya_patel_resume.pdf", extracted_text=DEMO_RESUMES["robotics_student"])
        r3 = Resume(user_id=demo3.id, filename="jordan_kim_resume.pdf", extracted_text=DEMO_RESUMES["fullstack_student"])
        for r in [r1, r2, r3]:
            db.add(r)
        db.commit()
        
        print("🌱 Seeding job descriptions...")
        jd_data = [
            (demo1.id, "NVIDIA", "AI Research Engineer", SAMPLE_JOB_DESCRIPTIONS["NVIDIA AI Engineer"]),
            (demo1.id, "OpenAI", "Applied AI Engineer", "We are looking for engineers who can build production AI systems..."),
            (demo2.id, "Tesla", "Robotics Engineer", SAMPLE_JOB_DESCRIPTIONS["Tesla Robotics Engineer"]),
            (demo3.id, "Google", "Software Engineer", "Strong CS fundamentals, distributed systems experience..."),
            (demo3.id, "Microsoft", "Full Stack Engineer", "Build enterprise software with Azure and React..."),
        ]
        jds = []
        for uid, company, role, desc in jd_data:
            jd = JobDescription(user_id=uid, company_name=company, role_title=role, description=desc)
            db.add(jd)
            jds.append(jd)
        db.commit()
        
        print("🌱 Seeding analyses...")
        analyses_data = [
            (demo1.id, r1.id, jds[0].id, "NVIDIA", "AI Research Engineer", DEMO_RESUMES["aiml_student"], SAMPLE_JOB_DESCRIPTIONS["NVIDIA AI Engineer"]),
            (demo1.id, r1.id, jds[1].id, "OpenAI", "Applied AI Engineer", DEMO_RESUMES["aiml_student"], "We are looking for engineers who can build production AI systems..."),
            (demo2.id, r2.id, jds[2].id, "Tesla", "Robotics Engineer", DEMO_RESUMES["robotics_student"], SAMPLE_JOB_DESCRIPTIONS["Tesla Robotics Engineer"]),
            (demo3.id, r3.id, jds[3].id, "Google", "Software Engineer", DEMO_RESUMES["fullstack_student"], "Strong CS fundamentals, distributed systems experience..."),
        ]
        
        created_analyses = []
        for i, (uid, rid, jdid, company, role, resume_txt, job_txt) in enumerate(analyses_data):
            result = run_analysis(resume_txt, job_txt, company)
            days_ago = random.randint(1, 14)
            a = AnalysisResult(
                user_id=uid, resume_id=rid, job_description_id=jdid,
                company_name=company, role_title=role,
                **result
            )
            db.add(a)
            db.flush()
            
            for q in get_interview_questions(company, role, result["missing_skills"]):
                db.add(InterviewQuestion(user_id=uid, analysis_id=a.id, **q))
            
            for p in get_project_suggestions(result["missing_skills"], company):
                db.add(ProjectSuggestion(user_id=uid, analysis_id=a.id, **p))
            
            db.add(ActivityLog(user_id=uid, action="analysis_run", metadata={"company": company, "score": result["final_fit_score"]}))
            created_analyses.append(a)
        
        db.commit()
        
        print("\n✅ Seed complete!")
        print("=" * 50)
        print("Demo Credentials:")
        print("  Admin:  admin@skillbridge.ai / admin123")
        print("  Demo 1: demo@skillbridge.ai / demo123  (AI/ML student)")
        print("  Demo 2: priya@skillbridge.ai / demo123 (Robotics student)")
        print("  Demo 3: jordan@skillbridge.ai / demo123 (Full-stack student)")
        print("=" * 50)
        
    except Exception as e:
        db.rollback()
        print(f"❌ Seed failed: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    seed()
