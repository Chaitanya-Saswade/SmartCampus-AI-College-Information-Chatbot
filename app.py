import os
from functools import wraps

from flask import Flask, jsonify, request, session

from chatbot import find_answer
from models import (Announcement, ChatMessage, Course, Department, FAQ, Faculty,
                    Fee, Student, db)
from seed import CATEGORIES, seed_database

COLLECTIONS = {
    "faqs": (FAQ, ("category", "question", "aliases", "answer")),
    "courses": (Course, ("name", "degree", "duration", "seats", "department", "description")),
    "departments": (Department, ("name", "code", "head", "building", "description")),
    "faculty": (Faculty, ("name", "title", "department", "email", "specialization")),
    "fees": (Fee, ("program", "academic_year", "tuition", "other_fees", "notes")),
    "announcements": (Announcement, ("title", "body", "tag")),
}


def create_app(test_config=None):
    app = Flask(__name__, static_folder="static", template_folder="templates")
    app.config.update(
        SECRET_KEY=os.environ.get("SECRET_KEY", "dev-only-change-this-secret"),
        SQLALCHEMY_DATABASE_URI=os.environ.get("DATABASE_URL", "sqlite:///smartcampus.db"),
        SQLALCHEMY_TRACK_MODIFICATIONS=False,
        SESSION_COOKIE_HTTPONLY=True,
        SESSION_COOKIE_SAMESITE="Lax",
    )
    if test_config:
        app.config.update(test_config)
    db.init_app(app)

    @app.get("/")
    def index():
        return app.send_static_file("index.html")

    def current_user():
        user_id = session.get("user_id")
        return db.session.get(Student, user_id) if user_id else None

    def login_required(admin=False):
        def decorator(view):
            @wraps(view)
            def wrapped(*args, **kwargs):
                user = current_user()
                if not user:
                    return jsonify(error="Please sign in to continue."), 401
                if admin and user.role != "admin":
                    return jsonify(error="Administrator access is required."), 403
                return view(*args, **kwargs)
            return wrapped
        return decorator

    def payload():
        return request.get_json(silent=True) or {}

    @app.post("/api/auth/register")
    def register():
        data = payload()
        name = str(data.get("name", "")).strip()
        email = str(data.get("email", "")).strip().lower()
        password = str(data.get("password", ""))
        if len(name) < 2 or "@" not in email or len(password) < 8:
            return jsonify(error="Enter your name, a valid email, and a password of at least 8 characters."), 400
        if Student.query.filter_by(email=email).first():
            return jsonify(error="An account with that email already exists."), 409
        user = Student(name=name, email=email, role="student")
        user.set_password(password)
        db.session.add(user)
        db.session.commit()
        session.clear()
        session["user_id"] = user.id
        return jsonify(user=user.to_dict()), 201

    @app.post("/api/auth/login")
    def login():
        data = payload()
        email = str(data.get("email", "")).strip().lower()
        user = Student.query.filter_by(email=email).first()
        if not user or not user.check_password(str(data.get("password", ""))):
            return jsonify(error="Email or password is incorrect."), 401
        session.clear()
        session["user_id"] = user.id
        return jsonify(user=user.to_dict())

    @app.post("/api/auth/logout")
    def logout():
        session.clear()
        return jsonify(ok=True)

    @app.get("/api/me")
    def me():
        user = current_user()
        return jsonify(user=user.to_dict() if user else None)

    @app.get("/api/bootstrap")
    @login_required()
    def bootstrap():
        user = current_user()
        recent = ChatMessage.query.filter_by(student_id=user.id).order_by(ChatMessage.created_at.desc()).limit(4).all()
        return jsonify(user=user.to_dict(), categories=CATEGORIES,
                       announcements=[item.to_dict() for item in Announcement.query.order_by(Announcement.published_at.desc()).limit(4)],
                       recent_questions=[item.to_dict() for item in recent],
                       student_count=Student.query.filter_by(role="student").count(),
                       question_count=ChatMessage.query.filter_by(student_id=user.id).count())

    @app.get("/api/chat")
    @login_required()
    def chat_history():
        user = current_user()
        limit = min(max(request.args.get("limit", default=100, type=int), 1), 250)
        messages = ChatMessage.query.filter_by(student_id=user.id).order_by(ChatMessage.created_at.asc()).limit(limit).all()
        return jsonify(messages=[message.to_dict() for message in messages])

    @app.post("/api/chat")
    @login_required()
    def ask_chatbot():
        user = current_user()
        question = str(payload().get("question", "")).strip()
        if not question or len(question) > 1000:
            return jsonify(error="Enter a question (up to 1,000 characters)."), 400
        match = find_answer(question, FAQ.query.order_by(FAQ.id).all())
        message = ChatMessage(student_id=user.id, question=question, answer=match["answer"],
                              category=match["category"], confidence=match["confidence"])
        db.session.add(message)
        db.session.commit()
        return jsonify(message=message.to_dict(), matched=match["matched"])

    @app.get("/api/data/<collection>")
    @login_required()
    def list_collection(collection):
        if collection not in COLLECTIONS:
            return jsonify(error="Unknown information category."), 404
        model, _ = COLLECTIONS[collection]
        rows = model.query.order_by(model.id.desc()).all()
        return jsonify(items=[row.to_dict() for row in rows])

    @app.get("/api/admin/stats")
    @login_required(admin=True)
    def admin_stats():
        category_rows = db.session.query(ChatMessage.category, db.func.count(ChatMessage.id)).group_by(ChatMessage.category).all()
        recent = ChatMessage.query.order_by(ChatMessage.created_at.desc()).limit(8).all()
        return jsonify(total_students=Student.query.filter_by(role="student").count(),
                       total_questions=ChatMessage.query.count(),
                       total_faqs=FAQ.query.count(),
                       categories=[{"name": name, "count": count} for name, count in category_rows],
                       recent=[{**item.to_dict(), "student_name": item.student.name,
                                "student_email": item.student.email} for item in recent])

    @app.get("/api/admin/students")
    @login_required(admin=True)
    def admin_students():
        students = Student.query.filter_by(role="student").order_by(Student.created_at.desc()).all()
        return jsonify(students=[{**student.to_dict(), "question_count": len(student.chat_messages),
                                  "created_at": student.created_at.isoformat()} for student in students])

    @app.get("/api/admin/questions")
    @login_required(admin=True)
    def admin_questions():
        limit = min(max(request.args.get("limit", default=250, type=int), 1), 1000)
        questions = ChatMessage.query.order_by(ChatMessage.created_at.desc()).limit(limit).all()
        return jsonify(questions=[{**item.to_dict(), "student_name": item.student.name,
                                   "student_email": item.student.email} for item in questions])

    @app.route("/api/admin/data/<collection>", methods=["POST", "PUT", "DELETE"])
    @login_required(admin=True)
    def manage_collection(collection):
        if collection not in COLLECTIONS:
            return jsonify(error="Unknown information category."), 404
        model, fields = COLLECTIONS[collection]
        data = payload()
        if request.method == "DELETE":
            row = db.session.get(model, request.args.get("id", type=int))
            if not row:
                return jsonify(error="Record not found."), 404
            db.session.delete(row)
            db.session.commit()
            return jsonify(ok=True)

        values = {key: data[key] for key in fields if key in data}
        missing = [field for field in fields if field not in data and request.method == "POST"]
        if missing:
            return jsonify(error=f"Missing required fields: {', '.join(missing)}"), 400
        if "seats" in values or "tuition" in values or "other_fees" in values:
            for key in ("seats", "tuition", "other_fees"):
                if key in values:
                    try:
                        values[key] = int(values[key])
                    except (TypeError, ValueError):
                        return jsonify(error=f"{key} must be a whole number."), 400
        if request.method == "POST":
            row = model(**values)
            db.session.add(row)
        else:
            row = db.session.get(model, data.get("id"))
            if not row:
                return jsonify(error="Record not found."), 404
            for key, value in values.items():
                setattr(row, key, value)
        db.session.commit()
        return jsonify(item=row.to_dict()), 201 if request.method == "POST" else 200

    with app.app_context():
        db.create_all()
        if not app.config.get("TESTING"):
            seed_database()

    return app


app = create_app()

if __name__ == "__main__":
    app.run(debug=os.environ.get("FLASK_DEBUG") == "1", port=int(os.environ.get("PORT", 5000)))