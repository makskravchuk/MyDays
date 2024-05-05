from django.urls import path

from . import views

urlpatterns = [
    path('statistics/', views.view_statistics, name='view_statistics'),
    path('statistics/day_types/', views.get_day_types_data),
    path('statistics/moods/', views.get_moods_data),
    path('statistics/feelings/', views.get_feelings_data),
]
