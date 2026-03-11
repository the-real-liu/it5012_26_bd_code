from rest_framework import permissions, viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.generics import GenericAPIView

from app.models import *
from app.serializers import *

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

# Lecturer views
class LecturerDashboardView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, format=None):
        me = request.user.lecturer
        serializer = LecturerDashboardSerializer(me)
        return Response(serializer.data)

# Student views
class StudentDashboardView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, format=None):
        me = request.user.student
        serializer = StudentDashboardSerializer(me)
        return Response(serializer.data)

class StudentCourseListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, format=None):
        me = request.user.student
        courses = me.subject.courses
        serializer = StudentCourseSerializer(courses, many=True, context={"student": me})
        return Response(serializer.data)

