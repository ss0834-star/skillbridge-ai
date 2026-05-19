import re

def clean_text(text: str) -> str:
    if not text:
        return ""
    text = re.sub(r'\s+', ' ', text)
    text = re.sub(r'[^\w\s\.\,\-\+\#\/\(\)\@]', ' ', text)
    return text.strip()

def extract_sections(text: str) -> dict:
    sections = {}
    section_headers = {
        "education": r'(?i)education|academic',
        "experience": r'(?i)experience|work history|employment',
        "skills": r'(?i)skills|technologies|tech stack',
        "projects": r'(?i)projects|portfolio',
        "publications": r'(?i)publications|papers|research',
        "awards": r'(?i)awards|achievements|honors'
    }
    text_lower = text.lower()
    for section, pattern in section_headers.items():
        if re.search(pattern, text_lower):
            sections[section] = True
    return sections

def has_quantified_bullets(text: str) -> float:
    """Check what fraction of bullets have numbers/metrics."""
    lines = text.split('\n')
    bullet_lines = [l for l in lines if re.match(r'^\s*[-•*]', l)]
    if not bullet_lines:
        return 0.0
    quantified = sum(1 for l in bullet_lines if re.search(r'\d+', l))
    return quantified / len(bullet_lines)
