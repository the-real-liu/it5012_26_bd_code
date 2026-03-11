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

class ResetUserPassword(GenericAPIView):
    permission_classes = [permissions.IsAdminUser]
    serializer_class = ResetUserPasswordSerializer

    def put(self, request):
        new_password = request.data['new_password']
        user_id = request.data['user_id']
        user_model = UserType.get_model(request.data["user_type"])
        obj = user_model.objects.get(pk=user_id)
        obj.account.set_password(new_password)
        obj.account.save()
        return Response({'success': 1}, status=200)

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

