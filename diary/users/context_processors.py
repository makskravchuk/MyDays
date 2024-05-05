from .models import Friendship

def pending_friend_requests_count(request):
    if request.user.is_authenticated:
        pending_requests_count = Friendship.objects.filter(to_user=request.user, status='pending').count()
    else:
        pending_requests_count = 0
    return {'pending_friend_requests_count': pending_requests_count}