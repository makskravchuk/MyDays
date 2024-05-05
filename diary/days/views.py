import json
from datetime import datetime

from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.core.serializers.json import DjangoJSONEncoder
from django.db.models import Q
from django.http import HttpResponseBadRequest, JsonResponse
from django.shortcuts import render, get_object_or_404
from django.utils import timezone
from django.views.decorators.http import require_POST
from users.utils import not_user_and_friends

from .models import Day, Mood, MediaContent, VisitedPlace, RelatedPerson, MusicalComposition, Achievement, LifeLesson, \
    Weather, Task


@login_required
def view_day(request, username, date):
    return _handle_day_request(request, username, date, edit_mode=False)


@login_required
def edit_day(request, username, date):
    return _handle_day_request(request, username, date, edit_mode=True)


@login_required
def calendar(request):
    day_parameter = request.GET.get('day_parameter', None)
    search_query = request.GET.get('search_query', None)
    filters = {Day.get_day_search_parameter(day_parameter): search_query}
    context = {}
    if day_parameter and search_query:
        search_results = Day.objects.filter(user=request.user, **filters)
        serialized_results = []
        for result in search_results:
            serialized_result = {
                'title': result.title,
                'image_title': result.image_title.url,
                'access_mode': result.access_mode,
                'date': result.date,
                'day_type': {'type': result.get_day_type_display(), 'emoji': result.day_type_emoji}
            }
            serialized_results.append(serialized_result)

        context.update({'search_results': json.dumps(serialized_results, cls=DjangoJSONEncoder)})
    return render(request, 'calendar/calendar.html', context)


@login_required
def calendar_month_days(request):
    if request.method == 'GET':
        year = int(request.GET.get('year'))
        month = int(request.GET.get('month'))
        first_day = int(request.GET.get('first_day'))
        last_day = int(request.GET.get('last_day'))
        days = Day.objects.filter(Q(user=request.user) &
                                  Q(date__year=year, date__month=month) & Q(date__day__gte=first_day,
                                                                            date__day__lte=last_day)
                                  ).order_by('date')
        days_dict = {}
        for day in days:
            days_dict[int(day.date.day)] = {
                'access_mode': day.access_mode,
                'day_type': {
                    'type': day.get_day_type_display(),
                    'emoji': day.day_type_emoji,
                },
                'title': day.title,
                'image_title': day.image_title.url if day.image_title else None,
            }
        return JsonResponse({'days': days_dict}, status=200)
    else:
        return HttpResponseBadRequest()


@login_required
def view_achievements(request):
    achievements = Achievement.objects.filter(day__user=request.user).order_by('-day__date')
    return render(request, 'lists/achievements.html', {'achievements': achievements})


@login_required
def view_life_lessons(request):
    life_lessons = LifeLesson.objects.filter(day__user=request.user).order_by('-day__date')
    return render(request, 'lists/life-lessons.html', {'life_lessons': life_lessons})


@login_required
def view_conclusions(request):
    days = Day.objects.filter(user=request.user).exclude(Q(conclusion__isnull=True) | Q(conclusion='')).order_by(
        '-date')
    return render(request, 'lists/conclusions.html', {'days': days})


def _handle_day_request(request, username, date, edit_mode=False):
    user = get_object_or_404(User, username=username)
    date_obj = datetime.strptime(date, "%Y-%m-%d")

    if not edit_mode and not_user_and_friends(user, request.user):
        return render(request, "restricted_page.html", status=403)

    if edit_mode and user != request.user:
        return render(request, "restricted_page.html", status=403)

    if user == request.user:
        if user.profile.date_of_birth <= date_obj.date() <= timezone.localtime(timezone.now()).date():
            day, created = Day.objects.get_or_create(user=request.user, date=date_obj)
        else:
            return HttpResponseBadRequest(
                "Некоректна дата. Дата повинна бути в межах від дня народження користувача "
                "до сьогоднішнього дня."
            )
    else:
        day = get_object_or_404(Day, user=user, date=date_obj)
        if day.access_mode == day.PRIVATE:
            return render(request, "restricted_page.html", status=403)

    return render(
        request,
        "days/day.html",
        {"day": day, "edit_mode": edit_mode, "moods_list": Mood.moods_list()},
    )


def user_access_required(view_func):
    def wrapper(request, username, *args, **kwargs):
        if request.user.username == username:
            return view_func(request, username, *args, **kwargs)
        else:
            return JsonResponse({"message": "Access denied"}, status=403)

    return wrapper


def day_successful_changes(field, updated, data=None):
    return JsonResponse(
        {"message": f"{field} successfully changed",
         "updated": timezone.localtime(updated).strftime("%d.%m.%Y, %H:%M"),
         "data": data}, status=200)


def get_key_by_value(value, choices):
    for key, val in choices:
        if val == value:
            return key
    return None


@login_required
@require_POST
@user_access_required
def edit_day_title(request, username, date):
    day = Day.objects.get(user=request.user, date=date)
    day.title = request.POST.get("title")
    day.save()
    return day_successful_changes('title', day.updated)


