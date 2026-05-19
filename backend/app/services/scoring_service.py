"""
SkillBridge AI — Production Scoring Service
Recruiter-realistic scoring with critical skill penalties.

Scoring Formula:
  35% critical skill match
  25% required skill match  
  15% semantic match (capped by critical gaps)
  10% project relevance
  10% experience depth
   5% ATS formatting

Example outcomes:
  A) Python + PyTorch only → Tesla Robotics → 25-40 (missing ROS2, C++, robotics)
  B) ROS2, C++, Python, OpenCV, Gazebo → Tesla Robotics → 75-90
  C) Web dev only → NVIDIA AI Engineer → 20-35
"""
import re
from typing import List, Tuple, Dict

# ── Master skill list ─────────────────────────────────────────────────────────
SKILLS_MASTER = [
    "python", "c++", "java", "go", "rust", "javascript", "typescript", "scala",
    "pytorch", "tensorflow", "keras", "jax", "scikit-learn", "xgboost",
    "cuda", "triton", "tensorrt", "onnx", "coreml", "tflite", "gpu programming",
    "ros", "ros2", "gazebo", "moveit", "nav2", "slam", "opencv", "pcl",
    "control systems", "robotics", "simulation", "real-time systems",
    "computer vision", "motion planning", "sensor fusion", "embedded systems",
    "transformer", "bert", "gpt", "llm", "llama", "rlhf", "lora", "qlora", "peft",
    "langchain", "rag", "vector database", "faiss", "pinecone", "prompt engineering",
    "deep learning", "model optimization", "distributed training", "inference",
    "docker", "kubernetes", "aws", "gcp", "azure", "terraform", "ci/cd",
    "postgresql", "mysql", "mongodb", "redis", "elasticsearch",
    "react", "next.js", "tailwind", "graphql", "rest api",
    "fastapi", "django", "flask", "node.js",
    "spark", "kafka", "airflow", "dbt", "data pipelines",
    "mlflow", "wandb", "mlops", "sagemaker", "vertex ai",
    "git", "linux", "bash", "jupyter", "numpy", "pandas",
    "machine learning", "deployment", "experimentation", "a/b testing",
    "generative ai", "diffusion models", "multimodal",
]

# ── Critical skills per company ───────────────────────────────────────────────
COMPANY_CRITICAL_SKILLS = {
    "Tesla": ["c++", "ros", "ros2", "robotics", "computer vision",
              "real-time systems", "simulation", "control systems", "opencv"],
    "NVIDIA": ["cuda", "pytorch", "deep learning", "model optimization",
               "python", "gpu programming", "distributed training", "inference", "tensorrt"],
    "Google": ["python", "distributed systems", "machine learning", "system design",
               "data structures", "algorithms", "kubernetes"],
    "Microsoft": ["python", "azure", "machine learning", "system design",
                  "rest api", "kubernetes"],
    "Amazon": ["python", "machine learning", "data pipelines", "aws",
               "experimentation", "deployment", "spark"],
    "Apple": ["python", "coreml", "model optimization", "computer vision",
              "on-device ml", "swift"],
    "Meta": ["python", "pytorch", "llm", "deep learning", "distributed training",
             "rlhf", "transformer"],
    "OpenAI": ["python", "llm", "rag", "prompt engineering", "pytorch",
               "model optimization", "deployment", "generative ai"],
}

# Fallback critical skills for unknown companies
DEFAULT_CRITICAL = ["python", "machine learning", "deployment", "data structures"]


def extract_skills(text: str) -> List[str]:
    text_lower = text.lower()
    found = []
    for skill in SKILLS_MASTER:
        pattern = r'\b' + re.escape(skill.lower()) + r'\b'
        if re.search(pattern, text_lower):
            found.append(skill.lower())
    return list(set(found))


def compute_critical_skill_match(
    resume_skills: List[str],
    company_name: str = None,
    job_skills: List[str] = None
) -> Dict:
    """Compute critical skill match and penalty."""
    critical_skills = COMPANY_CRITICAL_SKILLS.get(company_name, DEFAULT_CRITICAL)
    if not critical_skills:
        critical_skills = DEFAULT_CRITICAL

    resume_set = set(s.lower() for s in resume_skills)
    critical_matched = [s for s in critical_skills if s in resume_set]
    critical_missing = [s for s in critical_skills if s not in resume_set]

    total_critical = len(critical_skills)
    matched_count = len(critical_matched)
    missing_count = len(critical_missing)

    if total_critical == 0:
        critical_score = 50.0
        missing_ratio = 0.0
    else:
        critical_score = round((matched_count / total_critical) * 100, 1)
        missing_ratio = missing_count / total_critical

    # Determine score cap and penalty reason
    score_cap = 100
    penalty_reason = None
    caps_applied = []

    if matched_count == 0:
        score_cap = 30
        penalty_reason = "Zero critical skills matched. Resume is not aligned with this role's core requirements."
        caps_applied.append("Zero critical match → cap 30")
    elif missing_ratio >= 0.60:
        score_cap = 40
        penalty_reason = f"Missing {missing_count}/{total_critical} critical skills. Resume lacks most core requirements for this role."
        caps_applied.append(f"Critical missing ratio {missing_ratio:.0%} → cap 40")
    elif missing_ratio >= 0.40:
        score_cap = 55
        penalty_reason = f"Missing {missing_count}/{total_critical} critical skills. Significant gaps in core role requirements."
        caps_applied.append(f"Critical missing ratio {missing_ratio:.0%} → cap 55")
    elif missing_ratio >= 0.25:
        score_cap = 70
        penalty_reason = f"Missing {missing_count}/{total_critical} critical skills. Some important gaps exist."
        caps_applied.append(f"Critical missing ratio {missing_ratio:.0%} → cap 70")

    return {
        "critical_score": critical_score,
        "critical_matched": critical_matched,
        "critical_missing": critical_missing,
        "score_cap": score_cap,
        "penalty_reason": penalty_reason,
        "caps_applied": caps_applied,
        "missing_ratio": missing_ratio,
    }


