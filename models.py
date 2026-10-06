from datetime import datetime, timezone

from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import check_password_hash, generate_password_hash

db = SQLAlchemy()


def utcnow():
    return datetime.now(timezone.utc)


class Student(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(160), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), nullable=False, default="student")
    created_at = db.Column(db.DateTime(timezone=True), default=utcnow, nullable=False)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {"id": self.id, "name": self.name, "email": self.email, "role": self.role}


class FAQ(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    category = db.Column(db.String(40), nullable=False, index=True)
    question = db.Column(db.String(300), nullable=False)
    aliases = db.Column(db.Text, nullable=False, default="")
    answer = db.Column(db.Text, nullable=False)
    updated_at = db.Column(db.DateTime(timezone=True), default=utcnow, onupdate=utcnow)

    def to_dict(self):
        return {"id": self.id, "category": self.category, "question": self.question,
                "aliases": self.aliases, "answer": self.answer}


class Course(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    degree = db.Column(db.String(40), nullable=False)
    duration = db.Column(db.String(40), nullable=False)
    seats = db.Column(db.Integer, nullable=False, default=60)
    department = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False, default="")

    def to_dict(self):
        return {"id": self.id, "name": self.name, "degree": self.degree,
                "duration": self.duration, "seats": self.seats,
                "department": self.department, "description": self.description}


class Department(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    code = db.Column(db.String(20), nullable=False)
    head = db.Column(db.String(100), nullable=False)
    building = db.Column(db.String(80), nullable=False)
    description = db.Column(db.Text, nullable=False, default="")

    def to_dict(self):
        return {"id": self.id, "name": self.name, "code": self.code, "head": self.head,
                "building": self.building, "description": self.description}


class Faculty(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    title = db.Column(db.String(80), nullable=False)
    department = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(160), nullable=False)
    specialization = db.Column(db.String(160), nullable=False)

    def to_dict(self):
        return {"id": self.id, "name": self.name, "title": self.title,
                "department": self.department, "email": self.email,
                "specialization": self.specialization}


class Fee(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    program = db.Column(db.String(120), nullable=False)
    academic_year = db.Column(db.String(20), nullable=False)
    tuition = db.Column(db.Integer, nullable=False)
    other_fees = db.Column(db.Integer, nullable=False, default=0)
    notes = db.Column(db.String(200), nullable=False, default="Per academic year")

    def to_dict(self):
        return {"id": self.id, "program": self.program, "academic_year": self.academic_year,
                "tuition": self.tuition, "other_fees": self.other_fees, "notes": self.notes}


class Announcement(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(180), nullable=False)
    body = db.Column(db.Text, nullable=False)
    tag = db.Column(db.String(40), nullable=False, default="Campus")
    published_at = db.Column(db.DateTime(timezone=True), default=utcnow, nullable=False)

    def to_dict(self):
        return {"id": self.id, "title": self.title, "body": self.body, "tag": self.tag,
                "published_at": self.published_at.isoformat() if self.published_at else None}


class ChatMessage(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey("student.id"), nullable=False, index=True)
    question = db.Column(db.Text, nullable=False)
    answer = db.Column(db.Text, nullable=False)
    category = db.Column(db.String(40), nullable=False, default="General")
    confidence = db.Column(db.Float, nullable=False, default=0)
    created_at = db.Column(db.DateTime(timezone=True), default=utcnow, nullable=False, index=True)
    student = db.relationship("Student", backref=db.backref("chat_messages", lazy=True))

    def to_dict(self):
        return {"id": self.id, "question": self.question, "answer": self.answer,
                "category": self.category, "confidence": round(self.confidence, 3),
                "created_at": self.created_at.isoformat()}