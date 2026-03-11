from app.models import Account, Lecturer, Course, Subject, Student
from rest_framework import serializers
from enumchoicefield import ChoiceEnum, EnumChoiceField

class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account 
        fields = ['email']

class LecturerSerializer(serializers.ModelSerializer):
    account = AccountSerializer()

    class Meta:
        model = Lecturer
        fields = ['lecturer_id', 'name', 'account']

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ['course_id', 'name', 'schedule']

class SubjectSerializer(serializers.ModelSerializer):
    courses = serializers.PrimaryKeyRelatedField(
        queryset=Course.objects.all(),
        many=True,
        required=False
    )

    class Meta:
        model = Subject
        fields = ['subject_id', 'name', 'courses']

class StudentSerializer(serializers.ModelSerializer):
    account = AccountSerializer()
    subject = SubjectSerializer()

    class Meta:
        model = Student
        fields = ['student_id', 'name', 'account', 'subject']

class LecturerDashboardSerializer(serializers.ModelSerializer):
    account = AccountSerializer()
    course_set = CourseSerializer(many=True)

    class Meta:
        model = Lecturer
        fields = ['lecturer_id', 'name', 'account', 'course_set']

class CourseDetailSerializer(serializers.ModelSerializer):
    lecturer = LecturerSerializer()

    class Meta:
        model = Course
        fields = ['course_id', 'name', 'schedule', 'lecturer']

class StudentDashboardSerializer(serializers.ModelSerializer):
    account = AccountSerializer()
    subject = SubjectSerializer()
    enrolment = CourseDetailSerializer(many=True)

    class Meta:
        model = Student
        fields = ['student_id', 'name', 'account', 'subject', 'enrolment']

class StudentCourseSerializer(serializers.ModelSerializer):
    lecturer = LecturerSerializer()
    is_enrolled = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = ['course_id', 'name', 'schedule', 'lecturer', 'is_enrolled']

    def get_is_enrolled(self, obj):
        me = self.context.get("student")
        if not me:
            return False
        return me.enrolment.filter(course_id=obj.course_id).exists()

class UserType(ChoiceEnum):
    administrator = "administrator"
    lecturer = "lecturer"
    student = "student"

    def get_model(user_type):
        if str(user_type) == str(UserType.administrator):
            return None
        elif str(user_type) == str(UserType.lecturer):
            return Lecturer
        else:
            return Student

class ResetUserPasswordSerializer(serializers.Serializer):
    user_type = EnumChoiceField(enum_class=UserType)
    user_id = serializers.IntegerField(required=True)
    new_password = serializers.CharField(required=True)

class LoginSerializer(serializers.Serializer):
    user_type = EnumChoiceField(enum_class=UserType)
    email = serializers.IntegerField(required=True)
    password = serializers.CharField(required=True)

