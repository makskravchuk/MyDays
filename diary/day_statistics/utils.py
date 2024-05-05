import calendar

from days.models import Mood, Day
from django.db.models import Count, Q
from django.utils import timezone


def count_moods(user, period, year=None, month=None):
    filters = {
        'all': {'day__user': user},
        'year': {'day__user': user, 'day__date__year': year},
        'month': {'day__user': user, 'day__date__year': year, 'day__date__month': month},
    }
    moods_query_set = Mood.objects.filter(**filters[period])

    morning_counts = []
    noon_counts = []
    evening_counts = []
    night_counts = []

    for value, display_value in Mood.MOOD_CHOICES:
        counted_mood = moods_query_set.aggregate(
            morning_count=Count('id', filter=Q(morning_mood=value)),
            noon_count=Count('id', filter=Q(noon_mood=value)),
            evening_count=Count('id', filter=Q(evening_mood=value)),
            night_count=Count('id', filter=Q(night_mood=value)),
        )
        morning_counts.append(counted_mood['morning_count'])
        noon_counts.append(counted_mood['noon_count'])
        evening_counts.append(counted_mood['evening_count'])
        night_counts.append(counted_mood['night_count'])

    return {'morning_moods': morning_counts, 'noon_moods': noon_counts, 'evening_moods': evening_counts,
            'night_moods': night_counts}


def count_day_types(user, period, year=None, month=None):
    filters = {
        'all': {'user': user},
        'year': {'user': user, 'date__year': year},
        'month': {'user': user, 'date__year': year, 'date__month': month},
    }
    days_query_set = Day.objects.filter(**filters[period])
    day_types_count = []
    for value, display_value in Day.DAY_TYPE_CHOICES:
        day_type_count = days_query_set.aggregate(
            day_type_count=Count('id', filter=Q(day_type=value)),
        )['day_type_count']
        day_types_count.append(day_type_count)

    return {'day_types_count': day_types_count}


def get_feelings(user, period, year=None, month=None):
    current_date = timezone.localtime(timezone.now()).date()
    filters = {
        'all': {'user': user},
        'year': {'user': user, 'date__year': year},
        'month': {'user': user, 'date__year': year, 'date__month': month},
    }
    days_number = {
        'all': (current_date - user.profile.date_of_birth).days + 1,
        'year': (366 if calendar.isleap(year) else 365) if year else None,
        'month': calendar.monthrange(year, month)[1] if month else None,
    }
    days = Day.objects.filter(**filters[period], feeling__isnull=False).order_by('date')
    feelings = []

    for day in days:
        day_number = None
        match period:
            case 'all':
                day_number = (day.date - user.profile.date_of_birth).days + 1
            case 'year':
                day_number = day.date.timetuple().tm_yday
            case 'month':
                day_number = day.date.day
        feelings.append((day_number, day.get_feeling_display()))
    return {'feelings': feelings, 'feelings_days_range': days_number[period]}
