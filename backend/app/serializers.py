from app.models import Account, Lecturer, Course, Subject, Student, Grade
from rest_framework import serializers
from enumchoicefield import ChoiceEnum, EnumChoiceField
from drf_writable_nested.serializers import WritableNestedModelSerializer
from django.db.models import Avg

class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account 
        fields = ['id', 'email']

class LecturerSerializer(WritableNestedModelSerializer):
    account = AccountSerializer()

    class Meta:
        model = Lecturer
        fields = ['lecturer_id', 'name', 'account']

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ['course_id', 'name']

class SubjectSerializer(serializers.ModelSerializer):
    courses = serializers.PrimaryKeyRelatedField(
        queryset=Course.objects.all(),
        many=True,
        required=False
    )

    class Meta:
        model = Subject
        fields = ['subject_id', 'name', 'courses']

class StudentSerializer(WritableNestedModelSerializer):
    account = AccountSerializer()

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
    student_set = StudentSerializer(many=True)

    class Meta:
        model = Course
        fields = ['course_id', 'name', 'lecturer', 'student_set']

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
        fields = ['course_id', 'name', 'lecturer', 'is_enrolled']

    def get_is_enrolled(self, obj):
        me = self.context.get("student")
        if not me:
            return False
        return me.enrolment.filter(course_id=obj.course_id).exists()

class NewPasswordSerializer(serializers.Serializer):
    new_password = serializers.CharField(required=True)

class EnrolDropSerializer(serializers.Serializer):
    is_enrolled = serializers.BooleanField(required=True)

class StudentGradeSerializer(serializers.ModelSerializer):
    student_id = serializers.CharField(source='student.student_id')
    student_name = serializers.CharField(source='student.name')

    class Meta:
        model = Grade
        fields = ['student_id', 'student_name', 'percentage']
        read_only_fields = ['student_name']

class CourseGradesSerializer(serializers.Serializer):
    course_id = serializers.IntegerField()
    student_grades = StudentGradeSerializer(many=True)

class GradeDetailSerializer(serializers.ModelSerializer):
    course_id = serializers.IntegerField(source="course.course_id")
    student = StudentSerializer()
    course = CourseSerializer()
    given_by = LecturerSerializer()

    class Meta:
        model = Grade
        fields = ['course_id', 'student', 'course', 'given_by', 'percentage', 'assign_date']

class StudentProgressSerializer(serializers.ModelSerializer):
    avg_score = serializers.SerializerMethodField()
    gpa = serializers.SerializerMethodField()
    pass_count = serializers.SerializerMethodField()
    total_count = serializers.SerializerMethodField()

    class Meta:
        model = Student
        fields = ["student_id", "avg_score", "gpa", "pass_count", "total_count"]

    def get_avg_score(self, student):
        return student.grade_set.aggregate(Avg("percentage", default=0))["percentage__avg"]

    def get_gpa(self, student):
        percentage = student.grade_set.aggregate(Avg("percentage", default=0))["percentage__avg"]
        return 5.0 * (percentage / 100.0)

    def get_total_count(self, student):
        return student.enrolment.count()

    def get_pass_count(self, student):
        return student.grade_set.exclude(percentage__lt=50).count()

