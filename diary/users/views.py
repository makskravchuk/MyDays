from days.models import Day
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.db.models import Q
from django.http import JsonResponse
from django.shortcuts import redirect, render, get_object_or_404
from django.views.decorators.http import require_POST

from .forms import ProfileRegisterForm, UserRegisterForm
from .models import Friendship
from .utils import not_user_and_friends, get_friendship_status, get_friends_friendship_status, get_friend_requests, \
    get_friends


def user_login(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(request, username=username, password=password)
        if user:
            login(request, user)
            return redirect('home')
        else:
            return render(request, 'auth/login.html', {'error': "Неправильний пароль або ім'я користувача"})
    else:
        if request.user.is_authenticated:
            return redirect('home')
        else:
            return render(request, 'auth/login.html')


def user_logout(request):
    logout(request)
    return redirect('login')


def user_register(request):
    if (request.method == 'POST'):
        user_form = UserRegisterForm(request.POST)
        profile_form = ProfileRegisterForm(request.POST)
        if user_form.is_valid() and profile_form.is_valid():

            username = user_form.cleaned_data['username']
            email = user_form.cleaned_data['email']
            password = user_form.cleaned_data['password']
            user = User.objects.create_user(username=username, email=email, password=password)
            user.first_name = user_form.cleaned_data['first_name']
            user.last_name = user_form.cleaned_data['last_name']
            user.save()

            profile = profile_form.save(commit=False)
            profile.user = user
            profile.save()

            login(request, user)

            return redirect('home')
        else:
            errors = []
            for form in [user_form, profile_form]:
                for field in form.errors:
                    error = form.errors[field].as_text()
                    errors.append(error)
            return render(request, "auth/register.html",
                          {'profile_form': profile_form, 'user_form': user_form, 'errors': errors})
    else:
        user_form = UserRegisterForm()
        profile_form = ProfileRegisterForm()
    return render(request, "auth/register.html", {'profile_form': profile_form, 'user_form': user_form})


@login_required
def user_friends(request, username):
    user = get_object_or_404(User, username=username) if username else request.user
    if not_user_and_friends(user, request.user):
        return render(request, 'restricted_page.html', status=403)

    context = {'title': 'Близькі люди'}

    friends = get_friends_friendship_status(request.user, user)
    if friends:
        context['friends'] = friends

    return render(request, "friendship/friends_list.html", context)


@login_required
def user_friend_requests(request):
    context = {'title': 'Запити на дружбу', 'friendship_status': Friendship.PENDING}
    users = get_friend_requests(request.user)
    if users:
        context['friends'] = users

    return render(request, "friendship/friends_list.html", context)


@require_POST
@login_required
def user_send_friendship_request(request, to_user):
    user = get_object_or_404(User, pk=to_user)
    if not_user_and_friends(request.user, user) and not Friendship.objects.filter(
            Q(from_user=request.user, to_user=user) | Q(from_user=user, to_user=request.user)).exists():
        friendship = Friendship.objects.create(from_user=request.user, to_user=user)
        return JsonResponse({'friendshipStatus': 'sent'})
    else:
        return JsonResponse({'error': 'User is already friend or request is pending'}, status=400)


@require_POST
@login_required
def user_accept_friendship(request, from_user):
    friendship = get_object_or_404(Friendship, from_user=from_user, to_user=request.user)
    friendship.status = Friendship.ACCEPTED
    friendship.save()
    return JsonResponse({'friendshipStatus': friendship.status})


@require_POST
@login_required
def user_remove_friendship(request, user):
    friendship = Friendship.objects.filter(
        Q(from_user=request.user, to_user=user) | Q(from_user=user, to_user=request.user)).first()
    if friendship:
        friendship.delete()
        return JsonResponse({'friendshipStatus': 'no_friendship'})
    else:
        return JsonResponse({'error': 'Friendship is not found'}, status=404)


@login_required
def search_for_people(request):
    query = request.GET.get('q', '')
    alternative = request.GET.get('alt', '')

    if query and query.strip() != "":
        users = User.objects.filter(
            Q(username__icontains=query) |
            Q(first_name__icontains=query) |
            Q(last_name__icontains=query) |
            Q(profile__country__icontains=query) |
            Q(profile__city__icontains=query)
        )[:30]
        people = []
        for user in users:
            friendship = Friendship.objects.filter(
                Q(from_user=request.user, to_user=user) | Q(from_user=user, to_user=request.user)).first()
            if friendship:
                people.append((user, get_friendship_status(request.user, user)))
            else:
                people.append((user, 'no_friendship'))
    else:
        if alternative == "friends":
            people = get_friends_friendship_status(request.user, request.user)
        elif alternative == 'friend-requests':
            people = get_friend_requests(request.user)

    serialized_people = [
        {'user': {
            'id': person[0].id,
            'username': person[0].username,
            'firstName': person[0].first_name,
            'lastName': person[0].last_name,
            'mainPhoto': person[0].profile.main_photo.url if person[0].profile.main_photo else None,
        },
            'status': person[1]
        } for person in people
    ]

    return JsonResponse({'people': serialized_people}, status=200)


@login_required
def friends_days(request):
    friends = get_friends(request.user)
    days = Day.objects.filter(access_mode=Day.PUBLIC, user__in=friends).order_by('-date')
    return render(request, "days_feed/friends_days.html", {"friends_days": days})
