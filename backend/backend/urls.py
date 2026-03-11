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
    path('api/admin/reset_user_password', views.ResetUserPassword.as_view()),
    path("api/admin/management/", include(router.urls)),
    path("api/lecturer/dashboard", views.LecturerDashboardView.as_view()),
    path("api/student/dashboard", views.StudentDashboardView.as_view()),
    path("api/student/courselist", views.StudentCourseListView.as_view()),
    path("api-auth/", include("rest_framework.urls", namespace="rest_framework")),
    path("auth/", include("dj_rest_auth.urls")),
]
