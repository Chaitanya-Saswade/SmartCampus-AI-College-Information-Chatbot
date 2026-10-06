import re

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

FALLBACK = (
    "I couldn't find a reliable match in the college knowledge base. "
    "Try asking about admissions, courses, fees, exams, scholarships, placements, "
    "hostel, library, transport, facilities, events, or contact details."
)


def preprocess(text):
    """Normalize a query without discarding useful terms such as course codes."""
    return re.sub(r"[^a-z0-9]+", " ", text.lower()).strip()


def find_answer(question, faqs, threshold=0.16):
    """Rank FAQ question+aliases with word and character TF-IDF cosine similarity."""
    query = preprocess(question)
    if not query or not faqs:
        return {"answer": FALLBACK, "category": "General", "confidence": 0, "matched": None}

    documents = []
    for faq in faqs:
        aliases = faq.aliases or ""
        documents.append(preprocess(f"{faq.question} {aliases} {faq.category}"))

    vectorizer = TfidfVectorizer(ngram_range=(1, 2), sublinear_tf=True, strip_accents="unicode")
    matrix = vectorizer.fit_transform(documents + [query])
    scores = cosine_similarity(matrix[-1], matrix[:-1]).ravel()
    best_index = int(scores.argmax())
    confidence = float(scores[best_index])
    if confidence < threshold:
        return {"answer": FALLBACK, "category": "General", "confidence": confidence, "matched": None}

    faq = faqs[best_index]
    return {"answer": faq.answer, "category": faq.category,
            "confidence": confidence, "matched": faq.question}