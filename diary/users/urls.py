from django.urls import path

from . import views

urlpatterns = [
    path("login/", views.user_login, name="login"),
    path("logout/", views.user_logout, name='logout'),
    path("register/", views.user_register, name='register'),
    path("friend-requests/", views.user_friend_requests, name='friend_requests'),
    path("friendship/send/<int:to_user>", views.user_send_friendship_request, name='send_friendship_request'),
    path("friendship/accept/<int:from_user>", views.user_accept_friendship, name='accept_friendship'),
    path("friendship/remove/<int:user>", views.user_remove_friendship, name='remove_friendship'),
    path("search/", views.search_for_people, name="search_people"),
    path("<str:username>/friends/", views.user_friends, name='friends'),
    path("friends/days/", views.friends_days, name='friends_days'),
]
