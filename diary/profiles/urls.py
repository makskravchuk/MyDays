from django.urls import path

from . import views

urlpatterns = [
    path("", views.profile, name="home"),
    path("delete/profile_photo/<int:pk>/", views.delete_profile_photo, name="delete_profile_photo"),
    path("add_profile_photo/", views.add_profile_photo, name="add_profile_photo"),
    path("<str:username>/", views.profile, name="profile"),
]
