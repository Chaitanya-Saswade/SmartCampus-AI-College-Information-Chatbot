from models import Announcement, Course, Department, FAQ, Faculty, Fee, Student, db

CATEGORIES = [
    "Admissions", "Courses", "Departments", "Faculty", "Fees", "Examinations",
    "Scholarships", "Placements", "Hostel", "Library", "Transportation",
    "Facilities", "Events", "Contact information",
]

FAQ_DATA = [
    ("Admissions", "What is the admission process?", "admission process apply application eligibility entrance exam documents enrollment how to join",
    "Applications for the 2027-28 intake open in May through the admissions portal. Submit your Class 12 marksheets, entrance score, photo ID and transfer certificate. Shortlisted applicants are invited for document verification and counseling. The application deadline is 30 June 2027."),
    ("Courses", "What courses are available?", "programs degrees offered list courses undergraduate postgraduate",
     "We offer B.Tech programs in Computer Engineering, Information Technology, Mechanical Engineering, Civil Engineering and Electronics & Communication. Other programs include BBA, BCA and MBA. Most undergraduate degrees are four years; BBA and BCA are three years."),
    ("Courses", "Which engineering courses do you offer?", "engineering branches btech computer information technology mechanical civil electronics communication",
     "Our engineering programs are B.Tech Computer Engineering, Information Technology, Mechanical Engineering, Civil Engineering, and Electronics & Communication. Each is a four-year program with an intake of 60 students."),
    ("Fees", "How much is the Computer Engineering fee?", "computer engineering fees tuition cost annual fee btech price",
     "The B.Tech Computer Engineering tuition is Rs. 1,18,000 per academic year for 2026-27. University, examination and activity charges are approximately Rs. 12,500 extra. Hostel and meal plans are billed separately."),
    ("Departments", "Who is the HOD of Computer Engineering?", "head of department hod computer engineering department chair",
     "The Head of the Computer Engineering Department is Dr. Meera Kulkarni. Her office is in the C Block, second floor. Email: meera.kulkarni@smartcampus.edu."),
    ("Examinations", "When are semester exams?", "exam schedule timetable dates end semester mid semester examination",
     "The odd-semester end examinations are scheduled from 2 to 14 December 2026. Even-semester exams run from 20 April to 2 May 2027. The detailed timetable is published on the student portal at least three weeks before exams."),
    ("Hostel", "Does the college provide hostel?", "accommodation residence dormitory hostel rooms fees facilities",
     "Yes. Separate, supervised hostels are available for women and men, with furnished twin-sharing rooms, Wi-Fi, laundry and 24-hour security. Applications are made through the student portal after admission. Annual accommodation starts at Rs. 82,000, excluding meals."),
    ("Scholarships", "What scholarships are available?", "financial aid merit need based scholarship fee waiver government grant",
     "Scholarships include the Merit Excellence Award (up to 50% tuition waiver for students scoring 90%+), the Need-Based Access Grant, state post-matric scholarships, and the Sports Achievement Award. Apply through the financial aid office by 31 July with income and academic documents."),
    ("Placements", "Tell me about placements.", "placement recruiters companies average package highest internship career",
     "The 2025 graduating class achieved an 88% placement rate. The median package was Rs. 6.8 LPA, with a highest offer of Rs. 24 LPA. Recruiters included Infosys, TCS, Siemens, Deloitte and Bosch. The Career Development Centre also supports internships and interview preparation."),
    ("Contact information", "How can I contact the college?", "contact details phone email address reach office",
     "Call the main office at +91 80 4567 8900 or email hello@smartcampus.edu. The campus is at 42 Knowledge Park Road, Bengaluru, Karnataka 560064. Office hours are Monday to Friday, 9:00 AM to 5:00 PM."),
    ("Library", "What are the library hours?", "library timing opening hours books study space",
     "The Central Library is open Monday to Saturday, 8:00 AM to 9:00 PM, and Sunday, 10:00 AM to 4:00 PM during term. Students can access 38,000 print titles, journals, e-resources and silent study rooms with their campus ID."),
    ("Transportation", "Is college transport available?", "bus shuttle route pickup transport commute",
     "College buses serve 18 routes across Bengaluru, including Whitefield, Jayanagar, Yelahanka and Electronic City. Route maps and the annual pass application are available from the transport office. The 2026-27 pass costs Rs. 24,000."),
    ("Facilities", "What facilities are on campus?", "campus amenities sports gym laboratory cafeteria medical wifi",
     "Campus facilities include smart classrooms, engineering and research labs, a 400-seat auditorium, indoor sports complex, fitness center, health clinic, cafeteria, high-speed Wi-Fi and student collaboration spaces."),
    ("Events", "What events are coming up?", "festivals calendar cultural technical event competition",
     "The next campus events are Innovate 2026, our student technology showcase on 18 October, and Utsav, the cultural festival on 6-7 November. Registration opens on the student portal two weeks before each event."),
    ("Faculty", "How do I find faculty members?", "teacher professor staff directory email faculty contact",
     "The faculty directory is available from the Departments section of the college portal. You can search by department or specialization. Department offices are open on weekdays from 9:00 AM to 4:30 PM."),
]


