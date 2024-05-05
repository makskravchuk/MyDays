from django.contrib import admin

from .models import Day, Mood, Task, Weather, MusicalComposition, RelatedPerson, Achievement, LifeLesson, \
    VisitedPlace, MediaContent


class MoodInline(admin.TabularInline):
    model = Mood


class TaskInline(admin.TabularInline):
    model = Task


class WeatherInline(admin.TabularInline):
    model = Weather


class MusicalCompositionInline(admin.TabularInline):
    model = MusicalComposition


class RelatedPersonInline(admin.TabularInline):
    model = RelatedPerson


class AchievementInline(admin.TabularInline):
    model = Achievement


class LifeLessonInline(admin.TabularInline):
    model = LifeLesson


class VisitedPlaceInline(admin.TabularInline):
    model = VisitedPlace


class MediaContentInline(admin.TabularInline):
    model = MediaContent


class DayAdmin(admin.ModelAdmin):
    inlines = [
        MoodInline,
        TaskInline,
        WeatherInline,
        MusicalCompositionInline,
        RelatedPersonInline,
        AchievementInline,
        LifeLessonInline,
        VisitedPlaceInline,
        MediaContentInline,
    ]


admin.site.register(Day, DayAdmin)
