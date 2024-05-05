from days.models import Mood, Day
from django.contrib.auth.decorators import login_required
from django.core.exceptions import ValidationError
from django.http import JsonResponse
from django.shortcuts import render
from django.utils import timezone
from django.views.generic.base import TemplateView

from . import utils


@login_required
class DayStatisticsView(TemplateView):
    template_name = 'statistics.html'


@login_required
def view_statistics(request):
    parameters = _form_statistics_parameters(request)
    context = {'mood_labels': Mood.moods_list, 'feeling_labels': Day.feelings_list,
               'day_type_labels': Day.day_type_labels, 'period': parameters[1], 'year': parameters[2],
               'month': parameters[3]}
    context.update(utils.count_moods(*parameters))
    context.update(utils.count_day_types(*parameters))
    context.update(utils.get_feelings(*parameters))
    return render(request, 'statistics.html', context)


@login_required
def get_day_types_data(request):
    parameters = _form_statistics_parameters(request)
    data = utils.count_day_types(*parameters)
    return JsonResponse(data)


@login_required
def get_moods_data(request):
    parameters = _form_statistics_parameters(request)
    data = utils.count_moods(*parameters)
    return JsonResponse(data)


@login_required
def get_feelings_data(request):
    parameters = _form_statistics_parameters(request)
    data = utils.get_feelings(*parameters)
    return JsonResponse(data)


def _form_statistics_parameters(request):
    get_parameters = request.GET
    if get_parameters:
        period = get_parameters.get('period', None)
        year = get_parameters.get('year', None)
        month = get_parameters.get('month', None)
        try:
            if not any(period == value for value in ['all', 'year', 'month']):
                raise ValueError
            if month:
                month = int(month)
            if year:
                year = int(year)
        except:
            raise ValidationError("Wrong parameters")
        parameters = [request.user, period, year, month]
    else:
        current_date = timezone.localtime(timezone.now()).date()
        parameters = [request.user, 'month', current_date.year, current_date.month]
    return parameters
