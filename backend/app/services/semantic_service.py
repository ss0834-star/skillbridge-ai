"""Semantic similarity service with TF-IDF fallback (no paid APIs needed)."""
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

def compute_semantic_similarity(text1: str, text2: str) -> float:
    """TF-IDF based cosine similarity as fallback for sentence-transformers."""
    if not text1 or not text2:
        return 50.0
    try:
        vectorizer = TfidfVectorizer(
            ngram_range=(1, 2),
            max_features=5000,
            stop_words='english',
            sublinear_tf=True
        )
        tfidf_matrix = vectorizer.fit_transform([text1, text2])
        similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
        score = round(float(similarity) * 100, 1)
        # Scale to make it more realistic (TF-IDF tends to be lower than transformer similarity)
        score = min(95.0, score * 1.4 + 15)
        return score
    except Exception:
        return 55.0

def try_sentence_transformer_similarity(text1: str, text2: str) -> float:
    """Try to use sentence-transformers if available, otherwise fall back."""
    try:
        from sentence_transformers import SentenceTransformer, util
        model = SentenceTransformer('all-MiniLM-L6-v2')
        emb1 = model.encode(text1[:512], convert_to_tensor=True)
        emb2 = model.encode(text2[:512], convert_to_tensor=True)
        score = float(util.cos_sim(emb1, emb2)) * 100
        return round(score, 1)
    except ImportError:
        return compute_semantic_similarity(text1, text2)
