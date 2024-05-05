from django.urls import path

from . import views

DAY_URL_PATTERN = "<str:username>/day/<str:date>/"

urlpatterns = [
    path(DAY_URL_PATTERN, views.view_day, name="view_day"),
    path(f"{DAY_URL_PATTERN}edit/", views.edit_day, name="edit_day"),
    path("calendar/", views.calendar, name="calendar"),
    path("calendar/month/", views.calendar_month_days),
    path("achievements/", views.view_achievements, name="view_achievements"),
    path("life-lessons/", views.view_life_lessons, name="view_life_lessons"),
    path("conclusions/", views.view_conclusions, name="view_conclusions"),
    path(
        f"{DAY_URL_PATTERN}edit/title/",
        views.edit_day_title,
        name="edit_day_title",
    ),
    path(
        f"{DAY_URL_PATTERN}edit/image_title/",
        views.edit_day_image_title,
        name="edit_day_image_title",
    ),
    path(
        f"{DAY_URL_PATTERN}edit/text_description/",
        views.edit_day_text_description,
        name="edit_day_text_description",
    ),
    path(
        f"{DAY_URL_PATTERN}edit/day_type/",
        views.edit_day_type,
        name="edit_day_type",
    ),
    path(
        f"{DAY_URL_PATTERN}edit/access_mode/",
        views.edit_day_access_mode,
        name="edit_day_access_mode",
    ),
    path(
        f"{DAY_URL_PATTERN}edit/conclusion/",
        views.edit_day_conclusion,
        name="edit_day_conclusion",
    ),
    path(
        f"{DAY_URL_PATTERN}edit/feeling/",
        views.edit_day_feeling,
        name="edit_day_feeling",
    ),
    path(
        f"{DAY_URL_PATTERN}edit/mood/",
        views.edit_day_mood,
        name="edit_day_mood",
    ),
    path(
        f"{DAY_URL_PATTERN}edit/task/add/",
        views.edit_day_task_add,
        name="edit_day_task_add",
    ),
    path(
        f"{DAY_URL_PATTERN}edit/task/<int:id>/delete/",
        views.edit_day_task_delete,
        name="edit_day_task_delete",
    ),
    path(
        f"{DAY_URL_PATTERN}edit/task/<int:id>/status/change/",
        views.edit_day_task_status,
        name="edit_day_task_status",
    ),
    path(
        f"{DAY_URL_PATTERN}edit/media_content/add/",
        views.edit_day_media_content_add,
        name="edit_day_media_content_add",
    ),
    path(
        f"{DAY_URL_PATTERN}edit/media_content/<int:id>/delete/",
        views.edit_day_media_content_delete,
        name="edit_day_media_content_delete",
    ),
    path(
        f"{DAY_URL_PATTERN}edit/visited_place/add/",
        views.edit_day_visited_place_add,
        name="edit_day_visited_place_add",
    ),
    path(
        f"{DAY_URL_PATTERN}edit/visited_place/<int:id>/delete/",
        views.edit_day_visited_place_delete,
        name="edit_day_visited_place_delete",
    ),
    path(
        f"{DAY_URL_PATTERN}edit/musical_composition/add/",
        views.edit_day_musical_composition_add,
        name="edit_day_musical_composition_add",
    ),
    path(
        f"{DAY_URL_PATTERN}edit/musical_composition/<int:id>/delete/",
        views.edit_day_musical_composition_delete,
        name="edit_day_musical_composition_delete",
    ),
    path(
        f"{DAY_URL_PATTERN}edit/weather/set/",
        views.edit_day_set_weather,
        name="edit_day_set_weather",
    ),
    path(
        f"{DAY_URL_PATTERN}edit/related_person/add/",
        views.edit_day_related_person_add,
        name="edit_day_related_person_add",
    ),
    path(
        f"{DAY_URL_PATTERN}edit/related_person/<int:id>/delete/",
        views.edit_day_related_person_delete,
        name="edit_day_related_person_delete",
    ),
    path(
        f"{DAY_URL_PATTERN}edit/achievement/add/",
        views.edit_day_achievement_add,
        name="edit_day_achievement_add",
    ),
    path(
        f"{DAY_URL_PATTERN}edit/achievement/<int:id>/delete/",
        views.edit_day_achievement_delete,
        name="edit_day_achievement_delete",
    ),
    path(
        f"{DAY_URL_PATTERN}edit/achievement/<int:id>/change/",
        views.edit_day_achievement_change,
        name="edit_day_achievement_change",
    ),
    path(
        f"{DAY_URL_PATTERN}edit/life_lesson/add/",
        views.edit_day_life_lesson_add,
        name="edit_day_life_lesson_add",
    ),
    path(
        f"{DAY_URL_PATTERN}edit/life_lesson/<int:id>/delete/",
        views.edit_day_life_lesson_delete,
        name="edit_day_life_lesson_delete",
    ),
    path(
        f"{DAY_URL_PATTERN}edit/life_lesson/<int:id>/change/",
        views.edit_day_life_lesson_change,
        name="edit_day_life_lesson_change",
    ),
]