def seed_database():
    if Student.query.first():
        return

    admin = Student(name="Aarav Sharma", email="admin@smartcampus.edu", role="admin")
    admin.set_password("Admin@123")
    student = Student(name="Riya Patel", email="student@smartcampus.edu", role="student")
    student.set_password("Student@123")
    db.session.add_all([admin, student])

    db.session.add_all([FAQ(category=category, question=question, aliases=aliases, answer=answer)
                        for category, question, aliases, answer in FAQ_DATA])
    db.session.add_all([
        Course(name="Computer Engineering", degree="B.Tech", duration="4 years", seats=120,
               department="Computer Engineering", description="Software, AI and intelligent systems."),
        Course(name="Information Technology", degree="B.Tech", duration="4 years", seats=60,
               department="Information Technology", description="Networks, cloud platforms and cybersecurity."),
        Course(name="Mechanical Engineering", degree="B.Tech", duration="4 years", seats=60,
               department="Mechanical Engineering", description="Design, manufacturing and robotics."),
        Course(name="Civil Engineering", degree="B.Tech", duration="4 years", seats=60,
               department="Civil Engineering", description="Infrastructure, structures and sustainable cities."),
        Course(name="Business Administration", degree="BBA", duration="3 years", seats=60,
               department="Management Studies", description="Business, leadership and entrepreneurship."),
        Course(name="Computer Applications", degree="BCA", duration="3 years", seats=60,
               department="Computer Applications", description="Application development and computing foundations."),
    ])
    db.session.add_all([
        Department(name="Computer Engineering", code="CE", head="Dr. Meera Kulkarni", building="C Block"),
        Department(name="Information Technology", code="IT", head="Prof. Nikhil Rao", building="C Block"),
        Department(name="Mechanical Engineering", code="ME", head="Dr. Sana Iyer", building="A Block"),
        Department(name="Civil Engineering", code="CV", head="Dr. Kabir Desai", building="B Block"),
        Department(name="Management Studies", code="MS", head="Prof. Anita Bose", building="D Block"),
    ])
    db.session.add_all([
        Faculty(name="Dr. Meera Kulkarni", title="Professor & HOD", department="Computer Engineering",
                email="meera.kulkarni@smartcampus.edu", specialization="Machine Learning"),
        Faculty(name="Prof. Nikhil Rao", title="Associate Professor", department="Information Technology",
                email="nikhil.rao@smartcampus.edu", specialization="Cybersecurity"),
        Faculty(name="Dr. Sana Iyer", title="Professor & HOD", department="Mechanical Engineering",
                email="sana.iyer@smartcampus.edu", specialization="Robotics"),
    ])
    db.session.add_all([
        Fee(program="B.Tech Computer Engineering", academic_year="2026-27", tuition=118000, other_fees=12500),
        Fee(program="B.Tech Information Technology", academic_year="2026-27", tuition=112000, other_fees=12500),
        Fee(program="BBA", academic_year="2026-27", tuition=92000, other_fees=10500),
        Fee(program="BCA", academic_year="2026-27", tuition=88000, other_fees=10500),
    ])
    db.session.add_all([
        Announcement(title="Innovate 2026 registration is open", body="Showcase your prototype at our annual student technology showcase on 18 October.", tag="Campus",),
        Announcement(title="Odd-semester exam timetable", body="End-semester examinations begin on 2 December. The detailed timetable is on the student portal.", tag="Exams"),
        Announcement(title="Scholarship applications close 31 July 2027", body="Submit your merit and need-based scholarship applications with supporting documents before the deadline.", tag="Financial aid"),
    ])
    db.session.commit()