@login_required
@require_POST
@user_access_required
def edit_day_image_title(request, username, date):
    if request.FILES.get("image_title"):
        day = Day.objects.get(user=request.user, date=date)
        day.image_title = request.FILES["image_title"]
        day.save()
        return day_successful_changes('image_title', day.updated)
    else:
        return JsonResponse({"error": "No photo provided"}, status=400)


@login_required
@require_POST
@user_access_required
def edit_day_text_description(request, username, date):
    day = Day.objects.get(user=request.user, date=date)
    day.text_description = request.POST.get("text_description")
    day.save()
    return day_successful_changes('text_description', day.updated)


@login_required
@require_POST
@user_access_required
def edit_day_type(request, username, date):
    day = Day.objects.get(user=request.user, date=date)
    day.day_type = get_key_by_value(request.POST.get("day_type"), Day.DAY_TYPE_CHOICES)
    day.save()
    return day_successful_changes('day_type', day.updated)


@login_required
@require_POST
@user_access_required
def edit_day_access_mode(request, username, date):
    day = Day.objects.get(user=request.user, date=date)
    day.access_mode = get_key_by_value(request.POST.get("access_mode"), Day.ACCESS_MODE_CHOICES)
    day.save()
    return day_successful_changes('access_mode', day.updated)


@login_required
@require_POST
@user_access_required
def edit_day_conclusion(request, username, date):
    day = Day.objects.get(user=request.user, date=date)
    day.conclusion = request.POST.get("conclusion")
    day.save()
    return day_successful_changes('conclusion', day.updated)


@login_required
@require_POST
@user_access_required
def edit_day_feeling(request, username, date):
    day = Day.objects.get(user=request.user, date=date)
    day.feeling = get_key_by_value(request.POST.get("feeling"), Day.FEELING_CHOICES)
    day.save()
    return day_successful_changes('feeling', day.updated, day.feeling_description)


@login_required
@require_POST
@user_access_required
def edit_day_mood(request, username, date):
    day = Day.objects.get(user=request.user, date=date)
    mood, created = Mood.objects.get_or_create(day=day)
    if request.POST.get("morning_mood"):
        mood.morning_mood = get_key_by_value(request.POST.get("morning_mood"), Mood.MOOD_CHOICES)
    elif request.POST.get("noon_mood"):
        mood.noon_mood = get_key_by_value(request.POST.get("noon_mood"), Mood.MOOD_CHOICES)
    elif request.POST.get("evening_mood"):
        mood.evening_mood = get_key_by_value(request.POST.get("evening_mood"), Mood.MOOD_CHOICES)
    elif request.POST.get("night_mood"):
        mood.night_mood = get_key_by_value(request.POST.get("night_mood"), Mood.MOOD_CHOICES)
    else:
        return JsonResponse({"error": "Mood not given"}, status=400)
    mood.save()
    day.updated = mood.updated
    day.save()
    return day_successful_changes('mood', day.updated)


@login_required
@require_POST
@user_access_required
def edit_day_media_content_add(request, username, date):
    day = Day.objects.get(user=request.user, date=date)
    file = request.FILES.get("file")
    if file:
        content_type = request.POST.get("type")
        description = request.POST.get("description")
        media_content = MediaContent.objects.create(day=day, content_type=content_type, file=file,
                                                    description=description)
        day.updated = media_content.updated
        day.save()
        return day_successful_changes('media_content', day.updated,
                                      {"url": media_content.file.url, "id": media_content.pk})
    else:
        return JsonResponse({"error": "No media provided"}, status=400)


@login_required
@require_POST
@user_access_required
def edit_day_media_content_delete(request, username, date, id):
    day = Day.objects.get(user=request.user, date=date)
    day.mediacontent_set.filter(id=id).delete()
    day.updated = timezone.now()
    day.save()
    return day_successful_changes('media_content', day.updated)


@login_required
@require_POST
@user_access_required
def edit_day_visited_place_add(request, username, date):
    day = Day.objects.get(user=request.user, date=date)
    longitude = request.POST.get("longitude")
    latitude = request.POST.get("latitude")
    title = request.POST.get("title")
    visited_place = VisitedPlace.objects.create(day=day, longitude=longitude, latitude=latitude, title=title)
    day.updated = visited_place.updated
    day.save()
    return day_successful_changes('visited_places', day.updated, {'place_id': visited_place.id})


@login_required
@require_POST
@user_access_required
def edit_day_visited_place_delete(request, username, date, id):
    day = Day.objects.get(user=request.user, date=date)
    day.visited_places.filter(id=id).delete()
    day.updated = timezone.now()
    day.save()
    return day_successful_changes('visited_places', day.updated)


@login_required
@require_POST
@user_access_required
def edit_day_related_person_add(request, username, date):
    day = Day.objects.get(user=request.user, date=date)
    name = request.POST.get("name")
    related_person = RelatedPerson.objects.create(day=day, name=name)
    day.updated = related_person.updated
    day.save()
    return day_successful_changes('related_people', day.updated, {'person_id': related_person.id})


