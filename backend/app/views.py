from django.http import HttpResponseForbidden
from rest_framework import permissions, viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.generics import GenericAPIView
from rest_framework.mixins import ListModelMixin, RetrieveModelMixin
from app.models import *
from app.serializers import *


# Common views
class MyRoleView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        me = request.user
        role = "unknown"
        if me.is_staff:
            role = "admin"
        elif hasattr(me, "student"):
            role = "student"
        elif hasattr(me, "lecturer"):
            role = "lecturer"
        return Response({"role": role})


# Administrator views


class LecturerViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows lecturers to be viewed or edited by administrators.
    """

    queryset = Lecturer.objects.all().order_by("lecturer_id")
    serializer_class = LecturerSerializer
    permission_classes = [permissions.IsAdminUser]


class CourseViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows courses to be viewed or edited by administrators.
    """

    queryset = Course.objects.all().order_by("course_id")
    serializer_class = CourseSerializer
    permission_classes = [permissions.IsAdminUser]


class SubjectViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows subjects to be viewed or edited by administrators.
    """

    queryset = Subject.objects.all().order_by("subject_id")
    serializer_class = SubjectSerializer
    permission_classes = [permissions.IsAdminUser]


class StudentViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows students to be viewed or edited by administrators.
    """

    queryset = Student.objects.all().order_by("student_id")
    serializer_class = StudentSerializer
    permission_classes = [permissions.IsAdminUser]


class ResetAccountPassword(APIView):
    permission_classes = [permissions.IsAdminUser]

    def put(self, request, id):
        serializer = NewPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        new_password = serializer.validated_data["new_password"]
        obj = Account.objects.get(pk=id)
        obj.set_password(new_password)
        obj.save()
        serializer = AccountSerializer(obj)
        data = serializer.data
        return Response(data)


class AdminDashboardView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        me = request.user
        serializer = AccountSerializer(me)
        return Response(serializer.data)


# Lecturer views
class LecturerDashboardView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        try:
            me = request.user.lecturer
        except Lecturer.DoesNotExist:
            return HttpResponseForbidden()
        serializer = LecturerDashboardSerializer(me)
        return Response(serializer.data)


class LecturerCoursesView(ListModelMixin, RetrieveModelMixin, GenericAPIView):
    serializer_class = CourseDetailSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        me = self.request.user.lecturer
        return me.course_set

    def get(self, request, *args, **kwargs):
        if "pk" in kwargs:
            return self.retrieve(request, *args, **kwargs)
        return self.list(request, *args, **kwargs)


class LecturerCourseGradesView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def sync(self, course, me):
        # synchronize the grade table
        for student in course.student_set.all():
            Grade.objects.update_or_create(
                student=student, course=course, create_defaults={"given_by": me}
            )

    def get(self, request, course_id):
        me = request.user.lecturer
        course = Course.objects.get(pk=course_id)
        if course.lecturer != me:
            return HttpResponseForbidden()
        self.sync(course, me)
        serializer = CourseGradesSerializer(
            {"course_id": course_id, "student_grades": course.grade_set.all()}
        )
        return Response(serializer.data)

    def put(self, request, course_id):
        me = request.user.lecturer
        course = Course.objects.get(pk=course_id)
        if course.lecturer != me:
            return HttpResponseForbidden()

        serializer = CourseGradesSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        for grade_data in serializer.validated_data["student_grades"]:
            student_id = grade_data["student"]["student_id"]
            percentage = grade_data["percentage"]
            Grade.objects.update_or_create(
                course=course,
                student_id=student_id,
                defaults={
                    "given_by": me,
                    "percentage": percentage,
                },
            )

        self.sync(course, me)
        serializer = CourseGradesSerializer(
            {"course_id": course_id, "student_grades": course.grade_set.all()}
        )
        return Response(serializer.data)


# Student views
class StudentDashboardView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        try:
            me = request.user.student
        except Student.DoesNotExist:
            return HttpResponseForbidden()
        serializer = StudentDashboardSerializer(me)
        return Response(serializer.data)


class StudentEnrolmentView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        me = request.user.student
        courses = me.subject.courses
        serializer = StudentCourseSerializer(
            courses, many=True, context={"student": me}
        )
        return Response(serializer.data)

    def put(self, request, pk):
        serializer = EnrolDropSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        course = Course.objects.get(pk=pk)
        is_enrolled = serializer.validated_data["is_enrolled"]

        me = request.user.student
        if is_enrolled:
            me.enrolment.add(course)
        else:
            me.enrolment.remove(course)
        me.save()
        return Response(StudentCourseSerializer(course, context={"student": me}).data)


class StudentGradeView(ListModelMixin, GenericAPIView):
    serializer_class = GradeDetailSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        me = self.request.user.student
        return me.grade_set

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)


class StudentProgressView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        me = request.user.student
        serializer = StudentProgressSerializer(me)
        return Response(serializer.data)
