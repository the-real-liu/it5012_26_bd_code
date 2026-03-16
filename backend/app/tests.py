from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase, APIClient

from app.models import Account, Lecturer, Student, Course, Subject, Grade
from app.models import Account, Lecturer, Course, Subject, Student, Grade
from app.serializers import (
    AccountSerializer,
    LecturerSerializer,
    CourseSerializer,
    SubjectSerializer,
    StudentSerializer,
    LecturerDashboardSerializer,
    CourseDetailSerializer,
    StudentDashboardSerializer,
    StudentCourseSerializer,
    NewPasswordSerializer,
    EnrolDropSerializer,
    StudentGradeSerializer,
    CourseGradesSerializer,
    GradeDetailSerializer,
    StudentProgressSerializer,
)
from app.management.commands.fake_data import Command as FakeDataCommand

# MODEL TESTS

class AccountModelTest(TestCase):
    def test_account_creation(self):
        user = Account.objects.create_user(email="test@test.com", password="pass")
        self.assertEqual(str(user), "test@test.com")


class LecturerModelTest(TestCase):
    def test_lecturer_creation(self):
        acc = Account.objects.create_user(email="lect@test.com", password="pass")
        lecturer = Lecturer.objects.create(name="Dr Smith", account=acc)
        self.assertIn("Lecturer#", str(lecturer))


class CourseModelTest(TestCase):
    def test_course_creation(self):
        course = Course.objects.create(name="Math")
        self.assertEqual(course.name, "Math")


class SubjectModelTest(TestCase):
    def test_subject_creation(self):
        subject = Subject.objects.create(name="Science")
        self.assertEqual(subject.name, "Science")


class StudentModelTest(TestCase):
    def test_student_creation(self):
        acc = Account.objects.create_user(email="stud@test.com", password="pass")
        student = Student.objects.create(name="John", account=acc)
        self.assertIn("Student#", str(student))


class GradeModelTest(TestCase):
    def test_grade_creation(self):
        acc = Account.objects.create_user(email="stud2@test.com", password="pass")
        student = Student.objects.create(name="Jane", account=acc)
        course = Course.objects.create(name="Physics")

        grade = Grade.objects.create(student=student, course=course, percentage=80)
        self.assertEqual(grade.percentage, 80)


# SERIALIZER TESTS

class SerializerTests(TestCase):

    def setUp(self):
        self.account = Account.objects.create_user(email="user@test.com", password="pass")
        self.lecturer = Lecturer.objects.create(name="Lecturer", account=self.account)
        self.course = Course.objects.create(name="Algorithms", lecturer=self.lecturer)
        self.subject = Subject.objects.create(name="CS")
        self.student_acc = Account.objects.create_user(email="stud@test.com", password="pass")
        self.student = Student.objects.create(name="Student", account=self.student_acc, subject=self.subject)

    def test_account_serializer(self):
        serializer = AccountSerializer(self.account)
        self.assertEqual(serializer.data["email"], "user@test.com")

    def test_lecturer_serializer(self):
        serializer = LecturerSerializer(self.lecturer)
        self.assertEqual(serializer.data["name"], "Lecturer")

    def test_course_serializer(self):
        serializer = CourseSerializer(self.course)
        self.assertEqual(serializer.data["name"], "Algorithms")

    def test_subject_serializer(self):
        serializer = SubjectSerializer(self.subject)
        self.assertEqual(serializer.data["name"], "CS")

    def test_student_serializer(self):
        serializer = StudentSerializer(self.student)
        self.assertEqual(serializer.data["name"], "Student")

    def test_lecturer_dashboard_serializer(self):
        serializer = LecturerDashboardSerializer(self.lecturer)
        self.assertEqual(serializer.data["name"], "Lecturer")

    def test_course_detail_serializer(self):
        serializer = CourseDetailSerializer(self.course)
        self.assertEqual(serializer.data["name"], "Algorithms")

    def test_student_dashboard_serializer(self):
        serializer = StudentDashboardSerializer(self.student)
        self.assertEqual(serializer.data["name"], "Student")

    def test_student_course_serializer(self):
        serializer = StudentCourseSerializer(self.course, context={"student": self.student})
        self.assertFalse(serializer.data["is_enrolled"])

    def test_new_password_serializer(self):
        serializer = NewPasswordSerializer(data={"new_password": "abc123"})
        self.assertTrue(serializer.is_valid())

    def test_enrol_drop_serializer(self):
        serializer = EnrolDropSerializer(data={"is_enrolled": True})
        self.assertTrue(serializer.is_valid())

    def test_student_grade_serializer(self):
        grade = Grade.objects.create(student=self.student, course=self.course, percentage=90)
        serializer = StudentGradeSerializer(grade)
        self.assertEqual(serializer.data["percentage"], 90)

    def test_course_grades_serializer(self):
        data = {"course_id": 1, "student_grades": []}
        serializer = CourseGradesSerializer(data=data)
        self.assertTrue(serializer.is_valid())

    def test_grade_detail_serializer(self):
        grade = Grade.objects.create(student=self.student, course=self.course, percentage=70)
        serializer = GradeDetailSerializer(grade)
        self.assertEqual(serializer.data["percentage"], 70)

    def test_student_progress_serializer(self):
        serializer = StudentProgressSerializer(self.student)
        self.assertIn("avg_score", serializer.data)


# API VIEW TESTS

class APITests(APITestCase):

    def setUp(self):
        self.client = APIClient()
        fake_data_command = FakeDataCommand()
        fake_data_command.handle(silence=True)
        self.admin = Account.objects.get(email="admin@example.com")
        self.student_acc = Account.objects.get(email="jackturner@example.com")
        self.lecturer_acc = Account.objects.get(email="danielcarter@example.com")

    def test_my_role_view(self):
        self.client.force_authenticate(self.student_acc)
        response = self.client.get("/api/my_role/")
        self.assertEqual(response.status_code, 200)

    def test_admin_dashboard(self):
        self.client.force_authenticate(self.admin)
        response = self.client.get("/api/admin/dashboard/")
        self.assertEqual(response.status_code, 200)

    def test_lecturer_dashboard(self):
        self.client.force_authenticate(self.lecturer_acc)
        response = self.client.get("/api/lecturer/dashboard/")
        self.assertEqual(response.status_code, 200)

    def test_lecturer_courses_view(self):
        self.client.force_authenticate(self.lecturer_acc)
        response = self.client.get("/api/lecturer/courses/")
        self.assertEqual(response.status_code, 200)

    def test_student_dashboard(self):
        self.client.force_authenticate(self.student_acc)
        response = self.client.get("/api/student/dashboard/")
        self.assertEqual(response.status_code, 200)

    def test_student_enrolment_view(self):
        self.client.force_authenticate(self.student_acc)
        response = self.client.get("/api/student/enrolment/")
        self.assertIn(response.status_code, [200, 404])

    def test_student_grades_view(self):
        self.client.force_authenticate(self.student_acc)
        response = self.client.get("/api/student/grades/")
        self.assertEqual(response.status_code, 200)

    def test_student_progress_view(self):
        self.client.force_authenticate(self.student_acc)
        response = self.client.get("/api/student/progress/")
        self.assertEqual(response.status_code, 200)
