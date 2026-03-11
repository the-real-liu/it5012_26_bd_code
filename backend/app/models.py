from django.db import models
from django.contrib.auth.models import AbstractUser, PermissionsMixin
from app.managers import AccountUserManager

class Account(AbstractUser):
    username = None
    email = models.EmailField(max_length=254, unique=True)
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = AccountUserManager()

    def __str__(self):
        return self.email

class Lecturer(models.Model):
    lecturer_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=254)
    account = models.OneToOneField(Account, on_delete=models.CASCADE)

    def __str__(self):
        return f"Lecturer#{self.lecturer_id} {self.account.email}"

class Course(models.Model):
    course_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=254)
    lecturer = models.ForeignKey(Lecturer, null=True, blank=True, on_delete=models.SET_NULL)

    def __str__(self):
        return f"Course#{self.course_id} {self.name}"

class Subject(models.Model):
    subject_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=254)
    courses = models.ManyToManyField(Course, blank=True)

    def __str__(self):
        return f"Subject#{self.subject_id} {self.name}"

class Student(models.Model):
    student_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=254)
    account = models.OneToOneField(Account, on_delete=models.CASCADE)
    subject = models.ForeignKey(Subject, null=True, blank=True, on_delete=models.PROTECT)
    enrolment = models.ManyToManyField(Course, blank=True)

    def __str__(self):
        return f"Student#{self.student_id} {self.account.email}"

# TODO grades

