"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include, path

from rest_framework import routers

from app import views

router = routers.DefaultRouter()

router.register(r"lecturers", views.LecturerViewSet)
router.register(r"courses", views.CourseViewSet)
router.register(r"subjects", views.SubjectViewSet)
router.register(r"students", views.StudentViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path("api-auth/", include("rest_framework.urls", namespace="rest_framework")),

    path("api/admin/dashboard/", views.AdminDashboardView.as_view()),
    path("api/admin/management/", include(router.urls)),
    path('api/admin/reset_password/<int:id>/', views.ResetAccountPassword.as_view()),

    path("api/lecturer/dashboard/", views.LecturerDashboardView.as_view()),
    path("api/lecturer/courses/", views.LecturerCoursesView.as_view()),
    path("api/lecturer/courses/<int:pk>/", views.LecturerCoursesView.as_view()),
    path("api/lecturer/coursegrades/<int:course_id>/", views.LecturerCourseGradesView.as_view()),

    path("api/student/dashboard/", views.StudentDashboardView.as_view()),
    path("api/student/enrolment/", views.StudentEnrolmentView.as_view()),
    path("api/student/enrolment/<int:pk>/", views.StudentEnrolmentView.as_view()),

    path("auth/", include("dj_rest_auth.urls")),
    path("api/my_role/", views.MyRoleView.as_view()),
]
