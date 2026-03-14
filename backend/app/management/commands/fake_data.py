from django.core.management.base import BaseCommand
from app.models import Account, Lecturer, Course, Subject, Student
import os

TESTDATA = {
  "lecturers": [
    {"name": "Daniel Carter", "email": "danielcarter@example.com"},
    {"name": "Olivia Bennett", "email": "oliviabennett@example.com"},
    {"name": "Marcus Hughes", "email": "marcushughes@example.com"},
    {"name": "Sophie Reynolds", "email": "sophiereynolds@example.com"},
    {"name": "Ethan Walker", "email": "ethanwalker@example.com"}
  ],
  "courses": [
    {"name": "Programming Fundamentals", "lecturer": "Daniel Carter"},
    {"name": "Data Structures", "lecturer": "Olivia Bennett"},
    {"name": "Database Systems", "lecturer": "Marcus Hughes"},
    {"name": "Web Development", "lecturer": "Sophie Reynolds"},
    {"name": "Network Security", "lecturer": "Ethan Walker"},
    {"name": "Digital Marketing", "lecturer": "Daniel Carter"},
    {"name": "Financial Accounting", "lecturer": "Olivia Bennett"},
    {"name": "Business Management", "lecturer": "Marcus Hughes"},
    {"name": "Graphic Design", "lecturer": "Sophie Reynolds"},
    {"name": "Animation Basics", "lecturer": "Ethan Walker"}
  ],
  "subjects": [
    {
      "name": "Computer Science",
      "courses": [
        "Programming Fundamentals",
        "Data Structures",
        "Database Systems",
        "Web Development",
        "Network Security"
      ]
    },
    {
      "name": "Business",
      "courses": [
        "Digital Marketing",
        "Financial Accounting",
        "Business Management"
      ]
    },
    {
      "name": "Creative Media",
      "courses": [
        "Graphic Design",
        "Animation Basics"
      ]
    }
  ],
  "students": [
    {
      "name": "Jack Turner",
      "email": "jackturner@example.com",
      "subject": "Computer Science",
      "enrolment": ["Programming Fundamentals", "Database Systems", "Web Development"]
    },
    {
      "name": "Emily Dawson",
      "email": "emilydawson@example.com",
      "subject": "Computer Science",
      "enrolment": ["Programming Fundamentals", "Data Structures"]
    },
    {
      "name": "Ryan Clarke",
      "email": "ryanclarke@example.com",
      "subject": "Computer Science",
      "enrolment": ["Data Structures", "Network Security"]
    },
    {
      "name": "Hannah Price",
      "email": "hannahprice@example.com",
      "subject": "Computer Science",
      "enrolment": ["Programming Fundamentals", "Web Development", "Network Security"]
    },
    {
      "name": "Leo Morgan",
      "email": "leomorgan@example.com",
      "subject": "Computer Science",
      "enrolment": ["Database Systems", "Data Structures"]
    },
    {
      "name": "Ava Richardson",
      "email": "avarichardson@example.com",
      "subject": "Business",
      "enrolment": ["Digital Marketing", "Business Management"]
    },
    {
      "name": "Lucas Bennett",
      "email": "lucasbennett@example.com",
      "subject": "Business",
      "enrolment": ["Financial Accounting", "Business Management"]
    },
    {
      "name": "Mia Sanders",
      "email": "miasanders@example.com",
      "subject": "Business",
      "enrolment": ["Digital Marketing", "Financial Accounting"]
    },
    {
      "name": "Oliver Grant",
      "email": "olivergrant@example.com",
      "subject": "Business",
      "enrolment": ["Digital Marketing", "Business Management", "Financial Accounting"]
    },
    {
      "name": "Sophie Coleman",
      "email": "sophiecoleman@example.com",
      "subject": "Business",
      "enrolment": ["Financial Accounting", "Business Management"]
    },
    {
      "name": "Ethan Powell",
      "email": "ethanpowell@example.com",
      "subject": "Creative Media",
      "enrolment": ["Graphic Design", "Animation Basics"]
    },
    {
      "name": "Isabella Hughes",
      "email": "isabellahughes@example.com",
      "subject": "Creative Media",
      "enrolment": ["Graphic Design", "Animation Basics"]
    },
    {
      "name": "Mason Patel",
      "email": "masonpatel@example.com",
      "subject": "Creative Media",
      "enrolment": ["Animation Basics", "Graphic Design"]
    },
    {
      "name": "Grace Fisher",
      "email": "gracefisher@example.com",
      "subject": "Creative Media",
      "enrolment": ["Graphic Design", "Animation Basics"]
    },
    {
      "name": "Logan Ward",
      "email": "loganward@example.com",
      "subject": "Creative Media",
      "enrolment": ["Animation Basics", "Graphic Design"]
    }
  ]
}

class Command(BaseCommand):
    help = "Seeds the database with test data"

    def create_account(self, name, email, model, defaults={}):
        account_extra = {}
        if model is None:
            account_extra.setdefault("is_staff", True)
            account_extra.setdefault("is_superuser", True)
        account, created = Account.objects.update_or_create(
            email=email, **account_extra
        )
        if "SET_PASS" in os.environ:
            account.set_password(os.environ["SET_PASS"])
            account.save()
        if model is None:
            return account, created
        return model.objects.update_or_create(
            name=name, defaults={"account": account, **defaults}
        )

    def create_admin(self, name, email):
        admin, _ = self.create_account(name, email, None)
        return admin

    def create_lecturer(self, name, email):
        lecturer, _ = self.create_account(name, email, Lecturer)
        self.stdout.write(f"Creating lecturer {name}...")
        return lecturer

    def create_course(self, name, lecturer):
        course, _ = Course.objects.update_or_create(
            name=name, defaults={"lecturer": lecturer}
        )
        self.stdout.write(f"Creating course {name}...")
        return course

    def create_subject(self, name, courses):
        subject, _ = Subject.objects.update_or_create(
            name=name, defaults={}
        )
        for course in courses:
            subject.courses.add(course.course_id)
        subject.save()
        self.stdout.write(f"Creating subject {name}...")
        return subject

    def create_student(self, name, email, subject, enrolment):
        student, _ = self.create_account(
            name, email, Student, defaults={"subject": subject}
        )
        for course in enrolment:
            student.enrolment.add(course.course_id)
        student.save()
        self.stdout.write(f"Creating student {name}...")
        return student

    def handle(self, *args, **options):
        self.stdout.write("Creating test data...")

        self.create_admin("admin", "admin@example.com")

        lecturers = {}
        for it in TESTDATA["lecturers"]:
            lecturers[it["name"]] = self.create_lecturer(it["name"], it["email"])

        courses = {}
        for it in TESTDATA["courses"]:
            courses[it["name"]] = self.create_course(it["name"], lecturers[it["lecturer"]])

        subjects = {}
        for it in TESTDATA["subjects"]:
            subject_courses = []
            for itt in it["courses"]:
                subject_courses.append(courses[itt])
            subjects[it["name"]] = self.create_subject(it["name"], subject_courses)

        for it in TESTDATA["students"]:
            enrolment = []
            for itt in it["enrolment"]:
                enrolment.append(courses[itt])
            self.create_student(it["name"], it["email"], subjects[it["subject"]], enrolment)

