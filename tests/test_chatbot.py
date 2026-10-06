import unittest

from app import create_app
from models import FAQ, db
from seed import FAQ_DATA
from chatbot import FALLBACK, find_answer


class ChatbotRetrievalTests(unittest.TestCase):
    def setUp(self):
        self.app = create_app({"TESTING": True, "SQLALCHEMY_DATABASE_URI": "sqlite:///:memory:",
                               "SECRET_KEY": "test-secret"})
        self.context = self.app.app_context()
        self.context.push()
        db.create_all()
        self.faqs = [FAQ(category=category, question=question, aliases=aliases, answer=answer)
                     for category, question, aliases, answer in FAQ_DATA]

    def tearDown(self):
        db.session.remove()
        db.drop_all()
        self.context.pop()

    def test_example_questions_retrieve_their_categories(self):
        examples = {
            "What courses are available?": "Courses",
            "Which engineering courses do you offer?": "Courses",
            "What is the admission process?": "Admissions",
            "How much is the Computer Engineering fee?": "Fees",
            "Who is the HOD of Computer Engineering?": "Departments",
            "When are semester exams?": "Examinations",
            "Does the college provide hostel?": "Hostel",
            "What scholarships are available?": "Scholarships",
            "Tell me about placements.": "Placements",
            "How can I contact the college?": "Contact information",
        }
        for question, category in examples.items():
            with self.subTest(question=question):
                result = find_answer(question, self.faqs)
                self.assertEqual(result["category"], category)
                self.assertNotEqual(result["answer"], FALLBACK)

    def test_unmatched_query_returns_fallback(self):
        result = find_answer("What is the weather on Mars?", self.faqs)
        self.assertEqual(result["answer"], FALLBACK)

    def test_admin_apis_enforce_role_permissions(self):
        from models import Student
        student = Student(name="Demo Student", email="demo@example.edu", role="student")
        student.set_password("SecurePass123")
        admin = Student(name="Demo Admin", email="admin@example.edu", role="admin")
        admin.set_password("SecurePass123")
        db.session.add_all([student, admin])
        db.session.commit()

        client = self.app.test_client()
        self.assertEqual(client.get("/api/admin/stats").status_code, 401)
        client.post("/api/auth/login", json={"email": student.email, "password": "SecurePass123"})
        self.assertEqual(client.get("/api/admin/questions").status_code, 403)
        client.post("/api/auth/logout")
        client.post("/api/auth/login", json={"email": admin.email, "password": "SecurePass123"})
        self.assertEqual(client.get("/api/admin/questions").status_code, 200)

    def test_login_and_chat_are_session_scoped(self):
        from models import Student
        user = Student(name="Demo Student", email="demo@example.edu")
        user.set_password("SecurePass123")
        db.session.add(user)
        db.session.add_all(self.faqs)
        db.session.commit()
        client = self.app.test_client()
        response = client.post("/api/auth/login", json={"email": user.email, "password": "SecurePass123"})
        self.assertEqual(response.status_code, 200)
        response = client.post("/api/chat", json={"question": "Tell me about placements."})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json["message"]["category"], "Placements")
        self.assertEqual(client.get("/api/chat").json["messages"][0]["question"], "Tell me about placements.")


if __name__ == "__main__":
    unittest.main()