from days.models import Day
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.http import JsonResponse, HttpResponseForbidden
from django.shortcuts import render, redirect
from django.views.decorators.http import require_POST
from users.utils import get_friends, not_user_and_friends

from .forms import UserEditForm, ProfileEditForm
from .models import ProfilePhoto


@login_required
def profile(request, username=None):
    user = User.objects.get(username=username) if username else request.user

    if not_user_and_friends(user, request.user):
        return render(request, "restricted_page.html", status=403)

    friends = get_friends(user, limit=6)
    public_days = Day.objects.filter(user=user, access_mode=Day.PUBLIC).order_by('-date')
    context = {"specific_user": user, "friends": friends, "public_days": public_days}
    if user == request.user:
        if request.method == "POST":
            user_form = UserEditForm(request.POST, instance=request.user)
            profile_form = ProfileEditForm(
                request.POST, request.FILES, instance=request.user.profile
            )
            if user_form.is_valid() and profile_form.is_valid():
                user_form.save()
                profile_form.save()
                return redirect("home")
            else:
                for form in [user_form, profile_form]:
                    for field in form.errors:
                        error = form.errors[field].as_text()
                        messages.error(request, error)

        user_form = UserEditForm(instance=user)
        profile_form = ProfileEditForm(instance=user.profile)
        context["user_edit_form"] = user_form
        context["profile_edit_form"] = profile_form
    return render(request, "profiles/profile.html", context)


@login_required
@require_POST
def delete_profile_photo(request, pk):
    try:
        profile_photo = ProfilePhoto.objects.get(pk=pk)

        if request.user != profile_photo.profile.user:
            return HttpResponseForbidden()

        profile_photo.delete()
        return JsonResponse({"message": "Photo successfully deleted"})

    except ProfilePhoto.DoesNotExist:
        return JsonResponse(
            {"error": "Photo with provided id does not exist"}, status=404
        )


@login_required
@require_POST
def add_profile_photo(request):
    if request.FILES.get("image"):
        image = request.FILES["image"]
        profile_photo = ProfilePhoto.objects.create(
            profile=request.user.profile, image=image
        )
        return JsonResponse(
            {"photo": {"url": profile_photo.image.url, "id": profile_photo.pk}},
            status=200,
        )
    else:
        return JsonResponse({"error": "No photo provided"}, status=400)