def compute_skill_match(
    resume_skills: List[str],
    job_skills: List[str]
) -> Tuple[float, List[str], List[str]]:
    """Required skill match (non-critical)."""
    if not job_skills:
        return 50.0, resume_skills[:6], []
    resume_set = set(s.lower() for s in resume_skills)
    job_set = set(s.lower() for s in job_skills)
    matched = list(resume_set & job_set)
    missing = list(job_set - resume_set)
    score = min(100, round(len(matched) / len(job_set) * 100, 1))
    return score, matched, missing


def compute_ats_score(resume_text: str, resume_skills: List[str]) -> float:
    score = 0
    text_lower = resume_text.lower()
    sections = ["education", "experience", "skills", "projects"]
    section_score = sum(20 for s in sections if s in text_lower)
    score += min(40, section_score)
    lines = resume_text.split('\n')
    bullets = [l for l in lines if re.match(r'^\s*[-•*]', l)]
    if len(bullets) >= 8:
        score += 20
    elif len(bullets) >= 4:
        score += 10
    quantified = sum(1 for l in bullets if re.search(r'\d+', l))
    if bullets:
        score += min(20, int(quantified / len(bullets) * 40))
    score += min(20, len(resume_skills) * 2)
    return min(100.0, float(score))


def compute_experience_depth(resume_text: str) -> float:
    text_lower = resume_text.lower()
    score = 40.0
    positive = ["deployed", "production", "led", "architected", "designed",
                "improved", "optimized", "reduced", "increased", "built",
                "implemented", "developed", "published", "open-source"]
    negative = ["familiar with", "exposure to", "basic knowledge",
                "learning", "interested in", "some experience"]
    score += sum(3 for s in positive if s in text_lower)
    score -= sum(6 for s in negative if s in text_lower)
    metrics = re.findall(
        r'\d+[%xX]|\$\d+|\d+[KMB]|\d+\s*(?:times|x\s*faster|%\s*(?:faster|improved|reduced))',
        resume_text, re.IGNORECASE
    )
    score += len(metrics) * 4
    return min(100.0, max(15.0, score))


def compute_project_relevance(resume_text: str, company_name: str = None) -> float:
    from app.utils.mock_data import COMPANY_TEMPLATES
    text_lower = resume_text.lower()
    if company_name and company_name in COMPANY_TEMPLATES:
        template = COMPANY_TEMPLATES[company_name]
        req_skills = [s.lower() for s in template["required_skills"]]
        matches = sum(1 for s in req_skills if s in text_lower)
        base = min(100, 30 + matches * 7)
    else:
        project_keywords = ["deployed", "api", "model", "system",
                            "pipeline", "service", "application", "production"]
        matches = sum(1 for kw in project_keywords if kw in text_lower)
        base = min(100, 30 + matches * 6)
    return float(base)


def compute_semantic_similarity_capped(
    raw_semantic: float,
    skill_match_score: float,
    missing_ratio: float,
    resume_text: str
) -> float:
    """Apply caps to semantic score to prevent inflating weak resumes."""
    score = raw_semantic

    # Cap 1: Low skill match → semantic can't save it
    if skill_match_score < 30:
        score = min(score, 45)

    # Cap 2: High critical missing ratio
    if missing_ratio >= 0.50:
        score = min(score, 40)

    # Cap 3: Short/thin resume
    word_count = len(resume_text.split())
    has_projects = "project" in resume_text.lower()
    has_experience = "experience" in resume_text.lower() or "intern" in resume_text.lower()
    if word_count < 150 or (not has_projects and not has_experience):
        score = min(score, 50)

    return round(score, 1)


def get_fit_label(score: float) -> str:
    if score <= 30:
        return "Poor Fit — missing core requirements"
    elif score <= 50:
        return "Weak Fit — major skill gaps"
    elif score <= 70:
        return "Partial Fit — some alignment but not competitive"
    elif score <= 85:
        return "Strong Fit — good match with minor gaps"
    else:
        return "Excellent Fit — highly aligned"


def get_recruiter_realism_note(score: float, caps_applied: list, company_name: str = None) -> str:
    company = company_name or "this role"
    if not caps_applied:
        if score >= 80:
            return f"Strong alignment with {company}. Resume demonstrates most core requirements and would likely pass initial screening."
        elif score >= 65:
            return f"Decent alignment with {company}. Resume covers several key requirements but has some gaps worth addressing."
        else:
            return f"Moderate alignment with {company}. Resume covers basics but lacks depth in several important areas."
    else:
        return (
            f"Score capped due to critical skill gaps for {company}. "
            f"This resume may pass basic keyword screening but would likely be deprioritized "
            f"by experienced recruiters who know the technical requirements for this role. "
            f"Caps applied: {'; '.join(caps_applied)}."
        )