@login_required
@require_POST
@user_access_required
def edit_day_related_person_delete(request, username, date, id):
    day = Day.objects.get(user=request.user, date=date)
    day.related_people.filter(id=id).delete()
    day.updated = timezone.now()
    day.save()
    return day_successful_changes('related_people', day.updated)


@login_required
@require_POST
@user_access_required
def edit_day_musical_composition_add(request, username, date):
    day = Day.objects.get(user=request.user, date=date)
    author = request.POST.get("author")
    name = request.POST.get("name")
    musical_composition = MusicalComposition.objects.create(day=day, author=author, name=name)
    day.updated = musical_composition.updated
    day.save()
    return day_successful_changes('musical_compositions', day.updated, {'composition_id': musical_composition.id})


@login_required
@require_POST
@user_access_required
def edit_day_musical_composition_delete(request, username, date, id):
    day = Day.objects.get(user=request.user, date=date)
    day.musical_compositions.filter(id=id).delete()
    day.updated = timezone.now()
    day.save()
    return day_successful_changes('musical_compositions', day.updated)


@login_required
@require_POST
@user_access_required
def edit_day_achievement_add(request, username, date):
    day = Day.objects.get(user=request.user, date=date)
    text = request.POST.get("text")
    achievement = Achievement.objects.create(day=day, text=text)
    day.updated = achievement.updated
    day.save()
    return day_successful_changes('achievements', day.updated, {'achievement_id': achievement.id})


@login_required
@require_POST
@user_access_required
def edit_day_achievement_delete(request, username, date, id):
    day = Day.objects.get(user=request.user, date=date)
    day.achievements.filter(id=id).delete()
    day.updated = timezone.now()
    day.save()
    return day_successful_changes('achievements', day.updated)


@login_required
@require_POST
@user_access_required
def edit_day_achievement_change(request, username, date, id):
    day = Day.objects.get(user=request.user, date=date)
    day.achievements.filter(id=id).update(text=request.POST.get("text"))
    day.updated = timezone.now()
    day.save()
    return day_successful_changes('achievements', day.updated)


@login_required
@require_POST
@user_access_required
def edit_day_life_lesson_add(request, username, date):
    day = Day.objects.get(user=request.user, date=date)
    text = request.POST.get("text")
    life_lesson = LifeLesson.objects.create(day=day, text=text)
    day.updated = LifeLesson.updated
    day.save()
    return day_successful_changes('life_lessons', day.updated, {'lesson_id': life_lesson.id})


@login_required
@require_POST
@user_access_required
def edit_day_life_lesson_delete(request, username, date, id):
    day = Day.objects.get(user=request.user, date=date)
    day.life_lessons.filter(id=id).delete()
    day.updated = timezone.now()
    day.save()
    return day_successful_changes('life_lessons', day.updated)


@login_required
@require_POST
@user_access_required
def edit_day_life_lesson_change(request, username, date, id):
    day = Day.objects.get(user=request.user, date=date)
    day.life_lessons.filter(id=id).update(text=request.POST.get("text"))
    day.updated = timezone.now()
    day.save()
    return day_successful_changes('life_lessons', day.updated)


@login_required
@require_POST
@user_access_required
def edit_day_set_weather(request, username, date):
    day = Day.objects.get(user=request.user, date=date)
    weather = None
    if Weather.objects.filter(day=day).exists():
        weather = Weather.objects.get(day=day)
    else:
        weather = Weather(day=day)
    weather.min_temperature = round(float(request.POST.get('min_temperature')))
    weather.max_temperature = round(float(request.POST.get('max_temperature')))
    weather.description = request.POST.get('description')
    weather.icon_url = request.POST.get('icon_url')
    weather.save()
    day.updated = timezone.now()
    day.save()
    return day_successful_changes('weather', day.updated)


@login_required
@require_POST
@user_access_required
def edit_day_task_add(request, username, date):
    day = Day.objects.get(user=request.user, date=date)
    execution_time = request.POST.get("execution_time")
    status = request.POST.get("status")
    description = request.POST.get("description")
    task = Task.objects.create(day=day, execution_time=execution_time, status=status, description=description)
    day.updated = timezone.now()
    day.save()
    return day_successful_changes('tasks', day.updated, {'task_id': task.id})


@login_required
@require_POST
@user_access_required
def edit_day_task_delete(request, username, date, id):
    day = Day.objects.get(user=request.user, date=date)
    day.tasks.filter(id=id).delete()
    day.updated = timezone.now()
    day.save()
    return day_successful_changes('tasks', day.updated)


@login_required
@require_POST
@user_access_required
def edit_day_task_status(request, username, date, id):
    day = Day.objects.get(user=request.user, date=date)
    status = request.POST.get("status")
    day.tasks.filter(id=id).update(status=status)
    day.updated = timezone.now()
    day.save()
    return day_successful_changes('tasks', day.updated)
