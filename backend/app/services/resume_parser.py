import io
import re
from typing import Optional

def parse_resume_text(file_content: bytes, filename: str) -> str:
    """Extract text from resume file."""
    filename_lower = filename.lower()
    
    if filename_lower.endswith('.pdf'):
        return _parse_pdf(file_content)
    elif filename_lower.endswith('.docx'):
        return _parse_docx(file_content)
    elif filename_lower.endswith('.txt'):
        return file_content.decode('utf-8', errors='ignore')
    else:
        return file_content.decode('utf-8', errors='ignore')

def _parse_pdf(content: bytes) -> str:
    try:
        import PyPDF2
        reader = PyPDF2.PdfReader(io.BytesIO(content))
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"
        return text.strip()
    except Exception as e:
        return f"[PDF parsing error: {str(e)}]"

def _parse_docx(content: bytes) -> str:
    try:
        from docx import Document
        doc = Document(io.BytesIO(content))
        text = "\n".join([para.text for para in doc.paragraphs])
        return text.strip()
    except Exception as e:
        return f"[DOCX parsing error: {str(e)}]"
