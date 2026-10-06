# SmartCampus – AI College Information Chatbot

A full-stack college information portal built with Flask, SQLite, SQLAlchemy, HTML/CSS/JavaScript, and scikit-learn. Students can ask questions in natural language, browse campus information, and revisit chat history. Administrators can manage the knowledge base and inspect student activity.

The seeded SmartCampus College is fictional demo data. Replace the sample details and credentials before using this project for a real institution.

## Run locally

Requirements: Python 3.10 or later and pip.

```powershell
python -m venv .venv
.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
$env:SECRET_KEY = "replace-with-a-long-random-value"
python app.py
```

Open <http://127.0.0.1:5000>. On the first run, the app creates `instance/smartcampus.db` and seeds the demo users, FAQs, courses, departments, faculty, fees, and announcements. The application uses a development-only fallback secret if `SECRET_KEY` is omitted; configure a private secret before deployment. Set `DATABASE_URL` to use a different SQLAlchemy-supported database URL. Set `PORT` to change the local port.

## Demo accounts

| Role | Email | Password |
| --- | --- | --- |
| Student | `student@smartcampus.edu` | `Student@123` |
| Administrator | `admin@smartcampus.edu` | `Admin@123` |

Registration creates student accounts only. Admin access is assigned to the seeded administrator and should not be exposed as a public registration option.

## Project structure

```text
app.py                 Flask application factory and JSON routes
models.py              SQLAlchemy schema and password helpers
chatbot.py             TF-IDF and cosine-similarity retrieval
seed.py                Demo categories and college data
static/index.html      Application entry point
static/css/styles.css Responsive visual system and layouts
static/js/app.js       Student/admin interface and API client
tests/test_chatbot.py  Retrieval, fallback, session, and history tests
```

## Database schema

| Table | Purpose | Main fields |
| --- | --- | --- |
| `student` | Student and administrator accounts | name, unique email, password hash, role, created time |
| `faq` | Searchable question/answer knowledge base | category, question, aliases, answer |
| `course` | Course catalog | name, degree, duration, seats, department, description |
| `department` | Department directory | name, code, head, building, description |
| `faculty` | Faculty directory | name, title, department, email, specialization |
| `fee` | Program fee schedule | program, academic year, tuition, other fees, notes |
| `announcement` | Campus notices | title, body, tag, published time |
| `chat_message` | Per-student question and answer history | student foreign key, question, answer, category, confidence, created time |

Relationships: one student has many chat messages. FAQ, course, department, faculty, fee, and announcement records are independently managed by an administrator. Chat questions reference the student's account and persist the matched category and similarity score.

## NLP flow

`POST /api/chat` loads the FAQ corpus from SQLite. The retrieval pipeline:

1. Lowercases text, removes punctuation, and normalizes whitespace while retaining alphanumeric terms.
2. Builds one search document per FAQ from its canonical question, admin-maintained aliases, and category.
3. Fits scikit-learn `TfidfVectorizer` over the FAQ documents plus the user query. It uses unigrams and bigrams, sublinear term frequency, and Unicode accent normalization.
4. Computes cosine similarity from the query vector to each FAQ vector and selects the highest-scoring entry.
5. Returns the stored answer when the best score is at least `0.16`; otherwise it returns the explicit fallback and does not claim a match.
6. Saves the question, answer, category, and score to that student's chat history.

This is retrieval-based NLP, not a generative LLM: answers come from the college knowledge base, are explainable, and can be corrected by editing FAQ wording or aliases. Adjust the threshold in `chatbot.py` after evaluating representative queries against your own FAQ corpus.

## Admin features

The administrator workspace includes totals and popular categories, recent questions, student accounts, all student questions (up to 1,000 per request), and create/edit/delete forms for FAQs, courses, departments, faculty, fees, and announcements. The public college guide and chatbot read from the same SQLite records.

## Tests

```powershell
python -m unittest discover -s tests -v
```

Tests cover all ten requested example questions, fallback behavior, login, chat submission, and per-student history. Run with `FLASK_DEBUG=1` only for local development; do not expose Flask's development server to production traffic.