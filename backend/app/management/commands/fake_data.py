from django.core.management.base import BaseCommand
from app.models import Account, Lecturer, Course, Subject, Student

class Command(BaseCommand):
    help = 'Seeds the database with test data'

    def create_account(self, name, email, model, defaults = {}):
        account_extra = {}
        if model is None:
            account_extra.setdefault("is_staff", True)
            account_extra.setdefault("is_superuser", True)
        account, created = Account.objects.update_or_create(email=email, **account_extra)
        if model is None:
            return account, created
        return model.objects.update_or_create(name=name, defaults={'account': account, **defaults})

    def handle(self, *args, **options):
        self.stdout.write('Creating test data...')

        admin, _ = self.create_account('admin', 'admin@example.com', None)

        lecturer_john, _ = self.create_account('John', 'john@example.com', Lecturer)
        lecturer_mary, _ = self.create_account('Mary', 'mary@example.com', Lecturer)

        course_math, _ = Course.objects.update_or_create(name='Math', defaults={'schedule': [], 'lecturer': lecturer_john})
        course_music, _ = Course.objects.update_or_create(name='Music', defaults={'schedule': [], 'lecturer': lecturer_mary})
        course_english, _ = Course.objects.update_or_create(name='English', defaults={'schedule': [], 'lecturer': lecturer_john})
        course_history, _ = Course.objects.update_or_create(name='History', defaults={'schedule': [], 'lecturer': lecturer_mary})

        subject_history, _ = Subject.objects.update_or_create(name='History', defaults={})
        subject_history.courses.add(course_english)
        subject_history.courses.add(course_history)
        subject_music, _ = Subject.objects.update_or_create(name='Music', defaults={})
        subject_music.courses.add(course_math)
        subject_music.courses.add(course_history)
        subject_music.courses.add(course_music)

        student_jack, _ = self.create_account('Jack', 'jack@example.com', Student, defaults={
            'subject': subject_history})
        student_jack.enrolment.add(course_english)
        student_jack.enrolment.add(course_history)
        student_lee, _ = self.create_account('Lee', 'lee@example.com', Student, defaults={
            'subject': subject_music})
        student_lee.enrolment.add(course_math)
        student_lee.enrolment.add(course_music)

